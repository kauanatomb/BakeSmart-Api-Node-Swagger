import express from 'express';
import { userController } from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', userController.createUser);
// router.put('/:id', auth, userController.updateUser);
// router.get('/:id', auth, userController.getOneUser);
router.post('/login', userController.loginUser);
router.post('/logout', auth, userController.logoutUser);

export default router
