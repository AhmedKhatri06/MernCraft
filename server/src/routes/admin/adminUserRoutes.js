import express from 'express';
import { getUsers, toggleUserStatus } from '../../controllers/admin/adminUserController.js';

const router = express.Router();

router.route('/')
  .get(getUsers);

router.route('/:id/status')
  .patch(toggleUserStatus);

export default router;
