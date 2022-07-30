import { Router } from 'express';
import authorized from '../middleware/isAuthorizedMiddleware.js';

import RegisterController from '../controllers/RegisterController.js';
import LoginController from '../controllers/LoginController.js';
import StoreController from '../controllers/StoreController.js';

const router = Router();
const registerController = new RegisterController();
const loginController = new LoginController();
const storeController = new StoreController();

//landing page
router.get('/', (req, res) => res.render('index'));

//Register
router.get('/register', registerController.index);
router.post('/register', registerController.register);

//login
router.get('/:subdomain/login', loginController.index);

//admin
router.get('/admin', authorized, async (req, res) => {
  const { subdomain } = req.user;
  res.redirect(`/${subdomain}/admin`);
});
router.get('/:subdomain/admin', authorized, (req, res) => res.render('admin'));
router.get('/:subdomain/admin/test', authorized, (req, res) => res.render('admin/test'));

// store
router.get('/:subdomain/', storeController.index);

export default router;
