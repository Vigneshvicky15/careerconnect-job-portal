import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

/**
 * @desc    Apply for a job
 * @route   POST /api/applications/apply/:jobId
 * @access  Private (Seeker)
 */
export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user._id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (!job.isActive) {
      return res.status(400).json({ success: false, message: 'This job posting is no longer active' });
    }

    // Check if user has uploaded a resume
    const user = await User.findById(userId);
    if (!user.resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume in your profile page before applying.',
      });
    }

    // Check duplicate application
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job posting.',
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: userId,
      resumeUrl: user.resumeUrl,
      resumeName: user.resumeName || 'Resume',
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: application,
    });
  } catch (error) {
    console.error('Apply job error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get logged in seeker's job applications
 * @route   GET /api/applications/seeker/my-applications
 * @access  Private (Seeker)
 */
export const getSeekerApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        select: 'title companyName location salary jobType companyLogoUrl recruiter',
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: applications });
  } catch (error) {
    console.error('Get seeker applications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all applications for a specific job (Recruiter view)
 * @route   GET /api/applications/job/:jobId
 * @access  Private (Recruiter/Admin)
 */
export const getJobApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Verify ownership
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view applicants for this job' });
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email title bio skills experience education profilePhotoUrl')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: applications });
  } catch (error) {
    console.error('Get job applicants error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update application status
 * @route   PUT /api/applications/:id/status
 * @access  Private (Recruiter/Admin)
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify ownership
    if (
      application.job.recruiter.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update status of this application',
      });
    }

    application.status = status;
    await application.save();

    res.json({ success: true, message: `Application status updated to ${status}`, data: application });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
