import Store from '../models/StoreModel.js';
import bcrypt from 'bcryptjs';

export default class RegisterController {
  index(req, res) {
    res.render('register');
  }

  async register(req, res) {
    try {
      const { nameOwner, name, email, password } = req.body;
      const passwordHash = bcrypt.hashSync(password, 12);

      const store = await Store.create({
        nameOwner,
        name,
        email,
        passwordHash,
      });

      const message = 'Conta criada, entre para continuar!';
      const nextUrl = `/login?message=${message}`;

      return res.redirect(nextUrl);
    } catch (error) {
      return res.render('register', {
        messages: [
          { type: 'error', text: 'Erro: confira os campos e tente novamente.' },
        ],
      });
    }
  }
}
