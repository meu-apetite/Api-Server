import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Model from '../../models/CompanyModel.js';
import { ValidationUtils } from '../../utils/ValidationUtils.js';
import { LogUtils } from '../../utils/LogUtils.js';
import { TOKEN_KEY } from '../../environments/index.js';

class Auth {
  async register(req, res) {
    try {
      const data = { ...req.body };
      const messages = [];

      Object.keys(data).forEach((item) => {
        if (!ValidationUtils[item]) return;
        const validation = ValidationUtils[item](data[item]);
        if (validation !== true) messages.push(validation);
      });

      if (messages.length) {
        return res.status(400).json({
          success: false, message: `${messages.map(error => `• ${error}`).join('\n')}`
        });
      }

      const existingUser = await Model.findOne({
        $or: [{ email: data.email }, { storeUrl: data.storeUrl }]
      });

      if (existingUser) {
        if (existingUser.email === data.email) {
          return res.status(400).json({ success: false, message: 'Email já cadastrado' });
        } else {
          return res.status(400).json({ success: false, message: 'URL já cadastrada' });
        }
      }

      await Model.create({
        fantasyName: data.fantasyName,
        storeUrl: data.storeUrl,
        owner: { name: data.ownerName },
        description: data.description,
        email: data.email,
        password: bcrypt.hashSync(data.password, 12), 
        whatsapp: data.whatsapp
      });

      return res.status(200).json({ 
        success: true, message: 'Cadastro feito com sucesso!' 
      });
    } catch (error) {
      LogUtils.errorLogger(error);
      res.status(400).json({ 
        success: false, 
        message: 'Erro: confira os campos e tente novamente.' 
      });
    }
  }

  async login(req, res) {
    try {
      const data = { ...req.body };
      
      //Validation
      if (!ValidationUtils.email(data.email.trim())) {
        return res.status(401).json({ 
          success: false, message: 'Email inválido!' 
        });
      }

      const company = await Model.findOne({ 'email': data.email.trim() })
        .select('name email password');

      if (
        !company || 
        !bcrypt.compareSync(data.password, company.password)
      ) {
        return res.status(401).json({ 
          success: false, message: 'Senha ou email incorreto!' 
        });
      }

      delete data?.subscription?.expirationTime;

      await Model.findByIdAndUpdate(company._id, { subscription: data?.subscription });

      const token = jwt.sign(
        { id: company._id, email: company.email },
        TOKEN_KEY,
        { expiresIn: '200d' }
      );

      return res.status(200).json({ 
        success: true, 
        message: 'Logado.', 
        token, _id: company._id 
      });
    } catch (error) {
      LogUtils.errorLogger(error);
      return res
        .status(400)
        .json({ success: false, message: 'Houve um erro de comunicação na rede.' });
    }
  }
}

export default Auth;
