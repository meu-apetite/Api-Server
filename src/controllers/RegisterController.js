import Company from '../models/CompanyModel.js';
import bcrypt from 'bcryptjs';

export default class RegisterController {
  index(req, res) {
    res.render('register');
  }

  async register(req, res) {
    const { nameOwner, nameCompany, subdomain, email, password } = req.body;

    //Minimum eight characters, at least one letter and one number:
    const validationPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // if (!validationPassword.teste(password)) {
    //   return res.render('register', {
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
        nameOwner,
        nameCompany,
        subdomain,
        email,
        password: passwordHash,
      });

      const message = 'Conta criada, entre para continuar!';
      const nextUrl = `${company.subdomain}/login?message=${message}`;

      return res.redirect(nextUrl);
    } catch (error) {
      return res.render('register', {
        inputData: { nameOwner, nameCompany, subdomain, email },
        messages: [
          { type: 'error', text: 'Erro: confira os campos e tente novamente.' },
        ],
      });
    }
  }
}
