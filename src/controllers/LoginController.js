import Store from '../models/StoreModel.js';
import bcrypt from 'bcryptjs';

export default class LoginController {
  async index(req, res) {
    const message = req.query.message;
    let messages;

    if (message) messages = [{ type: 'success', text: message }];

    res.render('login', { messages });
  }

  async login(req, res) {
    try {
      return res.redirect('dashboard');
    } catch (error) {
      console.log(error);
    }
  }
}
