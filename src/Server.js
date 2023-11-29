import './settings/cloudinary.js';
import './settings/database.js';
import express from 'express';
import cors from 'cors';
import https from 'https';
import routeAdmin from './routes/admin/index.js';
import routeAuth from './routes/auth/index.js';
import routeStore from './routes/store/index.js';
import fs from 'fs';

class Server {
  app = express();
  PORT = 3000;

 start() {
    this.config();
    this.route();

    // Configurando SSL com certificado do Let's Encrypt
    const credentials = {
      key: fs.readFileSync('/etc/letsencrypt/archive/meuapetite.com/privkey1.pem', 'utf8'),
      cert: fs.readFileSync('/etc/letsencrypt/archive/meuapetite.com/cert1.pem', 'utf8'),
      ca: fs.readFileSync('/etc/letsencrypt/archive/meuapetite.com/chain1.pem', 'utf8'),
    };

    // Criando e iniciando o servidor HTTPS
    const servidorHttps = https.createServer(credentials, this.app);

    servidorHttps.listen(this.PORT, () => {
      console.log(`Servidor HTTPS está ouvindo na porta ${this.PORT}`);
    });
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
