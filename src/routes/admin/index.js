import { Router } from 'express';
import auth from '../../middleware/authenticationMiddleware.js';
import CompanyController from '../../controllers/admin/CompanyController.js';
import ProductsController from '../../controllers/admin/ProductsController.js';
import CategoriesController from '../../controllers/admin/CategoriesController.js';
import ComplementController from '../../controllers/admin/ComplementController.js';
import OrdersController from '../../controllers/admin/OrdersController.js';
import PaymentsController from '../../controllers/admin/PaymentsController.js';

const controller = new CompanyController();
const categoriesController = new CategoriesController();
const productsController = new ProductsController();
const complementController = new ComplementController();
const ordersController = new OrdersController();
const paymentsController = new PaymentsController();

const router = Router();

// Company
router.get('/admin/company', auth, controller.getCompany);
router.put('/admin/company', auth, controller.update);
router.post('/admin/company/gallery', auth, controller.addImageGallery);
router.delete('/admin/company/gallery/:id', auth, controller.removeImageGallery);
router.post('/admin/company/logo', auth, controller.addImageLogo);
router.delete('/admin/company/logo/:id', auth, controller.removeImageLogo);
router.get('/admin/company/address', auth, controller.getAddress);
router.put('/admin/company/address', auth, controller.updateAddress);
router.get('/admin/company/owner', auth, controller.getInfoAdmin);
router.put('/admin/company/owner', auth, controller.updateInfoAdmin);
router.put('/admin/company/settings-delivery', auth, controller.updateSettingsDelivery);
// router.put('/admin/company/subscription', auth, controller.subscription);

// Category
router.post('/admin/categories', auth, categoriesController.create);
router.post('/admin/categories/delete-multiple', auth, categoriesController.deleteMultiple);
router.get('/admin/categories', auth, categoriesController.getAll);
router.get('/admin/categoriesWithProducts', auth, categoriesController.listCategoriesWithProducts);
router.get('/admin/categories/:categoryId', auth, categoriesController.get);
router.put('/admin/categories/name/:categoryId', auth, categoriesController.updateName);
router.put('/admin/categories', auth, categoriesController.update);
router.delete('/admin/categories/:categoryId', auth, categoriesController.delete);

// Product
router.get('/admin/products', auth, productsController.getAll);
router.get('/admin/products/:id', auth, productsController.getProduct);
router.post('/admin/products', auth, productsController.create);
router.put('/admin/products/:productId', auth, productsController.update);
router.post('/admin/products/delete-multiple', auth, productsController.deleteMultiple);
router.delete('/admin/products/deleteImage/:imageId/productId/:productId', auth, productsController.deleteImage);
router.post('/admin/products/updateImage/productId/:productId', auth, productsController.updateImage);

// Orders
router.get('/admin/orders', auth, ordersController.getAll);

//Payment
router.get('/admin/all-method-in-category', auth, paymentsController.getMethodInCategory);
router.get('/admin/payments', auth, paymentsController.getPaymentOptions);
router.put('/admin/payments', auth, paymentsController.updatePaymentsMethods);
router.put('/admin/paymentonline/mp', auth, paymentsController.updateCredentialsMercadoPago);

// Complement
router.post('/admin/complement', auth, complementController.create);
router.put('/admin/complement', auth, complementController.udpadte);

export default router;