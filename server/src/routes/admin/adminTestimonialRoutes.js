import express from 'express';
import { getTestimonials, getTestimonial, createTestimonial, updateTestimonial, deleteTestimonial } from '../../controllers/admin/adminTestimonialController.js';

const router = express.Router();

router.route('/')
  .get(getTestimonials)
  .post(createTestimonial);

router.route('/:id')
  .get(getTestimonial)
  .patch(updateTestimonial)
  .delete(deleteTestimonial);

export default router;
