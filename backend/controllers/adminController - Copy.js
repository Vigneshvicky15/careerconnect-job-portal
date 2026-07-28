import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

/**
 * @desc    Get dashboard analytics
 * @route   GET /api/admin/analytics
 * @access  Private (Admin)
 */
export const getAnalytics = async (req, res) => {
  try {
    const totalSeekers = await User.countDocuments({ role: 'seeker' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    const totalJobs = await Job.countDocuments({});
    const activeJobs = await Job.countDocuments({ isActive: true });
    const inactiveJobs = await Job.countDocuments({ isActive: false });

    const totalApplications = await Application.countDocuments({});

    // Group applications by status for analytics charts
    const appStats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Group jobs by jobType
    const jobTypeStats = await Job.aggregate([
      {
        $group: {
          _id: '$jobType',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        users: {
          seekers: totalSeekers,
          recruiters: totalRecruiters,
          admins: totalAdmins,
          total: totalSeekers + totalRecruiters + totalAdmins,
        },
        jobs: {
          total: totalJobs,
          active: activeJobs,
          inactive: inactiveJobs,
        },
        applications: {
          total: totalApplications,
          stats: appStats,
        },
        jobTypes: jobTypeStats,
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all users (with search and filters)
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
export const getUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Don't delete the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ success: false, message: 'Cannot delete the only remaining Admin account' });
      }
    }

    // Delete associated jobs and applications
    if (user.role === 'recruiter') {
      await Job.deleteMany({ recruiter: user._id });
    } else if (user.role === 'seeker') {
      await Application.deleteMany({ applicant: user._id });
    }

    await user.deleteOne();
    res.json({ success: true, message: 'User and all associated data deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
