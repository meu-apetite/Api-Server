import Model from '../../models/CategoryModel.js';
import LogModel from '../../models/LogModel.js';
import { upload } from '../../settings/multer.js';
import { v2 as cloudinary } from 'cloudinary';

/**
  * Interface    
  *  image: File,
  *  title: 'title of category' (required)
*/

class CategoryController {
  async getAll(req, res) {
    try {
      const categories = await Model.find();

      return res.status(200).json(categories);
    } catch (error) {
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
      upload.single('image')(req, res, async (err) => {
        const _idCompany = req.headers._id;
        const { title } = req.body;
        let image;

        console.log(err)

        if (err) return res.status(400).json({
          success: false, message: 'Erro no upload do arquivo'
        });

        if (!title.trim().length) {
          return res.status(200).json({ success: false, message: 'O título não pode ficar em branco' });
        }

        if (req.file) {
          const upload = await cloudinary.uploader.upload(req.file.path, { folder: _idCompany });
          image = upload?.url;
        }

        const category = await Model.create({ _idCompany, title: title.trim(), image });

        res.status(200).json(category);
      });
    } catch (error) {
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

  async removeImage(req, res) {
    try {
      const { categoryId } = req.params;
      const { imageUrl } = req.body;
      const imageUrlSplit = imageUrl.split('/');
      const id = imageUrlSplit[imageUrlSplit.length - 1].split('.')[0];

      await cloudinary.uploader.destroy(id);
      const category = await Model.findByIdAndUpdate(categoryId, { $set: { image: null } }, { new: true });

      return res.status(200).json(category);
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Não foi possivel excluir a imagem' });
    }
  }

  async delete(req, res) {
    let category;

    try {
      const { categoryId } = req.params;
      category = await Model.findByIdAndDelete(categoryId);

      if(category.image) {
        const imageUrlSplit = category.image.split('/');
        const id = imageUrlSplit[imageUrlSplit.length - 1].split('.')[0];
        await cloudinary.uploader.destroy(id);
      }

      const categories = await Model.find();

      return res.status(200).json(categories);
    } catch (error) {
      const _idCompany = req.headers._id;

      await LogModel.create({ _idCompany,  message: error, info: category });
      return res.status(400).json({ success: false, message: 'Ocorreu um erro ao excluir a categoria' });
    }
  }

  async deleteMultiple(req, res) {
    let category;

    try {
      const listCategories = req.body.categories;

      listCategories.forEach(async (categoryId) => {
        category = await Model.findByIdAndDelete(categoryId, { new: true });
        
        if(category.image) {
          const imageUrlSplit = category.image.split('/');
          const id = imageUrlSplit[imageUrlSplit.length - 1].split('.')[0];
          await cloudinary.uploader.destroy(id);
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));

      const categories = await Model.find();

      return res.status(200).json(categories);
    } catch (error) {
      const _idCompany = req.headers._id;

      await LogModel.create({ _idCompany,  message: error, info: category });
      return res.status(400).json({ success: false, message: 'Ocorreu um erro ao excluir a categoria' });
    }
  }
}

export default CategoryController;
