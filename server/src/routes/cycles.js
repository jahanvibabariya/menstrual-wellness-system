import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import auth from '../middleware/auth.js';
import {
  getCycles,
  createCycle,
  updateCycle,
  deleteCycle,
  getPrediction,
} from '../controllers/cycleController.js';

const router = Router();

// All routes are protected
router.use(auth);

// GET /api/cycles
router.get('/', getCycles);

// POST /api/cycles
router.post(
  '/',
  [
    body('startDate')
      .notEmpty()
      .withMessage('Start date is required')
      .isISO8601()
      .withMessage('Start date must be a valid date'),
    body('cycleLength')
      .optional()
      .isInt({ min: 21, max: 45 })
      .withMessage('Cycle length must be between 21 and 45 days'),
    body('periodLength')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('Period length must be between 1 and 10 days'),
    validate,
  ],
  createCycle
);

// GET /api/cycles/predict — must come before /:id
router.get('/predict', getPrediction);

// PUT /api/cycles/:id
router.put('/:id', updateCycle);

// DELETE /api/cycles/:id
router.delete('/:id', deleteCycle);

export default router;
