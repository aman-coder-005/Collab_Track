// server/routes/userRoutes.js

import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserProfileById // <-- 1. IMPORT THE NEW FUNCTION
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- These are your existing routes ---
router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile')
  .get(protect, getUserProfile)  // This is your private "My Profile" route
  .put(protect, updateUserProfile); // This is your private "Update Profile" route

// --- 2. ADD THIS NEW PUBLIC ROUTE ---
// This route is public and finds any user by their ID.
// It matches the request your frontend is making.
router.get('/profile/:id', getUserProfileById);

export default router;