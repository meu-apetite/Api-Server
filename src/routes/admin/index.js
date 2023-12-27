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
router.get('/company', auth, controller.getCompany);
router.put('/company/appearance', auth, controller.updateAppearance);
router.post('/company/gallery', auth, controller.addImageGallery);
router.delete('/company/gallery/:id', auth, controller.removeImageGallery);
router.post('/company/logo', auth, controller.updateLogo);
router.delete('/company/logo/:id', auth, controller.removeImageLogo);
router.get('/company/address', auth, controller.getAddress);
router.put('/company/address', auth, controller.updateAddress);
router.put('/company/owner', auth, controller.updateInfoAdmin);
router.put('/company/contact', auth, controller.updateInfoContact);
router.put('/company/settings-delivery', auth, controller.updateSettingsDelivery);
router.put('/company/openinghours', auth, controller.updateOpeningHours);
router.get('/company/code', auth, controller.sendCodeEmail);
router.post('/company/code', auth, controller.verifyCode);
// router.put('/company/subscription', auth, controller.subscription);

// Category
router.post('/categories', auth, categoriesController.create);
router.get('/categories', auth, categoriesController.getAll);
router.get('/categoriesWithProducts', auth, categoriesController.listCategoriesWithProducts);
router.get('/categories/:categoryId', auth, categoriesController.get);
router.put('/categories/name/:categoryId', auth, categoriesController.updateName);
router.put('/categories', auth, categoriesController.update);
router.delete('/categories/:categoryId', auth, categoriesController.delete);

// Products
router.get('/products', auth, productsController.getAll);
router.get('/products/:id', auth, productsController.getProduct);
router.post('/products', auth, productsController.create);
router.put('/products/:productId', auth, productsController.update);
router.post('/products/delete-multiple', auth, productsController.deleteMultiple);
router.delete('/products/:productId/:companyId/:page', auth, productsController.delete);
router.delete('/products/deleteImage/:imageId/productId/:productId', auth, productsController.deleteImage);
router.post('/products/updateImage/productId/:productId', auth, productsController.updateImage);

// Orders
router.get('/orders-dashboard', auth, ordersController.getOrdersdashboard);
router.get('/orders', auth, ordersController.getOrders);

//Payment
router.get('/all-method-in-category', auth, paymentsController.getMethodInCategory);
router.get('/payments', auth, paymentsController.getPaymentOptions);
router.put('/payments', auth, paymentsController.updatePaymentsMethods);
router.put('/paymentonline/mp', auth, paymentsController.updateCredentialsMercadoPago);

// Complement
router.post('/complement', auth, complementController.create);
router.put('/complement', auth, complementController.udpadte);

export default router;