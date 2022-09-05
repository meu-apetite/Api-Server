import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Model from '../models/CompanyModel.js';
import dotenv from 'dotenv';
dotenv.config();

class LoginController {
  pageLogin(req, res) {
    return res.render('login', { layout: false });
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const company = await Model.findOne({
        'login.email': email,
      }).select('name login');

      if (!company) throw new Error('Incorrect username or password!');

      if (!bcrypt.compareSync(password, company.login.password)) {
        throw 'Password incorrect!';
      }

      const token = jwt.sign(
        { id: company._id, email: company.login.email },
        process.env.TOKEN_KEY,
        { expiresIn: '2h' }
      );

      res.cookie('token', token, {
        expires: new Date(Date.now() + 1000 * 60 * 120),
        httpOnly: false,
      });

      return res.render('admin');
    } catch (error) {
      console.log(error);
      return res.render('login');
    }
  }
}

export default LoginController;
