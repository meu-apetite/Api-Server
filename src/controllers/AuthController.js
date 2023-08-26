import jwt from 'jsonwebtoken';
import Model from '../models/CompanyModel.js';
import Validation from '../utils/Validation.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
const checkValidation = new Validation();
dotenv.config();

class Auth {
  async register(req, res) {
    try {
      const data = { ...req.body };
      const messages = [];

      Object.keys(data).forEach((item) => {
        if (!checkValidation[item]) return;

        const validation = checkValidation[item](data[item]);
        if (validation !== 'valid') {
          messages.push({ type: 'error', text: validation });
        }
      });

      if (messages.length) return res.status(400).json({ messages });

      //Create
      const company = await Model.create({
        fantasyName: data.fantasyName,
        whatsapp: data.whatsapp,
        owner: { name: data.ownerName },
        login: {
          email: data.email,
          password: bcrypt.hashSync(data.password, 12),
        },
      });

      return res.status(200).json({
        messages: [{ type: 'success', text: 'Cadastro feito com sucesso!' }],
      });
    } catch (error) {
      res.status(400).json({
        messages: [
          { type: 'error', text: 'Erro: confira os campos e tente novamente.' },
        ],
      });
    }
  }

  async login(req, res) {
    try {
      const data = { ...req.body };

      //Validation
      if (!checkValidation.email(data.email)) {
        return res.status(401).json({ success: false, message: 'Email inválido!' });
      }

      const company = await Model.findOne({ 'login.email': data.email })
        .select('name login');

      if (!company || !bcrypt.compareSync(data.password, company.login.password)) {
        return res.status(401).json({ success: false, message: 'Senha ou email incorreto!' });
      }

      const token = jwt.sign(
        { id: company._id, email: company.login.email },
        process.env.TOKEN_KEY,
        { expiresIn: '2h' }
      );

      return res.status(200).json({ success: true, message: 'Logado.', token, _id: company._id  });
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: 'Houve um erro de comunicação na rede.'});
    }
  }
}

export default Auth;
