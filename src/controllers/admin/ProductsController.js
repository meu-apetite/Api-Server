import { v2 as cloudinary } from 'cloudinary';
import Model from '../../models/ProductsModel.js';
import { upload } from '../../settings/multer.js';
import fs from 'fs';
import ComplementController from './ComplementController.js';

class ProductController {
  async getAll(req, res) {
    const company = req.headers.companyid;
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;

    try {
      const totalProducts = await Model.countDocuments({ company });
      const totalPages = Math.ceil(totalProducts / perPage);

      const products = await Model.find({ company })
        .populate('category', 'title')
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();

      return res.status(200).json({ products, totalPages, page });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Erro ao obter os produtos.' });
    }
  }

  async getProduct(req, res) {
    try {
      const company = req.headers.companyid;
      const { id } = req.params;

      const product = await Model.findById(id)
        .populate({ path: 'complements' })
        .populate({ path: 'category', select: 'title' });

      return res.status(200).json(product);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Erro ao obter os produtos.' });
    }
  }

  async create(req, res) {
    upload.array('images')(req, res, async (err) => {
      try {
        const company = req.headers.companyid;
        let {
          name,
          description,
          code,
          price,
          discountPrice,
          isActive,
          category,
          complements
        } = req.body;
        complements = complements || "[]";
        const images = [];

        if (!name.trim().length) {
          return res.status(400).json({
            success: false,
            message: 'Nome não pode ficar em branco'
          });
        }
        if (isNaN(price)) {
          return res.status(400).json({ success: false, message: 'Preço inválido' });
        }
        if (typeof (Number(price)) !== 'number') {
          return res.status(400).json({ success: false, message: 'Preço inválido' });
        }
        if (req.files.length <= 0) {
          return res.status(400).json({ success: false, message: 'É preciso enviar a foto do ptoduto' });
        }
        if (req.files.length) {
          const uploadPromises = req.files.map(file => {
            return cloudinary.uploader.upload(file.path, { folder: company });
          });
          const uploads = await Promise.all(uploadPromises);
          uploads.map(upload => images.push({ id: upload.public_id, url: upload.url }));
        }
        if (!category) {
          return res.status(400).json({ success: false, message: 'É preciso selecionar a categoria' });
        }

        const productLast = await Model.findOne({ category })
          .sort({ displayPosition: -1 })
          .exec();

        const product = await Model.create({
          isActive,
          company,
          name,
          description: description || '',
          code: code || '',
          category,
          images,
          discountPrice,
          displayPosition: (productLast?.displayPosition + 1 || 1),
          price: Number(price),
          complements: JSON.parse(complements)
        });

        res.status(200).json(product);
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: 'Falha na requisição, tente novamente mais tarde' });
      }
    });
  }

  async update(req, res) {
    const updateData = {};

    upload.array('images')(req, res, async (err) => {
      try {
        const { productId } = req.params;
        const company = req.headers.companyid;
        const data = req.body;

        if (!data.name.trim().length) {
          return res.status(400).json({
            success: false, message: 'Nome não pode ficar em branco'
          });
        }
        if (Number(data.price) == NaN) {
          return res.status(400).json({
            success: false, message: 'Preço inválido'
          });
        }
        if (typeof (Number(data.price)) !== 'number') {
          return res.status(400).json({
            success: false, message: 'Preço inválido'
          });
        }
        if (data.images?.length <= 0 && req.files.length <= 0) {
          return res.status(400).json({
            success: false, message: 'É preciso enviar a foto do produto'
          });
        }
     
        if (req.files.length) {
          //remove
          await cloudinary.uploader.destroy(data.imageId);
          //new image
          const result = await cloudinary.uploader.upload(req.files[0].path, { folder: company });
          updateData.images = [{ id: result.public_id, url: result.url }];
        }

        updateData.name = data.name;
        updateData.description = data.description;
        updateData.code = data.code;
        updateData.price = data.price;
        updateData.priceFormat = data.priceFormat;
        updateData.discountPrice = data.discountPrice;
        updateData.discountPriceFormat = data.discountPriceFormat;
        updateData.status = data.status;
        updateData.category = data.category;
        updateData.unit = data.unit;

        await new ComplementController().updateComplements(JSON.parse(data.complements));
        await Model.findByIdAndUpdate(productId, updateData);

        res.status(200).json({ success: true, message: 'Produto atualizado.' });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: 'Falha na requisição, tente novamente mais tarde' });
      }
    });
  }

  async delete(req, res) {
    try {
      const { productId, companyId } = req.params;

      if (!productId) {
        return res.status(400).json({ success: false, message: 'Produto não encontrado' });
      }

      const product = await Model.findByIdAndDelete(productId, { new: true });

      if (product.images.length >= 1) {
        product.images.map(async (img) => await cloudinary.uploader.destroy(img.id));
      }

      const products = await Model.find({ company: companyId });

      return res.status(200).json(products);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, message: 'Erro ao produto' });
    }
  }

  async deleteMultiple(req, res) {
    try {
      let product;
      const { productIds } = req.body;

      productIds.forEach(async (id) => {
        product = await Model.findByIdAndDelete(id, { new: true });
        if (product.images.length) {
          product.images.map(async (id) => await cloudinary.uploader.destroy(id));
        }
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      const products = await Model.find();

      return res.status(200).json(products);
    } catch (error) {
      console.log(error);
      const _idCompany = req.headers.companyid;
      return res.status(400).json({ success: false, message: 'Erro na exclusão do produto' });
    }
  }

  async updateImage(req, res) {
    try {
      await Model.findByIdAndUpdate(
        req.params.productId,
        { $push: { images: req.body } },
        { safe: true, upsert: true }
      );

      return res.status(200).send({ status: 'success' });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ status: 'error' });
    }
  }

  async deleteImage(req, res) {
    const { imageId, productId } = req.params;

    try {
      cloudinary.uploader.destroy(imageId, function (error, result) {
        console.log(result, error);
      });

      const product = await Model.findByIdAndUpdate(
        productId,
        { $pull: { images: { id: imageId } } },
        { safe: true, upsert: true }
      );

      return res.status(200).send({ status: 'success' });
    } catch (error) {
      return res.status(400).send({ status: 'error' });
    }
  }
}

export default ProductController;
