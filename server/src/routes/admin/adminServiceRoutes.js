import express from 'express';
import { getServices, getService, createService, updateService, deleteService } from '../../controllers/admin/adminServiceController.js';

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(createService);

router.route('/:id')
  .get(getService)
  .patch(updateService)
  .delete(deleteService);

export default router;
