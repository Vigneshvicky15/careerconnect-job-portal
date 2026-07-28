import express from 'express';
import {
  getAnalytics,
  getUsers,
  deleteUser,
} from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply admin protection to all routes in this file
router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

export default router;
