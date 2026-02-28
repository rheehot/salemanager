// Activity Routes
import { Router } from 'express';
import { ActivityController } from '../controllers/activityController.js';
import {
  activityValidation,
  idParamValidation,
} from '../middleware/validator.js';

const router = Router();
const activityController = new ActivityController();

// GET /api/activities - Get all activities
router.get('/', activityController.getAll.bind(activityController));

// GET /api/activities/:id - Get activity by ID
router.get('/:id', idParamValidation, activityController.getById.bind(activityController));

// POST /api/activities - Create new activity
router.post('/', activityValidation, activityController.create.bind(activityController));

// PUT /api/activities/:id - Update activity
router.put('/:id', idParamValidation, activityValidation, activityController.update.bind(activityController));

// DELETE /api/activities/:id - Delete activity
router.delete('/:id', idParamValidation, activityController.delete.bind(activityController));

export default router;
