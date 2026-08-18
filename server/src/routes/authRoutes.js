import express from 'express';
import { register, login, logout, getMe, forgotPassword, resetPassword } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);
router.get('/me', authenticateUser, getMe);

export default router;
