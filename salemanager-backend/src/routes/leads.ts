// Lead Routes
import { Router } from 'express';
import { LeadController } from '../controllers/leadController.js';

const router = Router();
const leadController = new LeadController();

// GET /api/leads - Get all leads
router.get('/', leadController.getAll.bind(leadController));

// GET /api/leads/:id - Get lead by ID
router.get('/:id', leadController.getById.bind(leadController));

// POST /api/leads - Create new lead
router.post('/', leadController.create.bind(leadController));

// PUT /api/leads/:id - Update lead
router.put('/:id', leadController.update.bind(leadController));

// DELETE /api/leads/:id - Delete lead
router.delete('/:id', leadController.delete.bind(leadController));

// PUT /api/leads/:id/convert - Convert lead to customer
router.put('/:id/convert', leadController.convertToCustomer.bind(leadController));

export default router;
