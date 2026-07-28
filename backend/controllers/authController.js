import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'seeker',
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Auth user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          bio: user.bio,
          title: user.title,
          skills: user.skills,
          experience: user.experience,
          education: user.education,
          resumeUrl: user.resumeUrl,
          resumeName: user.resumeName,
          profilePhotoUrl: user.profilePhotoUrl,
          savedJobs: user.savedJobs,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs');
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update simple fields
    user.name = req.body.name || user.name;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.title = req.body.title !== undefined ? req.body.title : user.title;

    if (req.body.skills) {
      try {
        user.skills = typeof req.body.skills === 'string' ? JSON.parse(req.body.skills) : req.body.skills;
      } catch (err) {
        user.skills = req.body.skills.split(',').map(s => s.trim());
      }
    }

    if (req.body.experience) {
      try {
        user.experience = typeof req.body.experience === 'string' ? JSON.parse(req.body.experience) : req.body.experience;
      } catch (err) {
        // Fallback or leave as is
      }
    }

    if (req.body.education) {
      try {
        user.education = typeof req.body.education === 'string' ? JSON.parse(req.body.education) : req.body.education;
      } catch (err) {
        // Fallback or leave as is
      }
    }

    // Handle files upload to Cloudinary (profilePhoto / resume)
    if (req.files) {
      if (req.files.profilePhoto && req.files.profilePhoto[0]) {
        const photoResult = await uploadToCloudinary(
          req.files.profilePhoto[0].buffer,
          'careerconnect/photos',
          'image'
        );
        user.profilePhotoUrl = photoResult.secure_url;
      }

      if (req.files.resume && req.files.resume[0]) {
        const resumeResult = await uploadToCloudinary(
          req.files.resume[0].buffer,
          'careerconnect/resumes',
          'raw'
        );
        user.resumeUrl = resumeResult.secure_url;
        user.resumeName = req.files.resume[0].originalname;
      }
    }

    const updatedUser = await user.save();
    const populatedUser = await User.findById(updatedUser._id).populate('savedJobs');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: populatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
