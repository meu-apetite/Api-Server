import { Router } from 'express';
import StoreController from '../../controllers/StoreController.js';

const router = Router();

const controller = new StoreController();

router.get('/store/products/:companyId', controller.getAllProduct);
router.get('/store/:companyId', controller.getStore);
router.post('/store/estimateValue', controller.estimateValue);
router.get('/store/payment/:companyId', controller.getPaymentOptions);
router.post('/store/calculateFreight', controller.calculateFreight);


export default router;