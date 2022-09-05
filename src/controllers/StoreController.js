import Company from '../models/CompanyModel.js';

class StoreController {
  async index(req, res) {
    const subdomain = req.path.split('/')[1];

    const company = await Company.findOne({ subdomain });

    if (!company) return res.render('notexiste', { layout: false});

    return res.render('store', {layout: false});
  }
}

export default StoreController;