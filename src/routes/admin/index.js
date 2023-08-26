import { Router } from 'express';
import auth from '../../middleware/authenticationMiddleware.js';
import CompanyController from '../../controllers/admin/CompanyController.js';
import ProductController from '../../controllers/admin/ProductController.js';
import CategoryController from '../../controllers/admin/CategoryController.js';
import ComplementController from '../../controllers/admin/ComplementController.js';

const categoryController = new CategoryController();
const controller = new CompanyController();
const productController = new ProductController();
const complementController = new ComplementController();

const router = Router();

// Company
router.get('/admin/company', auth, controller.getCompany);
router.put('/admin/company', auth, controller.update);
router.post('/admin/company/gallery', auth, controller.addImageGallery);
router.delete('/admin/company/gallery/:id', auth, controller.removeImageGallery);
router.post('/admin/company/logo', auth, controller.addImageLogo);
router.delete('/admin/company/logo/:id', auth, controller.removeImageLogo);
router.post('/admin/company/updateAddress', auth, controller.updateAddress);

// Category
router.post('/admin/category', auth, categoryController.create);
router.post('/admin/category/delete-image/:categoryId', auth, categoryController.removeImage);
router.post('/admin/category/delete-multiple', auth, categoryController.deleteMultiple);
router.get('/admin/category', auth, categoryController.getAll);
router.get('/admin/category/:categoryId', auth, categoryController.get);
router.put('/admin/category/:categoryId', auth, categoryController.update);
router.delete('/admin/category/:categoryId', auth, categoryController.delete);

// Product
router.get('/admin/product', auth, productController.getAll);
router.post('/admin/product', auth, productController.create);
router.put('/admin/product/:productId', auth, productController.update);
router.post('/admin/product/delete-multiple', auth, productController.deleteMultiple);
router.delete('/admin/product/deleteImage/:imageId/productId/:productId', auth, productController.deleteImage);
router.post('/admin/product/updateImage/productId/:productId', auth, productController.updateImage);

// Complement
// router.get('/admin/complement', auth, productController.getAll);
router.post('/admin/complement', auth, complementController.create);

export default router;