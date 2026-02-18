// Dashboard Routes
import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController.js';

const router = Router();
const dashboardController = new DashboardController();

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', dashboardController.getStats.bind(dashboardController));

export default router;
