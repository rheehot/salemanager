// Email Controller
import { Request, Response, NextFunction } from 'express';
import { EmailService } from '../services/emailService.js';

export class EmailController {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  sendEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { to, cc, subject, body, template, templateData } = req.body;

      if (!to || !Array.isArray(to) || to.length === 0) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: '수신자(to)는 최소 1명 이상이어야 합니다'
          }
        });
      }

      if (!subject) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: '제목(subject)은 필수입니다'
          }
        });
      }

      const result = await this.emailService.sendEmail({
        to,
        cc,
        subject,
        body,
        template,
        templateData
      });

      res.status(200).json({
        success: true,
        messageId: result.messageId
      });
    } catch (error) {
      next(error);
    }
  };

  sendToMany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customerIds, subject, body, template, templateData } = req.body;

      if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: '고객 ID 목록(customerIds)은 필수입니다'
          }
        });
      }

      // Prisma import
      const prisma = (await import('../lib/db/prisma.js')).default;

      // 고객 정보 조회
      const customers = await prisma.customer.findMany({
        where: {
          id: { in: customerIds },
          email: { not: null }
        },
        select: {
          id: true,
          name: true,
          email: true
        }
      });

      if (customers.length === 0) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: '이메일이 있는 고객을 찾을 수 없습니다'
          }
        });
      }

      const results = await this.emailService.sendToMany(
        customers as any,
        { subject, body, template, templateData }
      );

      res.status(200).json({
        success: true,
        results,
        total: customers.length,
        sent: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      });
    } catch (error) {
      next(error);
    }
  };

  getTemplates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const templates = this.emailService.getTemplates();
      res.json({ data: templates });
    } catch (error) {
      next(error);
    }
  };

  getTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const template = this.emailService.getTemplate(String(id));

      if (!template) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: '템플릿을 찾을 수 없습니다'
          }
        });
      }

      res.json({ data: template });
    } catch (error) {
      next(error);
    }
  };

  getEmailLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const result = await this.emailService.getEmailLogs(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
