// Input Validation Middleware
import { body, param, ValidationChain } from 'express-validator';
import { AppError } from './errorHandler.js';

/**
 * Validation error handler middleware
 */
export const handleValidationErrors = (
  req: any,
  _res: any,
  next: any
) => {
  const errors = req.validationErrors?.();

  if (errors && errors.length > 0) {
    const formattedErrors: Record<string, string> = {};
    errors.forEach((error: any) => {
      formattedErrors[error.path] = error.msg;
    });

    throw new AppError(
      'VALIDATION_ERROR',
      400,
      '입력 값이 올바르지 않습니다',
      formattedErrors
    );
  }

  next();
};

/**
 * Customer validation rules
 */
export const customerValidation: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('고객명은 필수입니다')
    .isLength({ min: 1, max: 100 })
    .withMessage('고객명은 1-100자여야 합니다')
    .escape(),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('회사명은 100자 이하여야 합니다')
    .escape(),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('유효한 이메일이 아닙니다')
    .isLength({ max: 255 })
    .withMessage('이메일은 255자 이하여야 합니다'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]*$/)
    .withMessage('유효한 전화번호 형식이 아닙니다')
    .isLength({ max: 20 })
    .withMessage('전화번호는 20자 이하여야 합니다'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('상태는 active 또는 inactive이어야 합니다'),
];

/**
 * Lead validation rules
 */
export const leadValidation: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('리드명은 필수입니다')
    .isLength({ min: 1, max: 100 })
    .withMessage('리드명은 1-100자여야 합니다')
    .escape(),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('회사명은 100자 이하여야 합니다')
    .escape(),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('유효한 이메일이 아닙니다')
    .isLength({ max: 255 })
    .withMessage('이메일은 255자 이하여야 합니다'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]*$/)
    .withMessage('유효한 전화번호 형식이 아닙니다')
    .isLength({ max: 20 })
    .withMessage('전화번호는 20자 이하여야 합니다'),
  body('source')
    .optional()
    .isIn(['website', 'referral', 'event', 'cold_call', 'other'])
    .withMessage('유효하지 않은 리드 소스입니다'),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'converted', 'lost'])
    .withMessage('유효하지 않은 리드 상태입니다'),
];

/**
 * Opportunity validation rules
 */
export const opportunityValidation: ValidationChain[] = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('기회명은 필수입니다')
    .isLength({ min: 1, max: 200 })
    .withMessage('기회명은 1-200자여야 합니다')
    .escape(),
  body('stage')
    .optional()
    .isIn(['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'])
    .withMessage('유효하지 않은 영업 단계입니다'),
  body('value')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('예상 매출은 0 이상이어야 합니다'),
  body('probability')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('성공 확률은 0-100 사이여야 합니다'),
  body('expectedCloseDate')
    .notEmpty()
    .withMessage('예상 계약일은 필수입니다')
    .isISO8601()
    .withMessage('유효한 날짜 형식이 아닙니다'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('비고는 2000자 이하여야 합니다')
    .escape(),
];

/**
 * Activity validation rules
 */
export const activityValidation: ValidationChain[] = [
  body('type')
    .notEmpty()
    .withMessage('활동 유형은 필수입니다')
    .isIn(['email', 'call', 'meeting', 'note', 'other'])
    .withMessage('유효하지 않은 활동 유형입니다'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('활동 제목은 필수입니다')
    .isLength({ min: 1, max: 200 })
    .withMessage('활동 제목은 1-200자여야 합니다')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('활동 내용은 2000자 이하여야 합니다')
    .escape(),
  body('activityDate')
    .notEmpty()
    .withMessage('활동 일시는 필수입니다')
    .isISO8601()
    .withMessage('유효한 날짜 형식이 아닙니다'),
  body('duration')
    .optional()
    .isInt({ min: 0, max: 1440 })
    .withMessage('소요 시간은 0-1440분 사이여야 합니다'),
  body('outcome')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('결과 메모는 1000자 이하여야 합니다')
    .escape(),
];

/**
 * ID parameter validation
 */
export const idParamValidation: ValidationChain[] = [
  param('id')
    .notEmpty()
    .withMessage('ID는 필수입니다')
    .isUUID()
    .withMessage('유효한 UUID 형식이 아닙니다'),
];

/**
 * Pagination query validation
 */
export const paginationQueryValidation: ValidationChain[] = [
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('페이지 번호는 1 이상이어야 합니다'),
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('페이지 크기는 1-100 사이여야 합니다'),
  body('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('검색어는 100자 이하여야 합니다'),
  body('status')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('상태값은 50자 이하여야 합니다'),
];

/**
 * Email validation rules
 */
export const emailSendValidation: ValidationChain[] = [
  body('customerIds')
    .isArray({ min: 1 })
    .withMessage('최소 1명 이상의 고객을 선택해야 합니다'),
  body('customerIds.*')
    .isUUID()
    .withMessage('유효한 고객 ID 형식이 아닙니다'),
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('이메일 제목은 필수입니다')
    .isLength({ min: 1, max: 200 })
    .withMessage('제목은 1-200자여야 합니다')
    .escape(),
  body('body')
    .trim()
    .notEmpty()
    .withMessage('이메일 내용은 필수입니다')
    .isLength({ min: 1, max: 10000 })
    .withMessage('이메일 내용은 10000자 이하여야 합니다'),
];

/**
 * Login validation
 */
export const loginValidation: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('이메일은 필수입니다')
    .isEmail()
    .normalizeEmail()
    .withMessage('유효한 이메일이 아닙니다'),
  body('password')
    .notEmpty()
    .withMessage('비밀번호는 필수입니다')
    .isLength({ min: 6 })
    .withMessage('비밀번호는 최소 6자 이상이어야 합니다'),
];

/**
 * Register validation
 */
export const registerValidation: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('이메일은 필수입니다')
    .isEmail()
    .normalizeEmail()
    .withMessage('유효한 이메일이 아닙니다'),
  body('password')
    .notEmpty()
    .withMessage('비밀번호는 필수입니다')
    .isLength({ min: 6, max: 100 })
    .withMessage('비밀번호는 6-100자여야 합니다'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('이름은 필수입니다')
    .isLength({ min: 1, max: 50 })
    .withMessage('이름은 1-50자여야 합니다')
    .escape(),
];

/**
 * Change password validation
 */
export const changePasswordValidation: ValidationChain[] = [
  body('oldPassword')
    .notEmpty()
    .withMessage('현재 비밀번호는 필수입니다'),
  body('newPassword')
    .notEmpty()
    .withMessage('새 비밀번호는 필수입니다')
    .isLength({ min: 6, max: 100 })
    .withMessage('비밀번호는 6-100자여야 합니다'),
];
