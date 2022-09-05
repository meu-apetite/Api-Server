import { Router } from 'express';
import CategoryController from '../../controllers/admin/CategoryController.js';

const router = Router();

const categoryController = new CategoryController();

router.get('/admin/category', categoryController.pageIndex);
router.get('/admin/category/create', categoryController.pageCreate);
router.post('/admin/category/create', categoryController.create);
router.get('/admin/category/update/:categoryId', categoryController.pageUpdate);
router.post('/admin/category/update/:categoryId', categoryController.update);
router.get('/admin/category/delete/:categoryId', categoryController.delete);

export default router;
