import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Update profile handles optional files profilePhoto and resume
router.route('/profile')
  .get(protect, getProfile)
  .put(
    protect,
    upload.fields([
      { name: 'profilePhoto', maxCount: 1 },
      { name: 'resume', maxCount: 1 },
    ]),
    updateProfile
  );

export default router;
