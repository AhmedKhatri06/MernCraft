import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { authorizeAdmin } from '../middleware/adminMiddleware.js';

// Import modular admin routes
import adminDashboardRoutes from './admin/adminDashboardRoutes.js';
import adminLeadRoutes from './admin/adminLeadRoutes.js';
import adminQuoteRoutes from './admin/adminQuoteRoutes.js';
import adminProjectRoutes from './admin/adminProjectRoutes.js';
import adminServiceRoutes from './admin/adminServiceRoutes.js';
import adminPricingRoutes from './admin/adminPricingRoutes.js';
import adminTestimonialRoutes from './admin/adminTestimonialRoutes.js';
import adminBlogRoutes from './admin/adminBlogRoutes.js';
import adminUserRoutes from './admin/adminUserRoutes.js';
import adminSettingsRoutes from './admin/adminSettingsRoutes.js';

const router = express.Router();

// Apply middleware to all admin routes
router.use(authenticateUser);
router.use(authorizeAdmin);

// Mount modular routes
router.use('/dashboard', adminDashboardRoutes);
router.use('/leads', adminLeadRoutes);
router.use('/quotes', adminQuoteRoutes);
router.use('/projects', adminProjectRoutes);
router.use('/services', adminServiceRoutes);
router.use('/pricing', adminPricingRoutes);
router.use('/testimonials', adminTestimonialRoutes);
router.use('/blog', adminBlogRoutes);
router.use('/users', adminUserRoutes);
router.use('/settings', adminSettingsRoutes);

export default router;
