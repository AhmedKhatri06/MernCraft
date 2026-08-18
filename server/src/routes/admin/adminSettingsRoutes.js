import express from 'express';
import { getProfile, updateProfile } from '../../controllers/admin/adminSettingsController.js';

const router = express.Router();

router.route('/')
  .get(getProfile)
  .patch(updateProfile);

export default router;
