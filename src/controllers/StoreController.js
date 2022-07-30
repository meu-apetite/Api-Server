import Company from '../models/CompanyModel.js';

export default class StoreController {
  async index(req, res) {
    const subdomain = req.path.split('/')[1];

    const company = await Company.findOne({ subdomain });

    console.log('oi')
    if (!company) return res.render('notexiste');

    return res.render('store');
  }
}
