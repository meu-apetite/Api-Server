import Model from '../../models/CategoriesModel.js';
import ProductsModel from '../../models/ProductsModel.js';
import LogModel from '../../models/LogModel.js';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

/**
 * Interface
 * title: 'title of category' (required)
 */

class CategoriesController {
  async getAll(req, res) {
    try {
      console.log('categories');
      const company = req.headers._id;
      const categories = await Model.find({ company });

      return res.status(200).json(categories);
    } catch (error) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Falha na requisição, tente novamente mais tarde',
        });
    }
  }

  async listCategoriesWithProducts(req, res) {
    try {
      const company = req.headers._id;

      const categories = await Model.aggregate([
        {
          $match: { company: mongoose.Types.ObjectId(company) },
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'category',
            as: 'products',
          },
        },
        {
          $sort: { displayPosition: 1 },
        },
      ]);

      return res.status(200).json(categories);
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({
          success: false,
          message: 'Falha na requisição, tente novamente mais tarde',
        });
    }
  }

  async get(req, res) {
    try {
      const id = req.params?.categoryId;

      if (!id)
        return res
          .status(400)
          .json({
            success: false,
            message: 'É preciso informar o id da categoria',
          });

      const category = await Model.findById(id);

      return res.status(200).json(category);
    } catch (error) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Falha na requisição, tente novamente mais tarde',
        });
    }
  }

  async create(req, res) {
    try {
      const company = req.headers._id;
      const { title } = req.body;

      if (!title.trim().length) {
        res.status(200).json({
          success: false,
          message: 'O título não pode ficar em branco',
        });
        return;
      }

      const category = await Model.create({
        company,
        title: title.trim(),
        isActive: true,
      });

      res.status(200).json(category);
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({
          success: false,
          message: 'Falha na requisição, tente novamente mais tarde',
        });
    }
  }

  async updateName(req, res) {
    try {
      const { categoryId } = req.params;
      const { title } = req.body;

      if (!title || title.trim() === '') {
        return res
          .status(400)
          .json({ success: false, message: 'O nome da categoria vazio' });
      }

      const category = await Model.findByIdAndUpdate(
        categoryId,
        { $set: { title } },
        { new: true }
      );

      res.status(200).json(category);
    } catch (error) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Não foi possível editar a categoria',
        });
    }
  }

  async update(req, res) {
    try {
      const company = req.headers._id;
      const { categoryChanges, productChanges } = req.body;

      console.log(productChanges);

      if(categoryChanges.length) { 
        await Model.bulkWrite(
          categoryChanges.map((category) => ({
            updateOne: {
              filter: { _id: category.id },
              upsert: false,
              update: {
                $set: {
                  displayPosition: category.displayPosition,
                  isActive: category.isActive,
                },
              },
            },
          }))
        );
      }

      if(productChanges.length) { 
        await ProductsModel.bulkWrite(
          productChanges.map((product) => ({
            updateOne: {
              filter: { _id: product.id, category: product.categoryId },
              upsert: false,
              update: {
                $set: {
                  displayPosition: product.displayPosition,
                  isActive: product.isActive,
                },
              },
            },
          }))
        );
      }

      const categories = await Model.aggregate([
        { $match: { company: mongoose.Types.ObjectId(company) } },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'category',
            as: 'products',
          },
        },
        { $sort: { displayPosition: 1 } },
      ]);

      res.status(200).json(categories);
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({
          success: false,
          message: 'Não foi possível editar a categoria',
        });
    }
  }

  async delete(req, res) {
    const { categoryId } = req.params;

    try {
      let category;
      category = await Model.findByIdAndDelete(categoryId);

      const categories = await Model.find();

      return res.status(200).json(categories);
    } catch (error) {
      await LogModel.create({ categoryId, message: error, info: category });
      return res
        .status(400)
        .json({
          success: false,
          message: 'Ocorreu um erro ao excluir a categoria',
        });
    }
  }

  async deleteMultiple(req, res) {
    let category;

    try {
      const listCategories = req.body.categories;

      listCategories.forEach(async (categoryId) => {
        category = await Model.findByIdAndDelete(categoryId, { new: true });
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const categories = await Model.find();

      return res.status(200).json(categories);
    } catch (error) {
      const _idCompany = req.headers._id;

      await LogModel.create({ _idCompany, message: error, info: category });
      return res
        .status(400)
        .json({
          success: false,
          message: 'Ocorreu um erro ao excluir a categoria',
        });
    }
  }
}

export default CategoriesController;
