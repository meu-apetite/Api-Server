import { Router } from 'express';
import StoreController from '../controllers/StoreController.js';

const router = Router();
const store = new StoreController();

router.get('/', (req, res) => store.index(req, res));
router.get('/login', (req, res) => store.login(req, res));
router.get('/register', (req, res) => store.register(req, res));

export default router;
