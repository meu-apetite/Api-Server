import { Router } from 'express';
import StoreController from '../../controllers/StoreController.js';

const router = Router();

const controller = new StoreController();

router.get('/products/:storeUrl', controller.getCollections);
router.get('/:storeUrl', controller.getStore);
router.post('/estimateValue', controller.estimateValue);
router.post('/payment', controller.getPaymentOptions);
router.post('/calculateFreight', controller.calculateFreight);
router.post('/finishOrder/:storeUrl', controller.finishOrder);
router.get('/:storeUrl/order/:orderId', controller.getOrder);

export default router;