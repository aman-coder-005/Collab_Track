// server/routes/notificationRoutes.js

import express from 'express';
import { 
  getMyNotifications, 
  markNotificationsAsRead 
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all my notifications
router.route('/')
  .get(protect, getMyNotifications);

// PUT to mark all as read
router.route('/read')
  .put(protect, markNotificationsAsRead);

export default router;