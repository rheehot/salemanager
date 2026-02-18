// Dashboard Controller
import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboardService.js';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.dashboardService.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  };
}
