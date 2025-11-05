// server/routes/projectRoutes.js

import express from 'express';
import { 
  getAllProjects,
  createProject,
  getProjectById,
  applyToProject,
  acceptMember,
  declineMember,
  addTaskToKanban,
  moveTaskInKanban,
  deleteTaskFromKanban
} from '../controllers/projectController.js';

// 1. IMPORT 'isOwner' ALONG WITH 'protect'
import { protect, isOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- These routes are unchanged ---
router.route('/')
  .get(getAllProjects)
  .post(protect, createProject);

router.route('/:id')
  .get(getProjectById);

router.route('/:id/apply')
  .post(protect, applyToProject);

// --- 2. UPDATE THESE TWO ROUTES ---
// The request will now run 'protect', then 'isOwner', then 'acceptMember'
router.route('/:id/accept')
  .post(protect, isOwner, acceptMember);

// The request will run 'protect', then 'isOwner', then 'declineMember'
router.route('/:id/decline')
  .post(protect, isOwner, declineMember);
// --- END OF FIX ---

// --- These routes can be used by any project member, so no 'isOwner' needed ---
router.route('/:id/kanban/tasks')
  .post(protect, addTaskToKanban)
  .delete(protect, deleteTaskFromKanban);

router.route('/:id/kanban/tasks/move')
  .put(protect, moveTaskInKanban);

export default router;