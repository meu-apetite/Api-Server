import { Router } from 'express';
import VariationController from '../../controllers/admin/VariationController.js';

const router = Router();

const variationController = new VariationController();

router.get('/admin/variation', variationController.pageIndex);
router.get('/admin/variation/create', variationController.pageCreate);
router.post('/admin/variation/create', variationController.create);
router.get(
  '/admin/variation/update/:variationId',
  variationController.pageUpdate
);
router.post('/admin/variation/update/:variationId', variationController.update);
router.get('/admin/variation/delete/:variationId', variationController.delete);
router.get(
  '/admin/variation/findAjax/:variationId',
  variationController.findAjax
);

export default router;
