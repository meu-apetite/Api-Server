import express from 'express';
import cors from 'cors';
import https from 'https';
import routeAdmin from './routes/admin/index.js';
import routeAuth from './routes/auth/index.js';
import routeStore from './routes/store/index.js';
import fs from 'fs';
// import privateKey  from './cert/key.pem';
// import certificate from './cert/cert.pem';

import './settings/cloudinary.js';
import './settings/database.js';

class Server {
  app = express();
  PORT = 5000;

  start() {
    this.config();
    this.route();

    // const privateKey = fs.readFileSync('./cert/key.pem');
    // const certificate = fs.readFileSync('./cert/cert.pem');

    // https.createServer({ key: privateKey, cert: certificate}, this.app).listen(this.PORT);

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
