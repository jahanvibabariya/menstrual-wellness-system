import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import auth from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import {
  getUsers,
  toggleUserStatus,
  getAnalytics,
  getContent,
  createContent,
  updateContent,
  deleteContent,
  getReports,
} from '../controllers/adminController.js';

const router = Router();

// All admin routes require auth + admin role
router.use(auth, authorize('admin'));

// GET /api/admin/users
router.get('/users', getUsers);

// PUT /api/admin/users/:id/toggle
router.put('/users/:id/toggle', toggleUserStatus);

// GET /api/admin/analytics
router.get('/analytics', getAnalytics);

// GET /api/admin/content
router.get('/content', getContent);

// POST /api/admin/content
router.post(
  '/content',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('category')
      .notEmpty()
      .withMessage('Category is required')
      .isIn(['wellness_tip', 'relaxation', 'education'])
      .withMessage('Category must be wellness_tip, relaxation, or education'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required'),
    body('content').trim().notEmpty().withMessage('Content body is required'),
    validate,
  ],
  createContent
);

// PUT /api/admin/content/:id
router.put('/content/:id', updateContent);

// DELETE /api/admin/content/:id
router.delete('/content/:id', deleteContent);

// GET /api/admin/reports
router.get('/reports', getReports);

export default router;
