import express from 'express';
import { getServices } from '../controllers/admin/adminServiceController.js';
import { getProjects } from '../controllers/admin/adminProjectController.js';
import { getPricingPlans } from '../controllers/admin/adminPricingController.js';
import { getTestimonials } from '../controllers/admin/adminTestimonialController.js';

const router = express.Router();

// Public Read-Only APIs
router.get('/services', getServices);
router.get('/projects', getProjects);
router.get('/pricing', getPricingPlans);
router.get('/testimonials', getTestimonials);

export default router;
