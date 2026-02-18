// Opportunity Controller
import { Request, Response, NextFunction } from 'express';
import { OpportunityService } from '../services/opportunityService.js';
import { AppError } from '../middleware/errorHandler.js';

export class OpportunityController {
  private opportunityService: OpportunityService;

  constructor() {
    this.opportunityService = new OpportunityService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stage = req.query.stage as string | undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const result = await this.opportunityService.findAll({ stage, page, limit });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const opportunity = await this.opportunityService.findById(String(id));
      if (!opportunity) {
        throw new AppError('NOT_FOUND', 404, '영업 기회를 찾을 수 없습니다');
      }
      res.json({ data: opportunity });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const opportunity = await this.opportunityService.create(req.body);
      res.status(201).json({ data: opportunity });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const opportunity = await this.opportunityService.update(String(id), req.body);
      res.json({ data: opportunity });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.opportunityService.delete(String(id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
