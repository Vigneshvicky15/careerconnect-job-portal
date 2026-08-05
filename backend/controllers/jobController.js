import Job from '../models/Job.js';
import User from '../models/User.js';

/**
 * @desc    Create a new job posting
 * @route   POST /api/jobs
 * @access  Private (Recruiter/Admin)
 */
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experienceLevel,
      companyName,
      companyLogoUrl,
    } = req.body;

    let parsedRequirements = requirements;
    if (typeof requirements === 'string') {
      try {
        parsedRequirements = JSON.parse(requirements);
      } catch (e) {
        parsedRequirements = requirements.split(',').map((req) => req.trim());
      }
    }

    const job = await Job.create({
      title,
      description,
      requirements: parsedRequirements || [],
      salary,
      location,
      jobType,
      experienceLevel,
      companyName,
      companyLogoUrl: companyLogoUrl || '',
      recruiter: req.user._id,
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all jobs (with search, filter & pagination)
 * @route   GET /api/jobs
 * @access  Public
 */
export const getJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      jobType,
      experienceLevel,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { isActive: true };

    // Search query mapping (fuzzy matching across title, company, description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experienceLevel) {
      query.experienceLevel = { $regex: experienceLevel, $options: 'i' };
    }

    // Pagination calculations
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: jobs,
      pagination: {
        totalJobs,
        totalPages: Math.ceil(totalJobs / parseInt(limit)),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single job by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name email bio profilePhotoUrl');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update a job posting
 * @route   PUT /api/jobs/:id
 * @access  Private (Recruiter/Admin)
 */
export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check ownership
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    const { requirements } = req.body;
    let parsedRequirements = requirements;
    if (requirements && typeof requirements === 'string') {
      try {
        parsedRequirements = JSON.parse(requirements);
      } catch (e) {
        parsedRequirements = requirements.split(',').map((req) => req.trim());
      }
    }

    const updateData = { ...req.body };
    if (parsedRequirements) {
      updateData.requirements = parsedRequirements;
    }

    job = await Job.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: job });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a job posting
 * @route   DELETE /api/jobs/:id
 * @access  Private (Recruiter/Admin)
 */
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check ownership
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.json({ success: true, message: 'Job posting deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Toggle saved/bookmarked status of a job
 * @route   POST /api/jobs/:id/save
 * @access  Private (Seeker)
 */
export const toggleSaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const isSaved = user.savedJobs.includes(jobId);
    if (isSaved) {
      user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
      await user.save();
      res.json({ success: true, message: 'Job removed from bookmarks', isSaved: false });
    } else {
      user.savedJobs.push(jobId);
      await user.save();
      res.json({ success: true, message: 'Job saved to bookmarks', isSaved: true });
    }
  } catch (error) {
    console.error('Toggle save job error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get recommended jobs based on seeker's skills or title
 * @route   GET /api/jobs/recommended
 * @access  Private (Seeker)
 */
export const getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const allJobs = await Job.find({ isActive: true }).populate('recruiter', 'name companyName');
    
    // Normalize user skills for comparison
    const userSkills = (user.skills || []).map(s => s.toLowerCase().trim());
    
    const jobsWithMatchScore = allJobs.map(job => {
      const jobReqs = (job.requirements || []).map(r => r.toLowerCase().trim());
      
      let matchScore = 0;
      let matchedSkills = [];
      
      if (jobReqs.length > 0 && userSkills.length > 0) {
        // Find intersection of skills
        matchedSkills = jobReqs.filter(req => 
          userSkills.some(skill => req.includes(skill) || skill.includes(req))
        );
        matchScore = Math.round((matchedSkills.length / jobReqs.length) * 100);
      }
      
      // Bonus match if the job title matches the user's title
      if (user.title && job.title.toLowerCase().includes(user.title.toLowerCase().trim())) {
        matchScore = Math.min(100, matchScore + 20); // +20% boost
      }

      const jobObj = job.toObject();
      jobObj.matchScore = Math.min(100, matchScore); // Cap at 100
      jobObj.matchedSkills = matchedSkills;
      
      return jobObj;
    });

    // Filter jobs with at least 1% match, sort descending, limit to 10
    const recommendedJobs = jobsWithMatchScore
      .filter(job => job.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    res.json({ success: true, data: recommendedJobs });
  } catch (error) {
    console.error('Get recommended jobs error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get recruiter's posted jobs
 * @route   GET /api/jobs/recruiter/my-jobs
 * @access  Private (Recruiter)
 */
export const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (error) {
    console.error('Get recruiter jobs error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
