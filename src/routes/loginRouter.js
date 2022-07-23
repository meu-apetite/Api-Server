import { Router } from 'express';
import LoginController from '../controllers/LoginController.js';

const router = Router();
const loginController = new LoginController();

router.get('/login',  loginController.index);
router.post('/login', loginController.login);

export default router;
