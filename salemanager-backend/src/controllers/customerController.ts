// Customer Controller
import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customerService.js';
import { AppError } from '../middleware/errorHandler.js';

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = req.query.search as string | undefined;
      const status = req.query.status as string | undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const result = await this.customerService.findAll({ search, status, page, limit });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const customer = await this.customerService.findById(String(id));
      if (!customer) {
        throw new AppError('NOT_FOUND', 404, '고객을 찾을 수 없습니다');
      }
      res.json({ data: customer });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customer = await this.customerService.create(req.body);
      res.status(201).json({ data: customer });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const customer = await this.customerService.update(String(id), req.body);
      res.json({ data: customer });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.customerService.delete(String(id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
