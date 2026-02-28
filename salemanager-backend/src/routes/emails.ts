// Email Routes
import { Router } from 'express';
import { EmailController } from '../controllers/emailController.js';
import { emailSendValidation, idParamValidation } from '../middleware/validator.js';

const router = Router();
const emailController = new EmailController();

// 이메일 발송
router.post('/send', emailSendValidation, emailController.sendEmail);

// 다수 고객에게 이메일 발송
router.post('/send-many', emailSendValidation, emailController.sendToMany);

// 이메일 템플릿 목록 조회
router.get('/templates', emailController.getTemplates);

// 특정 템플릿 조회
router.get('/templates/:id', idParamValidation, emailController.getTemplate);

// 이메일 발송 기록 조회
router.get('/logs', emailController.getEmailLogs);

export default router;
