import express from 'express';
import { getMessagesForProject } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js'; // Import our protection middleware

const router = express.Router();

// When a GET request comes to /:projectId,
// first 'protect' the route, then run 'getMessagesForProject'
router.get('/:projectId', protect, getMessagesForProject);

export default router;