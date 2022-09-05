import Model from '../../models/VariationModel.js';
const _idCompany = '63776367367dgdtfct';

class VariationController {
  async pageIndex(req, res) {
    const variations = await Model.find();

    res.render('admin/variations', { variations });
  }

  pageCreate(req, res) {
    res.render('admin/variations/create');
  }

  async create(req, res) {
    const { title, variations } = req.body;
    const variationsObj = variations.map((item) => {
      return { name: item };
    });

    console.log(variationsObj);

    try {
      await Model.create({
        title,
        variations: variationsObj,
        company: req.company.id,
      });
      res.redirect('/admin/variation');
    } catch (error) {
      console.log(error);
    }
  }

  async pageUpdate(req, res) {
    try {
      const variation = await Model.findById(req.params.variationId);
      res.render('admin/variations/update', { variation });
    } catch (error) {
      console.log(error);
    }
  }

  async update(req, res) {
    const { title, variations } = req.body;

    try {
      await Model.findOneAndUpdate(req.params.variationId, {
        _idCompany,
        title,
        variations,
      });
      res.redirect(`/admin/variations/update/${req.params.variationId}`);
    } catch (error) {
      console.log(error);
    }
  }

  async findAjax(req, res) {
    try {
      const _id = req.params.variationId;
      const variation = await Model.findOne({ _id });
      return res.status(200).json(variation);
    } catch (error) {
      console.log(error);
    }
  }

  async delete(req, res) {
    try {
      await Model.findByIdAndDelete(req.params.variationId);
      res.redirect('/admin/variation');
    } catch (error) {
      console.log(error);
    }
  }
}

export default VariationController;
