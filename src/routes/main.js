import { Router } from 'express';
import StoreController from '../controllers/StoreController.js';

const router = Router();
const store = new StoreController();

router.get('/', (req, res) => store.index(req, res));

export default router;
