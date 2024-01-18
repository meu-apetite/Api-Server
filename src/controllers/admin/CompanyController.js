import Model from '../../models/CompanyModel.js';
import VerificationCodesModel from '../../models/VerificationCodesModel.js';
import { v2 as cloudinary } from 'cloudinary';
import { upload } from '../../settings/multer.js';
import { EmailService } from '../../services/EmailService.js';
import axios from 'axios';

class CompanyController {
  async getCompany(req, res) {
    const companyId = req.headers.companyid;
    const company = await Model.findById(companyId);
    if (!company.online) {
      if (company.verifyEmail && company.address.zipCode && company.custom.logo?.url?.length > 0) {
        const updateComapny = await Model.findOneAndUpdate(
          { _id: companyId },
          { $set: { online: true } },
          { upsert: true, new: true }
        );

        return res.status(200).json(updateComapny);
      }
    }
    return res.status(200).json(company);
  }

  async getData(req, res) {
    try {
      const id = req.headers.companyid;
      const company = await Model.findById(id);

      return res.status(200).json({
        fantasyName: company?.fantasyName,
        slogan: company.slogan,
        logo: company.custom.logo,
        googleMapUrl: company.custom.googleMapUrl,
        galleryImages: company.custom.galleryImages,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updateInfoAdmin(req, res) {
    try {
      const id = req.headers.companyid;
      const { phoneNumber, name, email } = req.body;
      const company = await Model.findByIdAndUpdate(
        id, { $set: { 'owner': { phoneNumber, name, email } } }, { new: true }
      );
      return res.status(200).json(company.owner);
    } catch (error) {
      console.log(error);
    }
  }

  async updateInfoContact(req, res) {
    try {
      const id = req.headers.companyid;
      const { whatsapp, email } = req.body;
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'E-mail inválido.' });
      }

      if (!whatsapp) {
        return res.status(400).json({ success: false, message: 'Whatsapp inválido.' });
      }
  
      await Model.findByIdAndUpdate( id, { $set: { whatsapp, email } });
  
      return res.status(200).json({ whatsapp, email });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
  }

  async updateAppearance(req, res) {
    try {
      const companyId = req.headers.companyid;
      const {
        fantasyName, 
        description, 
        colorPrimary, 
        colorSecondary,
        slogan
      } = req.body;

      const updatedCompany = await Model.findOneAndUpdate(
        { _id: companyId },
        {
          $set: {
            'custom.colorPrimary': colorPrimary,
            'custom.colorSecondary': colorSecondary,
            fantasyName, description, slogan
          },
        },
        { new: true } 
      );
      
      return res.status(200).json(updatedCompany);
    } catch (error) {
      console.log(error);
    }
  }

  async updateLogo(req, res) {
    upload.single('logo')(req, res, async (err) => {
      try {
        const companyId = req.headers.companyid;

        if (!req.file) return res.status(400).json({ 
          success: false, 
          message: 'Não foi possível atualizar o logo' 
        });

        const { custom } = await Model.findById(companyId, 'custom.logo');
        if (custom.logo.url) await cloudinary.uploader.destroy(id);

        const upload = await cloudinary.uploader
          .upload(req.file.path, { folder: companyId });
        
        await Model.findByIdAndUpdate(
          companyId, { 
            $set: { 'custom.logo': { url: upload.url, id: upload.public_id } } 
          }
        );
        
        res.status(200).json({ url: upload.url, id: upload.public_id });
      } catch (error) {
        console.log(error)
        return res.status(400).json({ 
          success: false, message: 'Erro ao atualizar a logo' 
        });
      }
    });
  }

  async removeImageLogo(req, res) {
    try {
      const companyId = req.headers.companyid;
      const { id } = req.params;

      const result = await cloudinary.uploader.destroy(id);
      await Model.findByIdAndUpdate(companyId, { $set: { 'custom.logo': null } });

      return res.status(200).json({ success: true, message: 'Logo excluída' });
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Não foi possivel excluir logo' });
    }
  }

  async addImageGallery(req, res) {
    upload.single('image')(req, res, async (err) => {
      try {
        const companyId = req.headers.companyid;
        let image;

        if (req.file) {
          const upload = await cloudinary.uploader.upload(req.file.path, { folder: companyId });
          image = { url: upload.url, id: upload.public_id };
        }

        if (!image) {
          res.status(400).json({ success: false, message: 'Não foi possível atualizar a galeria' });
          return;
        }

        const company = await Model.findByIdAndUpdate(
          companyId,
          { $push: { 'custom.gallery': { $each: [image] } } },
          { new: true }
        );

        res.status(200).json(company.custom.gallery);
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: 'Falha na requisição, tente novamente mais tarde' });
      }
    });
  }

  async removeImageGallery(req, res) {
    try {
      const companyId = req.headers.companyid;
      const { id } = req.params;

      await cloudinary.uploader.destroy(id);

      const company = await Model.findOneAndUpdate(
        { _id: companyId },
        { $pull: { 'custom.gallery': { id } } },
        { new: true }
      );

      res.status(200).json(company.custom.gallery);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, message: 'Não foi possivel excluir logo' });
    }
  }

  async updateAddress(req, res) {
    try {
      /** req: {street: string, number: number, zipCode: string, district: string, city: string} **/
      const companyId = req.headers.companyid;
      const data = req.body;
      const api = 'https://api.tomtom.com/search/2/geocode';
      const key = 'GmL5wOEl3iWP0n1l6O5sBV0XKo6gHwht';
      const query = `${data.street},${data.number},${data.zipCode},${data.district},${data.city}`;

      const response = await axios.get(api + `/${encodeURIComponent(query)}.json?key=${key}`);
      const result = response.data.results[0];

      const updateAddress = {
        state: result.address.countrySubdivision,
        city: result.address.municipality,
        street: result.address.streetName,
        district: result.address.municipalitySubdivision,
        zipCode: result.address.extendedPostalCode,
        coordinates: {
          latitude: result.position.lat,
          longitude: result.position.lon
        },
        freeformAddress: result.address.freeformAddress,
        number: data.number,
        reference: data.reference
      };

      const company = await Model.findOneAndUpdate(
        { _id: companyId },
        { $set: { address: updateAddress } },
        { new: true }
      );

      return res.status(200).json(company);
    } catch (error) {
      console.error(error);
    }
  };

  async getAddress(req, res) {
    try {
      const companyId = req.headers.companyid;
      const address = await Model.findById(companyId, 'address');
      return res.status(200).json(address);
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  }

  async updateSettingsDelivery(req, res) {
    try {
      /** req.body: { allowStorePickup, delivery, deliveryOption, minValue, kmValue } **/
      const companyId = req.headers.companyid;
      const data  = req.body;
      const company = await Model.findOneAndUpdate(
        { _id: companyId }, { $set: { settingsDelivery: data } }, { new: true }
      ).exec();
      return res.status(200).json(company);
    } catch (error) {
      console.error(error);
    }
  };

  async updateOpeningHours(req, res) {
    try {
      const companyId = req.headers.companyid;
      const company = await Model.findOneAndUpdate(
        { _id: companyId },
        { $set: { 'settings.openingHours': req.body } },
        { new: true, select: 'settings.openingHours' }
      )
      return res.status(200).json(company.settings.openingHours);
    } catch (error) {
      console.error(error);
    }
  };

  async sendCodeEmail(req, res) {
    try {
      const companyId = req.headers.companyid;

      const company = await Model.findById(companyId, 'email name');

      function randomCode() {
        const code = Math.floor(10000 + Math.random() * 90000); 
        return code.toString(); 
      }

      const code = randomCode()

      await VerificationCodesModel.findOneAndUpdate(
        { company: companyId },
        { $set: { code } },
        { upsert: true, new: true }
      );

      await new EmailService().sendCode(
        { to: company.email, subject: 'Código de verificação' },
        code, company.name
      );

      return res.status(200).json({ success: true, message: 'Código enviado!' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ success: false, message: 'Não foi possível enviar o código de verificação.' });
    }
  };

  async verifyCode(req, res) {
    try {
      const companyId = req.headers.companyid;
      const { code } = req.body;
      const verify = await VerificationCodesModel.findOne({ company: companyId });

      if (code != verify.code) {
        return res.status(400).json({ success: false, message: 'Código incorreto!' });
      }

      await Model.findByIdAndUpdate(companyId, { $set: { verifyEmail: true } });
      return res.status(200).json({ success: true, message: 'Email verifcado!' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ success: false, message: 'Não foi possível verificar o código.' });
    }
  };
}

export default CompanyController;
