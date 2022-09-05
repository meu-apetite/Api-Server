import Model from '../../models/CategoryModel.js';
const _idCompany = '63776367367dgdtfct';

class CategoryController {
  async pageIndex(req, res) {
    const category = await Model.find();

    res.render('admin/category', { category });
  }

  pageCreate(req, res) {
    res.render('admin/category/create');
  }

  async create(req, res) {
    const { title, category } = req.body;

    try {
      await Model.create({ _idCompany, title, category });
      res.redirect('/admin/category');
    } catch (error) {
      console.log(error);
    }
  }

  async pageUpdate(req, res) {
    try {
      const category = await Model.findById(req.params.categoryId);
      res.render('admin/category/update', { category });
    } catch (error) {
      console.log(error);
    }
  }

  async update(req, res) {
    const { title, category } = req.body;

    try {
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
