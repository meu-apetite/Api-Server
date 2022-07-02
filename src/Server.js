import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';


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

    this.app.set('views', path.join(__dirname, 'views'))
    this.app.set("view engine", "ejs");

    this.app.use(express.static(__dirname));
  }

  route() {
    this.app.get("/", (req, res) => {
      res.render("index");
    })
  }
}

export default Server;