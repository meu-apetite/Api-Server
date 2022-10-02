import Model from '../../models/CategoryModel.js';
const _idCompany = '63776367367dgdtfct';

class CategoryController {
  async find(req, res) {
    try {
      const id = req.body.categoryId;
      const categories = id ? await Model.find(id) : Model.find();

      res.render('admin/category', { categories });
    } catch (error) {
      res.render('admin/category', { category });
    }
  }

  async create(req, res) {
    try {
      const { _idCompany, title, image } = req.body;
      const category = await Model.create({ _idCompany, title });

      res.status(200).json(category);
    } catch (error) {
      console.log(error);
    }
  }

  async update(req, res) {
    try {
      const { title, category } = req.body;

      await Model.findOneAndUpdate(req.params.categoryId, {
        _idCompany,
        title,
      });
      res.redirect(`/admin/category/update/${req.params.categoryId}`);
    } catch (error) {
      console.log(error);
    }
  }

  async delete(req, res) {
    try {
      await Model.findByIdAndDelete(req.params.categoryId);
      res.redirect('/admin/category');
    } catch (error) {
      console.log(error);
    }
  }
}

export default CategoryController;
