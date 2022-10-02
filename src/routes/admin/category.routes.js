import { Router } from 'express';
import CategoryController from '../../controllers/admin/CategoryController.js';

const router = Router();

const categoryController = new CategoryController();

router.post('/admin/category', categoryController.create);
router.get('/admin/category', categoryController.find);
router.put('/admin/category/:categoryId', categoryController.update);
router.delete('/admin/category/:categoryId', categoryController.delete);

export default router;
