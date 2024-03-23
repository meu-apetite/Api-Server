import express from 'express';
import cors from 'cors';
import routeAdmin from './routes/admin/index.js';
import routeAuth from './routes/auth/index.js';
import routeMenu from './routes/menu/index.js';
import { PORT } from './environments/index.js';
import './settings/cloudinary.js';
import './settings/database.js';

class Server {
  app = express();

 start() {
    this.config();
    this.route();

    this.app.listen(PORT, console.log('on'))
  }

  config() {
    this.app.use(express.json({ extended: false }));
    this.app.use(cors());
  }

  route() {
    this.app.use('/api/admin', routeAdmin);
    this.app.use('/api/auth', routeAuth);
    this.app.use('/api/menu', routeMenu);
  }
}

export default Server;
