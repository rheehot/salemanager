// Activity Routes
import { Router } from 'express';
import { ActivityController } from '../controllers/activityController.js';

const router = Router();
const activityController = new ActivityController();

// GET /api/activities - Get all activities
router.get('/', activityController.getAll.bind(activityController));

// GET /api/activities/:id - Get activity by ID
router.get('/:id', activityController.getById.bind(activityController));

// POST /api/activities - Create new activity
router.post('/', activityController.create.bind(activityController));

// PUT /api/activities/:id - Update activity
router.put('/:id', activityController.update.bind(activityController));

// DELETE /api/activities/:id - Delete activity
router.delete('/:id', activityController.delete.bind(activityController));

export default router;
