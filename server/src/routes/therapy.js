import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import auth from '../middleware/auth.js';
import {
  getSessions,
  createSession,
  getStats,
} from '../controllers/therapyController.js';

const router = Router();

// All routes are protected
router.use(auth);

// GET /api/therapy
router.get('/', getSessions);

// POST /api/therapy
router.post(
  '/',
  [
    body('heatLevel')
      .notEmpty()
      .withMessage('Heat level is required')
      .isIn(['low', 'medium', 'high'])
      .withMessage('Heat level must be low, medium, or high'),
    body('vibrationMode')
      .notEmpty()
      .withMessage('Vibration mode is required')
      .isIn(['gentle', 'moderate', 'strong'])
      .withMessage('Vibration mode must be gentle, moderate, or strong'),
    body('duration')
      .notEmpty()
      .withMessage('Duration is required')
      .isInt({ min: 1, max: 120 })
      .withMessage('Duration must be between 1 and 120 minutes'),
    validate,
  ],
  createSession
);

// GET /api/therapy/stats
router.get('/stats', getStats);

export default router;
