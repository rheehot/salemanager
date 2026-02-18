// Lead Controller
import { Request, Response, NextFunction } from 'express';
import { LeadService } from '../services/leadService.js';
import { AppError } from '../middleware/errorHandler.js';

export class LeadController {
  private leadService: LeadService;

  constructor() {
    this.leadService = new LeadService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = req.query.search as string | undefined;
      const status = req.query.status as string | undefined;
      const source = req.query.source as string | undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const result = await this.leadService.findAll({ search, status, source, page, limit });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const lead = await this.leadService.findById(String(id));
      if (!lead) {
        throw new AppError('NOT_FOUND', 404, '리드를 찾을 수 없습니다');
      }
      res.json({ data: lead });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lead = await this.leadService.create(req.body);
      res.status(201).json({ data: lead });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const lead = await this.leadService.update(String(id), req.body);
      res.json({ data: lead });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.leadService.delete(String(id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  convertToCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.leadService.convertToCustomer(String(id));
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
