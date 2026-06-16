import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import auth from '../middleware/auth.js';
import {
  register,
  login,
  refreshTokenHandler,
  logout,
  getMe,
  resetPassword,
} from '../controllers/authController.js';

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    validate,
  ],
  register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  login
);

// POST /api/auth/refresh
router.post('/refresh', refreshTokenHandler);

// POST /api/auth/logout
router.post('/logout', auth, logout);

// GET /api/auth/me
router.get('/me', auth, getMe);

// POST /api/auth/reset-password
router.post(
  '/reset-password',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('newPassword')
      .notEmpty()
      .withMessage('New password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    validate,
  ],
  resetPassword
);

export default router;
