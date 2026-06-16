import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import auth from '../middleware/auth.js';
import {
  getPainLogs,
  createPainLog,
  getPainStats,
  deletePainLog,
} from '../controllers/painLogController.js';

const router = Router();

// All routes are protected
router.use(auth);

// GET /api/pain-logs
router.get('/', getPainLogs);

// POST /api/pain-logs
router.post(
  '/',
  [
    body('painScore')
      .notEmpty()
      .withMessage('Pain score is required')
      .isInt({ min: 1, max: 10 })
      .withMessage('Pain score must be between 1 and 10'),
    body('symptoms')
      .optional()
      .isArray()
      .withMessage('Symptoms must be an array'),
    body('symptoms.*')
      .optional()
      .isIn([
        'cramps',
        'headache',
        'backPain',
        'bloating',
        'fatigue',
        'nausea',
        'breastTenderness',
        'moodSwings',
        'insomnia',
        'dizziness',
      ])
      .withMessage('Invalid symptom value'),
    body('mood')
      .optional()
      .isIn([
        'happy',
        'sad',
        'anxious',
        'irritable',
        'calm',
        'tired',
        'energetic',
        'neutral',
      ])
      .withMessage('Invalid mood value'),
    validate,
  ],
  createPainLog
);

// GET /api/pain-logs/stats
router.get('/stats', getPainStats);

// DELETE /api/pain-logs/:id
router.delete('/:id', deletePainLog);

export default router;
