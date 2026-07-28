import express from 'express';
import {
  applyJob,
  getSeekerApplications,
  getJobApplicants,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply/:jobId', protect, authorizeRoles('seeker'), applyJob);
router.get('/seeker/my-applications', protect, authorizeRoles('seeker'), getSeekerApplications);
router.get('/job/:jobId', protect, authorizeRoles('recruiter', 'admin'), getJobApplicants);
router.put('/:id/status', protect, authorizeRoles('recruiter', 'admin'), updateApplicationStatus);

export default router;
