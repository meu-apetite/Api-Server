import { Router } from 'express';
import CompanyController from '../controllers/CompanyController.js';

const router = Router();

const controller = new CompanyController();

router.post('/register', controller.register);
router.post('/login', controller.login);

export default router;
