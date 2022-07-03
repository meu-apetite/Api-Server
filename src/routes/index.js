import { Router } from 'express';
import StoreController from '../controllers/StoreController.js';

const router = Router();
const storeController = new StoreController();

router.get('/', storeController.index);

//login
router.get('/login', storeController.login);
router.post('/login', storeController.actionLogin);

//Register
router.get('/register', storeController.register);
router.post('/register', storeController.actionRegister);

export default router;