import express from 'express';
import { getUserDashboardData, getUserQuotes, getUserProjects } from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/dashboard-data', getUserDashboardData);
router.get('/quotes', getUserQuotes);
router.get('/projects', getUserProjects);

export default router;
