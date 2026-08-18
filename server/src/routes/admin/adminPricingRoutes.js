import express from 'express';
import { getPricingPlans, getPricingPlan, createPricingPlan, updatePricingPlan, deletePricingPlan } from '../../controllers/admin/adminPricingController.js';

const router = express.Router();

router.route('/')
  .get(getPricingPlans)
  .post(createPricingPlan);

router.route('/:id')
  .get(getPricingPlan)
  .patch(updatePricingPlan)
  .delete(deletePricingPlan);

export default router;
