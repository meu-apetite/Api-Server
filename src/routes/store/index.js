import { Router } from 'express';
import StoreController from '../../controllers/StoreController.js';

const router = Router();

const controller = new StoreController();

router.get('/store/products/:storeUrl', controller.getAllProduct);
router.get('/store/:storeUrl', controller.getStore);
router.post('/store/estimateValue', controller.estimateValue);
router.post('/store/payment', controller.getPaymentOptions);
router.post('/store/calculateFreight', controller.calculateFreight);
router.post('/store/finishOrder/:storeUrl', controller.finishOrder);
router.get('/store/:storeUrl/order/:orderId', controller.getOrder);

export default router;