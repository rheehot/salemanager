// Opportunity Routes
import { Router } from 'express';
import { OpportunityController } from '../controllers/opportunityController.js';
import {
  opportunityValidation,
  idParamValidation,
} from '../middleware/validator.js';

const router = Router();
const opportunityController = new OpportunityController();

// GET /api/opportunities - Get all opportunities
router.get('/', opportunityController.getAll.bind(opportunityController));

// GET /api/opportunities/:id - Get opportunity by ID
router.get('/:id', idParamValidation, opportunityController.getById.bind(opportunityController));

// POST /api/opportunities - Create new opportunity
router.post('/', opportunityValidation, opportunityController.create.bind(opportunityController));

// PUT /api/opportunities/:id - Update opportunity
router.put('/:id', idParamValidation, opportunityValidation, opportunityController.update.bind(opportunityController));

// DELETE /api/opportunities/:id - Delete opportunity
router.delete('/:id', idParamValidation, opportunityController.delete.bind(opportunityController));

export default router;
