import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  PlusSquare,
  Users,
  CheckCircle,
  Eye,
  Trash2,
  X,
  FileText,
  MapPin,
  DollarSign,
  UserCheck
} from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import SkeletonLoader from '../../components/SkeletonLoader';
import toast from 'react-hot-toast';

const RecruiterDashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal control states
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  // Post job form state
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    jobType: 'Full-time',
    experienceLevel: 'Mid',
    companyName: '',
    companyLogoUrl: '',
  });

  const fetchRecruiterJobs = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/jobs/recruiter/my-jobs');
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load job postings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/jobs', jobForm);
      if (res.data.success) {
        toast.success('Job posted successfully!');
        setShowPostModal(false);
        setJobForm({
          title: '',
          description: '',
          requirements: '',
          salary: '',
          location: '',
          jobType: 'Full-time',
          experienceLevel: 'Mid',
          companyName: '',
          companyLogoUrl: '',
        });
        fetchRecruiterJobs();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error posting job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting? This cannot be undone.')) {
      try {
        const res = await axiosInstance.delete(`/jobs/${jobId}`);
        if (res.data.success) {
          toast.success(res.data.message);
          fetchRecruiterJobs();
        }
      } catch (err) {
        toast.error('Failed to delete job posting');
      }
    }
  };

  const handleViewApplicants = async (job) => {
    setSelectedJobForApplicants(job);
    setApplicantsLoading(true);
    try {
      const res = await axiosInstance.get(`/applications/job/${job._id}`);
      if (res.data.success) {
        setApplicants(res.data.data);
      }
    } catch (err) {
      toast.error('Error loading applicants');
    } finally {
      setApplicantsLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await axiosInstance.put(`/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success(res.data.message);
        // Refresh local applicants list
        setApplicants(applicants.map(app => app._id === appId ? { ...app, status: newStatus } : app));
      }
    } catch (err) {
      toast.error('Failed to update candidate status');
    }
  };

  const totalApplicantsCount = jobs.reduce((acc, job) => acc + (job.applicantsCount || 0), 0); // fallback or managed dynamically

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Recruiter Dashboard</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your corporate postings, verify credentials, and update applicant pipelines.
          </p>
        </div>
        <button
          onClick={() => setShowPostModal(true)}
          className="flex items-center justify-center gap-1.5 px-5 py-3 text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 rounded-2xl transition-all shadow-md shadow-primary-500/20 active:scale-95 w-fit"
        >
          <PlusSquare size={18} />
          Post New Job
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-primary-50 dark:bg-primary-950/40 text-primary-500 rounded-2xl h-fit">
            <Briefcase size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Postings</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white">{jobs.length} Active</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-2xl h-fit">
            <Users size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Pipeline Candidates</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white">Active Management</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-2xl h-fit">
            <UserCheck size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Verified Recruiter</span>
            <span className="text-sm font-bold text-emerald-500 dark:text-emerald-400 block mt-1">Authorized Profile</span>
          </div>
        </div>
      </div>

      {/* Posted Jobs Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-850 dark:text-white">My Active Job Postings</h3>
        </div>

        {loading ? (
          <div className="p-6"><SkeletonLoader count={3} /></div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <p className="font-bold">You haven't posted any jobs yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/50 dark:border-slate-800/40 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Salary</th>
                  <th className="px-6 py-4 text-center">Applicants</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/65 text-sm">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/35 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{job.title}</td>
                    <td className="px-6 py-4 text-slate-500">{job.jobType}</td>
                    <td className="px-6 py-4 text-slate-500">{job.location}</td>
                    <td className="px-6 py-4 text-slate-500">{job.salary}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewApplicants(job)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 hover:bg-primary-100 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 text-xs font-bold rounded-lg transition-colors"
                      >
                        <Eye size={12} />
                        View
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="text-rose-500 hover:text-rose-600 p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
                        title="Delete Job"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Post Job Modal */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Post a New Job Opening</h3>
                <button onClick={() => setShowPostModal(false)} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
              </div>

              <form onSubmit={handlePostJob} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Job Title</label>
                    <input
                      type="text"
                      required
                      placeholder="Senior React Developer"
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Acme Corp"
                      value={jobForm.companyName}
                      onChange={(e) => setJobForm({ ...jobForm, companyName: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Company Logo Link (Optional)</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={jobForm.companyLogoUrl}
                      onChange={(e) => setJobForm({ ...jobForm, companyLogoUrl: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Salary Range</label>
                    <input
                      type="text"
                      required
                      placeholder="$80k - $100k"
                      value={jobForm.salary}
                      onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Location</label>
                    <input
                      type="text"
                      required
                      placeholder="London or Remote"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Job Type</label>
                    <select
                      value={jobForm.jobType}
                      onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm outline-none"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Experience Level</label>
                    <select
                      value={jobForm.experienceLevel}
                      onChange={(e) => setJobForm({ ...jobForm, experienceLevel: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm outline-none"
                    >
                      <option value="Entry">Entry Level</option>
                      <option value="Mid">Mid Level</option>
                      <option value="Senior">Senior Level</option>
                      <option value="Lead">Lead Level</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Skills Requirements (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="React, JavaScript, TailwindCSS"
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Job Description</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide full description of responsibilities and day-to-day work..."
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-sm font-bold text-white rounded-2xl shadow-md transition-colors mt-4"
                >
                  Publish Job Posting
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Applicant Drawer Slideover */}
      <AnimatePresence>
        {selectedJobForApplicants && (
          <div className="fixed inset-0 z-50 flex bg-slate-950/40 backdrop-blur-sm justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl h-full flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Applicants for:</h3>
                  <h4 className="text-sm font-semibold text-primary-500 mt-0.5">{selectedJobForApplicants.title}</h4>
                </div>
                <button onClick={() => setSelectedJobForApplicants(null)} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {applicantsLoading ? (
                  <SkeletonLoader count={2} />
                ) : applicants.length === 0 ? (
                  <div className="text-center py-20 text-slate-500">
                    <p className="font-bold">No candidates have applied to this job posting yet.</p>
                  </div>
                ) : (
                  applicants.map((app) => (
                    <div
                      key={app._id}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 p-5 rounded-2xl space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        {app.applicant.profilePhotoUrl ? (
                          <img
                            src={app.applicant.profilePhotoUrl}
                            alt={app.applicant.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                            {app.applicant.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-slate-850 dark:text-white">{app.applicant.name}</h4>
                          <p className="text-xs text-slate-400">{app.applicant.email}</p>
                        </div>
                      </div>

                      {app.applicant.title && (
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{app.applicant.title}</p>
                      )}

                      {app.applicant.bio && (
                        <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed italic">
                          "{app.applicant.bio}"
                        </p>
                      )}

                      {/* Skills array preview */}
                      {app.applicant.skills && app.applicant.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {app.applicant.skills.map((skill, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-200 dark:bg-slate-850 px-2 py-0.5 rounded text-slate-600 dark:text-slate-450 font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action controllers status update */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-250/50 dark:border-slate-800/80">
                        {app.resumeUrl ? (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-red-500 hover:underline"
                          >
                            <FileText size={14} />
                            Download Resume PDF
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No Resume Uploaded</span>
                        )}

                        <div className="flex items-center gap-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase">Status:</label>
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs px-2.5 py-1.5 rounded-lg font-bold text-slate-700 dark:text-slate-200 outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecruiterDashboard;
