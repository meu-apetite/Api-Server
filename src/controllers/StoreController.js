import Store from '../models/storeModel.js';

export default class StoreController {
  index(req, res) {
    return res.render('index');
  }

  login(req, res) {
    return res.render('login');
  }

  async actionLogin(req, res) {
    const { email, password } = req.body;

    try {
      await Store.create({ nameOwner, name, description, email });
      return res.redirect('dashboard');
    } catch (error) {
      console.log(error);
    }
  }

  register(req, res) {
    return res.render('register');
  }

  async actionRegister(req, res) {
    const { nameOwner, name, description, email } = req.body;

    try {
      await Store.create({ nameOwner, name, description, email });
      return res.render('login');
    } catch (error) {
      console.log(error);
    }
  }
}
