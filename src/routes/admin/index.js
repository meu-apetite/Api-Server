import { Router } from 'express';
import auth from '../../middleware/authenticationMiddleware.js';
import CompanyController from '../../controllers/admin/CompanyController.js';
import ProductsController from '../../controllers/admin/ProductsController.js';
import CategoriesController from '../../controllers/admin/CategoriesController.js';
import ComplementsController from '../../controllers/admin/ComplementsController.js';
import OrdersController from '../../controllers/admin/OrdersController.js';
import PaymentsController from '../../controllers/admin/PaymentsController.js';
import CustomizationController from '../../controllers/admin/CustomizationController.js';
import DataStatisticsController from '../../controllers/admin/DataStatisticsController.js';

const companyController = new CompanyController();
const customizationController = new CustomizationController()
const categoriesController = new CategoriesController();
const productsController = new ProductsController();
const complementsController = new ComplementsController();
const ordersController = new OrdersController();
const paymentsController = new PaymentsController();
const dataStatisticsController = new DataStatisticsController();

const router = Router();

// Company
router.get('/company', auth, companyController.getCompany);
router.get('/company/address', auth, companyController.getAddress);
router.put('/company/address', auth, companyController.updateAddress);
router.put('/company/owner', auth, companyController.updateInfoAdmin);
router.put('/company/contact', auth, companyController.updateInfoContact);
router.put('/company/settings-delivery', auth, companyController.updateSettingsDelivery);
router.put('/company/openinghours', auth, companyController.updateOpeningHours);
router.get('/company/code', auth, companyController.sendCodeEmail);
router.post('/company/code', auth, companyController.verifyCode);
// router.put('/company/subscription', auth, companyController.subscription);

// CustomizationController
router.put('/company/appearance', auth, customizationController.updateAppearance);
router.post('/company/gallery', auth, customizationController.addImageGallery);
router.delete('/company/gallery/:id', auth, customizationController.removeImageGallery);
router.post('/company/logo', auth, customizationController.updateLogo);
router.post('/company/backgroundImage', auth, customizationController.updateBackgroundImage);
router.delete('/company/logo/:id', auth, customizationController.removeImageLogo);

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
router.delete('/products/:productId/:companyId/:page', auth, productsController.delete);
router.delete('/products/deleteImage/:imageId/productId/:productId', auth, productsController.deleteImage);
router.post('/products/updateImage/productId/:productId', auth, productsController.updateImage);

// Orders
router.get('/orders', auth, ordersController.getOrders);
router.put('/orders', auth, ordersController.updateOrderStatus);

// Payment
router.get('/all-method-in-category', auth, paymentsController.getMethodInCategory);
router.get('/payments', auth, paymentsController.getPaymentOptions);
router.put('/payments', auth, paymentsController.updatePaymentsMethods);
router.put('/paymentonline/mp', auth, paymentsController.updateCredentialsMercadoPago);
router.put('/payments/pix', auth, paymentsController.updatePix);

// Complement
router.post('/complement', auth, complementsController.create);
router.put('/complement', auth, complementsController.udpadte);

// Data Statistics
router.post('/finance', auth, dataStatisticsController.getFinancialData);
router.get('/dashboard/orders', auth, dataStatisticsController.getOrdersdashboard);
router.get('/dashboard/products-topselling', auth, dataStatisticsController.getTopSellingProducts);

export default router;
