import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '../controllers/notificationController.js';

const router = Router();

// All routes are protected
router.use(auth);

// GET /api/notifications
router.get('/', getNotifications);

// PUT /api/notifications/read-all — must come before /:id/read
router.put('/read-all', markAllAsRead);

// PUT /api/notifications/:id/read
router.put('/:id/read', markAsRead);

export default router;
