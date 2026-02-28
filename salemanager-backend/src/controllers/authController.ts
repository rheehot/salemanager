// Authentication Controller
import { Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const authService = new AuthService();

export class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  register = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body;

      // Validation
      if (!email || !password || !name) {
        throw new AppError('VALIDATION_ERROR', 400, '이메일, 비밀번호, 이름은 필수입니다');
      }

      if (password.length < 6) {
        throw new AppError('VALIDATION_ERROR', 400, '비밀번호는 최소 6자 이상이어야 합니다');
      }

      const result = await authService.register({ email, password, name });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user
   * POST /api/auth/login
   */
  login = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        throw new AppError('VALIDATION_ERROR', 400, '이메일과 비밀번호는 필수입니다');
      }

      const result = await authService.login({ email, password });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get current user info
   * GET /api/auth/me
   */
  me = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new AppError('UNAUTHORIZED', 401, '인증이 필요합니다');
      }

      const user = await authService.getUserById(req.userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Change password
   * PUT /api/auth/change-password
   */
  changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new AppError('UNAUTHORIZED', 401, '인증이 필요합니다');
      }

      const { oldPassword, newPassword } = req.body;

      // Validation
      if (!oldPassword || !newPassword) {
        throw new AppError('VALIDATION_ERROR', 400, '현재 비밀번호와 새 비밀번호는 필수입니다');
      }

      if (newPassword.length < 6) {
        throw new AppError('VALIDATION_ERROR', 400, '새 비밀번호는 최소 6자 이상이어야 합니다');
      }

      const result = await authService.changePassword(req.userId, oldPassword, newPassword);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
