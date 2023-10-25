import express from 'express';
import cors from 'cors';

import routeAdmin from './routes/admin/index.js';
import routeAuth from './routes/auth/index.js';
import routeStore from './routes/store/index.js';

import './settings/cloudinary.js';
import './settings/database.js';

class Server {
  app = express();
  PORT = 5000;

  start() {
    this.config();
    this.route();

    this.app.listen(this.PORT, () => console.log('http://localhost:5000'));
  }

  config() {
    this.app.use(express.json({ extended: false }));
    this.app.use(cors());
  }

  route() {
    this.app.use(routeAuth);
    this.app.use(routeStore);
    this.app.use(routeAdmin);
  }
}

export default Server;
