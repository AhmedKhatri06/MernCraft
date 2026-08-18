import express from 'express';
import { getLeads, getLead, updateLead, deleteLead } from '../../controllers/admin/adminLeadController.js';

const router = express.Router();

router.get('/', getLeads);
router.get('/:id', getLead);
router.patch('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;
