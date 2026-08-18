import express from 'express';
import { getQuotes, createQuote, getQuote, updateQuote, deleteQuote } from '../../controllers/admin/adminQuoteController.js';

const router = express.Router();

router.route('/')
  .get(getQuotes)
  .post(createQuote);

router.route('/:id')
  .get(getQuote)
  .patch(updateQuote)
  .delete(deleteQuote);

export default router;
