import express from 'express';
import expressLayout from 'express-ejs-layouts';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import database from './config/database.js';
import cloudinaryPrimary from './config/cloudinaryPrimary.js';
import routeAdmin from './routes/admin/index.js';
import route from './routes/index.js';
import auth from './middleware/auth.js';

class Server {
  app = express();
  PORT = 5000;

  start() {
    this.config();
    this.route();

    this.app.listen(this.PORT, () => console.log('http://localhost:5000'));
  }

  config() {
    const dirname = path.dirname(fileURLToPath(import.meta.url));

    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(cookieParser());
    // Config view e path public
    this.app.set('views', path.join(dirname, 'views'));
    this.app.set('view engine', 'ejs');
    this.app.use(expressLayout);
    this.app.use(express.static(path.join(dirname, 'public')));
    // Database conn
    database.connect();
    // Cloudinary cdn
    cloudinaryPrimary.connect();
  }

  route() {
    this.app.use(function (err, req, res, next) {
      console.log(err.message);
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      // res.render('erro');
    });
    
    // Routes free
    this.app.use(route);
    // Routes private
    this.app.use(auth);
    this.app.use(routeAdmin);


  }
}

export default Server;
