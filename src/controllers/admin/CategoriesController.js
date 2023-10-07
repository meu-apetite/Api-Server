import Model from '../../models/CategoriesModel.js';
import LogModel from '../../models/LogModel.js';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

/**
  * Interface    
  *  image: File,
  *  title: 'title of category' (required)
*/

class CategoriesController {
  async getAll(req, res) {
    try {
      const company = req.headers._id;
      const categories = await Model.find({ company });

      console.log(categories)

      return res.status(200).json(categories);
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Falha na requisição, tente novamente mais tarde' });
    }
  }

  async listCategoriesWithProducts(req, res) {
    try {
      const company = req.headers._id;

      const categories = await Model.aggregate([
        {
          $match: { company: mongoose.Types.ObjectId(company) }
        },
        {
          $lookup: {
            from: 'products', 
            localField: '_id',
            foreignField: 'category',
            as: 'products'
          }
        }
      ])

      return res.status(200).json(categories);
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, message: 'Falha na requisição, tente novamente mais tarde' });
    }
  }

  async get(req, res) {
    try {
      const id = req.params?.categoryId;

      if (!id) return res.status(400).json({ success: false, message: 'É preciso informar o id da categoria' });

      const category = await Model.findById(id);

      return res.status(200).json(category);
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Falha na requisição, tente novamente mais tarde' });
    }
  }

  async create(req, res) {
    try {
      const company = req.headers._id;
      const { title } = req.body;

      if (!title.trim().length) {
        res.status(200).json({ 
          success: false, 
          message: 'O título não pode ficar em branco' 
        });
        return;
      }

      const category = await Model.create({ company, title: title.trim(), isActive: true });

      res.status(200).json(category);
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, message: 'Falha na requisição, tente novamente mais tarde' });
    }
  }

  async update(req, res) {
    try {
      const { categoryId } = req.params;
      const { title } = req.body;

      const category = await Model.findByIdAndUpdate(categoryId, { $set: { title } }, { new: true });

      res.status(200).json(category);
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Falha na requisição, tente novamente mais tarde' });
    }
  }

  async delete(req, res) {

    try {
      let category;
      const { categoryId } = req.params;
      category = await Model.findByIdAndDelete(categoryId);

      if (category.image) {
        const imageUrlSplit = category.image.split('/');
        const id = imageUrlSplit[imageUrlSplit.length - 1].split('.')[0];
        await cloudinary.uploader.destroy(id);
      }

      const categories = await Model.find();

      return res.status(200).json(categories);
    } catch (error) {
      const _idCompany = req.headers._id;

      await LogModel.create({ _idCompany, message: error, info: category });
      return res.status(400).json({ success: false, message: 'Ocorreu um erro ao excluir a categoria' });
    }
  }

  async deleteMultiple(req, res) {
    let category;

    try {
      const listCategories = req.body.categories;

      listCategories.forEach(async (categoryId) => {
        category = await Model.findByIdAndDelete(categoryId, { new: true });
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      const categories = await Model.find();

      return res.status(200).json(categories);
    } catch (error) {
      const _idCompany = req.headers._id;

      await LogModel.create({ _idCompany, message: error, info: category });
      return res.status(400).json({ success: false, message: 'Ocorreu um erro ao excluir a categoria' });
    }
  }
}

export default CategoriesController;
