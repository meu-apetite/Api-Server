import Company from '../models/CompanyModel.js';

export default class LoginController {
  async index(req, res) {
    const subdomain = req.path.split('/')[1];

    const company = await Company.findOne({ subdomain });

    if (!company) return res.render('errorNotStore');
    if (req.user) return res.redirect('/admin');
    if (req.query.messages) {
      const messages = JSON.parse(req.query.messages);
      res.render('login', { messages });
    }

    return res.render('login');
  }
}
