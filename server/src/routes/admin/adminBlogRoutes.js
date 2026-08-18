import express from 'express';
import { getBlogPosts, getBlogPost, createBlogPost, updateBlogPost, deleteBlogPost } from '../../controllers/admin/adminBlogController.js';

const router = express.Router();

router.route('/')
  .get(getBlogPosts)
  .post(createBlogPost);

router.route('/:id')
  .get(getBlogPost)
  .patch(updateBlogPost)
  .delete(deleteBlogPost);

export default router;
