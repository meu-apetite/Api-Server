import jwt from 'jsonwebtoken';
import Company from '../models/CompanyModel.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv'
dotenv.config()

class RegisterController {
  pageRegister(req, res) {
    res.render('register', { layout: false });
  }

  async register(req, res) {
    const { nameOwner, nameCompany, subdomain, email, password } = req.body;

    //Minimum eight characters, at least one letter and one number:
    const validationPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // if (!validationPassword.test(password)) {
    //   return res.render('pages/register', {
    //     layout: false,
    //     inputData: {
    //       nameOwner,
    //       nameCompany,
    //       subdomain,
    //       email,
    //     },
    //     messages: [
    //       {
    //         type: 'error',
    //         text:
    //           'A senha precisa ter o mínimo de oito caracteres, pelo menos uma letra e um número.',
    //       },
    //     ],
    //   });
    // }

    try {
      const passwordHash = bcrypt.hashSync(password, 12);

      const company = await Company.create({
        name: nameCompany,
        owner: { name: nameOwner },
        login: { email, password: passwordHash },
      });

      const token = jwt.sign(
        { companyId: company._id, email: company.login.email },
        process.env.TOKEN_KEY,
        { expiresIn: '2m' }
      );

    console.log(token)

      return res.redirect('/login');
    } catch (error) {
      console.log(error);
      return res.render('register', {
        layout: false,
        inputData: { nameOwner, nameCompany, subdomain, email },
        messages: [
          { type: 'error', text: 'Erro: confira os campos e tente novamente.' },
        ],
      });
    }
  }
}

export default RegisterController;
