import express from 'express';
import { getProjects, getProject, createProject, updateProject, deleteProject } from '../../controllers/admin/adminProjectController.js';

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProject)
  .patch(updateProject)
  .delete(deleteProject);

export default router;
