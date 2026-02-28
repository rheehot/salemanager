// Authentication Routes
import express from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const authController = new AuthController();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authController.register.bind(authController));

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authController.login.bind(authController));

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Private (requires auth)
 */
router.get('/me', authenticate, authController.me.bind(authController));

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private (requires auth)
 */
router.put('/change-password', authenticate, authController.changePassword.bind(authController));

export default router;
