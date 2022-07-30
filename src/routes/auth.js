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
      passReqToCallback: false,
    },
    async function verify(username, password, cb) {
      try {
        const company = await Company.findOne({ username });

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


router.post(
  '/:subdomain/login/',
  passport.authenticate('local', {
    successReturnToOrRedirect: '/admin',
    failureRedirect: '/login',
    failureMessage: true,
  })
);

export default router;
