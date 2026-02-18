// Activity Controller
import { Request, Response, NextFunction } from 'express';
import { ActivityService } from '../services/activityService.js';
import { AppError } from '../middleware/errorHandler.js';

export class ActivityController {
  private activityService: ActivityService;

  constructor() {
    this.activityService = new ActivityService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const type = req.query.type as string | undefined;
      const customerId = req.query.customerId as string | undefined;
      const leadId = req.query.leadId as string | undefined;
      const opportunityId = req.query.opportunityId as string | undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const result = await this.activityService.findAll({
        type,
        customerId,
        leadId,
        opportunityId,
        page,
        limit,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const activity = await this.activityService.findById(String(id));
      if (!activity) {
        throw new AppError('NOT_FOUND', 404, '활동을 찾을 수 없습니다');
      }
      res.json({ data: activity });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const activity = await this.activityService.create(req.body);
      res.status(201).json({ data: activity });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const activity = await this.activityService.update(String(id), req.body);
      res.json({ data: activity });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.activityService.delete(String(id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
