import express from 'express';
import session from 'express-session';
import { flash } from 'express-flash-message';
import routes from './routes/index.js';
import Database from './config/Database.js';
import path from 'path';
import { fileURLToPath } from 'url';

class Server {
  app = express();
  PORT = 5000;

  start() {
    this.config();
    this.route();

    this.app.listen(this.PORT, () => console.log('server on: localhost:5000'));
  }

  config() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    this.app.use(express.urlencoded({ extended: true }));

    //esj
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'ejs');
    this.app.use(express.static(__dirname));

    //database
    const dataBase = new Database();
    dataBase.connect();

    // apply express-flash-message middleware
    this.app.use(
      session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
      })
    );

    this.app.use(flash());
  }

  route() {
    this.app.use(routes);
  }
}

export default Server;
