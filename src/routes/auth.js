import { Router } from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';
import Company from '../models/CompanyModel.js';

const router = Router();

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async function verify(req, username, password, cb) {
      try {
        const subdomain = req.path.split('/')[1] || null;

        const company = await Company.findOne({
          email: username,
          subdomain: subdomain,
        });

        console.log(company);

        if (!company) {
          return cb(null, false, {
            message: 'Incorrect username or password.',
          });
        }

        if (!bcrypt.compareSync(password, company.password)) {
          throw 'Password incorrect!';
        }

        return cb(null, company);
      } catch (error) {
        return cb(null, false, { message: 'Error!' });
      }
    }
  )
);

passport.serializeUser(function (username, cb) {
  process.nextTick(function () {
    cb(null, {
      id: username._id,
      email: username.email,
      subdomain: username.subdomain,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.post('/:subdomain/login/', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (!user) {
      console.log(req)
      return res.render('login', {
        email: req.body.email,
        messages: [
          { type: 'error', text: 'A senha ou email inserido está incorreto!' },
        ],
      });
    }

    if (err) return res.render('error');

    req.login(user, function (error) {
      if (error) return next(error);
      res.redirect(`/${user.subdomain}/admin`);
    });
  })(req, res, next);
});

export default router;
