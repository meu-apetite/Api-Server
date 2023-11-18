import Model from '../../models/CompanyModel.js';
import { v2 as cloudinary } from 'cloudinary';
import { upload } from '../../settings/multer.js';
import axios from 'axios';

class CompanyController {
  async getCompany(req, res) {
 
      const companyId = req.headers._id;
      const company = await Model.findById(companyId);
      return res.status(200).json(company);
  }

  async getData(req, res) {
    try {
      const id = req.headers._id;
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

  async getInfoAdmin(req, res) {
    try {
      const id = req.headers._id;
      const company = await Model.findById(id, 'owner');
      return res.status(200).json(company.owner);
    } catch (error) {
      console.log(error);
    }
  }

  async updateInfoAdmin(req, res) {
    try {
      const id = req.headers._id;
      const { phoneNumber, name, email } = req.body;
      const company = await Model.findByIdAndUpdate(
        id, {$set: { 'owner': { phoneNumber, name, email } }}, { new: true }
      );
      return res.status(200).json(company.owner);
    } catch (error) {
      console.log(error);
    }
  }

  async update(req, res) {
    try {
      const id = req.headers._id;
      const data = req.body;

      const company = await Model.findByIdAndUpdate(id, { $set: data }, { new: true });

      return res.status(200).json(company);
    } catch (error) {
      console.log(error);
    }
  }

  async addImageLogo(req, res) {
    upload.single('logo')(req, res, async (err) => {
      try {
        const companyId = req.headers._id;
        let image;

        if (req.file) {
          const upload = await cloudinary.uploader.upload(req.file.path, { folder: companyId });
          image = { url: upload.url, id: upload.public_id };
        }

        if (!image) {
          res.status(400).json({ success: false, message: 'Não foi possível atualizar o logo' });
          return;
        }

        await Model.findByIdAndUpdate(companyId, { $set: { 'custom.logo': image } });

        res.status(200).json(image);
      } catch (error) {
        console.log(error);

        return res.status(400).json({ success: false, message: 'Falha na requisição, tente novamente mais tarde' });
      }
    });
  }

  async removeImageLogo(req, res) {
    try {
      const companyId = req.headers._id;
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
        const companyId = req.headers._id;
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
      const companyId = req.headers._id;
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
      const companyId = req.headers._id;

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
      const companyId = req.headers._id;
      const address = await Model.findById(companyId, 'address');
      return res.status(200).json(address);
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  }

  async getPaymentOptions(req, res) {
    try {
      const companyId = req.headers._id;
      const credentialsMP = { accessToken: false, publicKey: true};

      const response = await Model.findById(companyId, 'paymentsMethods paymentOnline');
      
      if(response?.paymentOnline?.credentialsMP?.accessToken) {
        credentialsMP.accessToken = true;
      }

      if(response?.paymentOnline?.credentialsMP?.publicKey) {
        credentialsMP.publicKey = true;
      }

      response.paymentOnline.credentialsMP = credentialsMP;

      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  }

  async updatePaymentsMethods(req, res) {
    try {
      const data = req.body;
      const companyId = req.headers._id;
      const response = await Model.findByIdAndUpdate(
        companyId, { paymentsMethods: data }, { new: true }
      );

      return res.status(200).json(response.paymentsMethods);
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  }

  async updatePaymentsMethods(req, res) {
    try {
      const data = req.body;
      const companyId = req.headers._id;
      const response = await Model.findByIdAndUpdate(
        companyId, { paymentsMethods: data }, { new: true }
      );

      return res.status(200).json(response.paymentsMethods);
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  }

  async updateCredentialsMercadoPago(req, res) {
    try {
      const { credentials } = req.body; //credentials: { publicKey: String, accessToken: String }
      const companyId = req.headers._id;
      let update;

      if (!credentials || credentials == {}) {
        return res.status(400).json({ success: false, message: 'As credênciais estão vazias' });
      }

      if (credentials?.publicKey?.length > 1 && credentials?.accessToken?.length > 1) {
        update = { 'paymentOnline.credentialsMP': credentials };
      } else {
        if (credentials?.publicKey?.length > 1) {
          update = {
            'paymentOnline.credentialsMP.publicKey': credentials.publicKey
          };
        };
        if (credentials?.accessToken?.length > 1) {
          update = {
            'paymentOnline.credentialsMP.accessToken': credentials.accessToken
          };
        }
      }
    
      await Model.findByIdAndUpdate(companyId, { $set: update });
      
      return res.status(200).json({ 
        success: true, credentials: { publicKey: true, accessToken: true } 
      });
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false });
    }
  }

  async subscription(req, res) {
    console.log(req.body)

    subscription = {
      endpoint:
        'https://fcm.googleapis.com/fcm/send/dMtwGLB3r0c:APA91bE_ghXAcdXdQoNeldKUtO9v5O3bX0pD9lumyWx4Q5d6G_7forYsaVZWKsibciXjFFdXMns0Z_1osIyI5KPYJrseYUsg7Ij14evL1zLS4ylHzddPQL0u-b_S79-RjBUWf3Rdcl8J',
      keys: {
        p256dh:
          'BEWE-_Nlv3upfzeUZ-PK3uq5JpPdSZyXHkO8xBWTRHXgduXFl1silPjG7f_QHberIklX1TbtZBO10PK5WS5lySw',
        auth: 'ydjPabeW0jw8DiaWXUM8Qg',
      },
    };

  }
}

export default CompanyController;
