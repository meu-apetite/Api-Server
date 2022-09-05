import { v2 as cloudinary } from 'cloudinary';
import Model from '../../models/ProductModel.js';
import Variation from '../../models/VariationModel.js';
import Categories from '../../models/CategoryModel.js';

class ProductController {
  async pageIndex(req, res) {
    const page = parseInt(req.params.page) || 0; //for next page pass 1 here
    const limit = parseInt(req.params.limit) || 10;

    const product = await Model.find()
      .limit(limit)
      .sort({ update_at: -1 })
      .skip(page * limit);

    const docCount = await Model.countDocuments();
    const pageSize = Math.ceil(docCount / limit);

    res.render('admin/product/', {
      product,
      pageInfo: {
        pageSize,
        pageCurrent: page,
      },
    });
  }

  async pageCreate(req, res) {
    // const measurementUnits = [
    //   { code: 'cx', name: 'caixa' },
    //   { code: 'pte', name: 'pacote' },
    //   { code: 'pc', name: 'peça' },
    //   { code: 'kg', name: 'Quilo' },
    //   { code: 'un', name: 'Unidade' },
    //   { code: 'por', name: 'porção' },
    //   { code: 'cart', name: 'cartela' },
    //   { code: 'lt', name: 'litro' },
    //   { code: '', name: 'jogo' },
    //   { code: 'par', name: 'par' },
    //   { code: 'mt', name: 'metro' },
    // ];

    const variation = await Variation.find();
    const category = await Categories.find();
    res.render('admin/product/create', { variation, category });
  }

  async create(req, res) {
    const data = { ...req.body };

    try {
      const variationsItem = [];
      const images = [];

      // Combine variations (variations, name and price)
      console.log(data)
    if(Array.isArray(data.variations)){
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
      }else{
        data.variationsItem = [{_id: data.variationsItem, price: data.variationsPrice}];
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
      return res.render('admin/product/create', { product: [data] });
    }
  }

  async pageUpdate(req, res) {
    try {
      const id = req.params.productId;
      const company = req.company.id;

      const product = await Model.findOne({ $and: [{ _id: id }, { company }] })
      .populate('variations')
      .populate('categories', 'title');
      const categories = await Categories.find({ company });

      console.log(categories);

      return res.render('admin/product/update', { product, categories });
    } catch (error) {
      res.send('Produto não encontrado!');
    }
  }

  async update(req, res) {
    try {
      await Model.findByIdAndUpdate(req.params.productId, req.body);
      return res.redirect(`/admin/product/update/${req.params.productId}`);
    } catch (error) {
     return console.log(error)
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
