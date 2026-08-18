import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  verifyOTP,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

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

// TEMP DEBUG ROUTE - check what users exist in Render DB
import User from '../models/User.js';
router.get('/debug-users', async (req, res) => {
  const users = await User.find({}).select('email role isVerified').lean();
  res.json({ total: users.length, users });
});

export default router;
