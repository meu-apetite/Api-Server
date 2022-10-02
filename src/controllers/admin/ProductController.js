import { v2 as cloudinary } from 'cloudinary';
import Model from '../../models/ProductModel.js';
import Categories from '../../models/CategoryModel.js';

class ProductController {
  async pageIndex(req, res) {
    const product = await Model.find().populate('categories')
    res.status(200).json(product);
  }

  async pageCreate(req, res) {
    const categories = await Categories.find();
    res.render('admin/product/create', { variation, categories });
  }

  async create(req, res) {
    const data = { ...req.body };
    const categories = await Categories.find();

    try {
      const variationsItem = [];
      const images = [];

      // Combine variations (variations, name and price)
      console.log(data);
      if (Array.isArray(data.variations)) {
        data.variations = [...new Set(data.variations)];

        if (data.variationsItem.length) {
          data.variationsItem.map((item, i) => {
            variationsItem.push({
              _id: item,
              price: Number(data.variationsPrice[i]),
            });
          });
        }
        data.variationsItem = variationsItem;
      } else {
        data.variationsItem = [
          { _id: data.variationsItem, price: data.variationsPrice },
        ];
        data.variations = [data.variations];
      }

      // Combine images
      if (!Array.isArray(data.image)) {
        images.push({ id: data.imageId, url: data.image });
      } else {
        data.image.forEach((item, index) => {
          images.push({ id: data.imageId[index], url: item });
        });
      }

      delete data.imageId;
      delete data.image;
      data.images = images;

      console.log(data);
      // return

      // Save
      await Model.create({ ...data, company: req.company.id });
      return res.redirect('/admin/product/');
    } catch (error) {
      console.log(error);
      return res.render('admin/product/create', { product: [data], variation });
    }
  }

  async pageUpdate(req, res) {
    try {
      const companyId = req.company.id;
      const { productId } = req.params;

      const product = await Model.findOne({
        $and: [{ _id: productId }, { company: companyId }],
      })
        .populate('variations')
        .populate('categories', 'title');
      const categories = await Categories.findOne({ company: companyId });
      const variation = await Variation.findOne({ company: companyId });

      return res.render('admin/product/update', {
        product,
        categories,
        variation,
      });
    } catch (error) {
      console.log(error);
      res.send('Produto não encontrado!');
    }
  }

  async update(req, res) {
    try {
      await Model.findByIdAndUpdate(req.params.productId, req.body);
      return res.redirect(`/admin/product/update/${req.params.productId}`);
    } catch (error) {
      return console.log(error);
      return res.render(`admin/product/update/${req.params.productId}`, {
        product: [data],
      });
    }
  }

  async delete(req, res) {
    try {
      console.log('aqui');
      const product = await Model.findById(req.params.productId);
      res.render('admin/product/update', { product });
    } catch (error) {
      console.log(error);
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
