import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  toggleSaveJob,
  getRecommendedJobs,
  getRecruiterJobs,
} from '../controllers/jobController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(protect, authorizeRoles('recruiter', 'admin'), createJob);

router.get('/recommended', protect, authorizeRoles('seeker'), getRecommendedJobs);
router.get('/recruiter/my-jobs', protect, authorizeRoles('recruiter'), getRecruiterJobs);

router.route('/:id')
  .get(getJobById)
  .put(protect, authorizeRoles('recruiter', 'admin'), updateJob)
  .delete(protect, authorizeRoles('recruiter', 'admin'), deleteJob);

router.post('/:id/save', protect, authorizeRoles('seeker'), toggleSaveJob);

export default router;
