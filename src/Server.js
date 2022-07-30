import express from 'express';
import session from 'express-session';
import Database from './config/Database.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import logger from 'morgan';
import indexRouer from './routes/index.js';
import authRouter from './routes/auth.js';
import checkSubdomain from './middleware/checkSubdomainMiddleware.js';

class Server {
  app = express();
  PORT = 5000;

  start() {
    this.config();
    this.route();

    this.app.listen(this.PORT, () => console.log('server on'));
  }

  config() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(logger('dev'));
    this.app.use(cookieParser());

    //esj
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'ejs');
    this.app.use(express.static(__dirname));

    //database
    const dataBase = new Database();
    dataBase.connect();
  }

  route() {
    this.app.get('/favicon.ico', (req, res) => res.status(204));

    this.app.use(
      session({
        secret: '123',
        cookie: { _expires: 60000 },
        resave: false,
        saveUninitialized: false,
      })
    );

    this.app.use(passport.authenticate('session'));
    this.app.use(function (req, res, next) {
      var msgs = req.session.messages || [];
      res.locals.messages = msgs;
      res.locals.hasMessages = !!msgs.length;
      req.session.messages = [];
      next();
    });

    this.app.use('/', authRouter);
    this.app.use(indexRouer);

    this.app.use((req, res, next) => next(createError(404)));

    this.app.use(function (err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      res.status(err.status || 500);
      res.render('erro');
    });
  }
}

export default Server;
