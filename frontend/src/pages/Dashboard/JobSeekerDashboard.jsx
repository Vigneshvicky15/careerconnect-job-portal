import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Bookmark, Sparkles, Clock, MapPin, DollarSign, CheckCircle } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import JobCard from '../../components/JobCard';
import SkeletonLoader from '../../components/SkeletonLoader';

const JobSeekerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'applications';

  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch seeker applications
      const appsRes = await axiosInstance.get('/applications/seeker/my-applications');
      if (appsRes.data.success) {
        setApplications(appsRes.data.data);
      }

      // Fetch user profile again to get fresh list of saved jobs
      const profileRes = await axiosInstance.get('/auth/profile');
      if (profileRes.data.success) {
        setSavedJobs(profileRes.data.data.savedJobs || []);
      }

      // Fetch recommended jobs
      const recRes = await axiosInstance.get('/jobs/recommended');
      if (recRes.data.success) {
        setRecommendedJobs(recRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load seeker dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const handleSavedToggle = () => {
    fetchData();
  };

  // Status badge styling helper
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400';
      case 'Interviewing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400';
      case 'Accepted':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      
      {/* Welcome header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Hello, {user?.name || 'Candidate'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review your active application statuses and discover tailored roles below.
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-primary-50 dark:bg-primary-950/40 text-primary-500 rounded-2xl h-fit">
            <FileText size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Submitted</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white">{applications.length} Apps</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-2xl h-fit">
            <CheckCircle size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Interviews / Offers</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white">
              {applications.filter(app => ['Interviewing', 'Accepted'].includes(app.status)).length} Active
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-2xl h-fit">
            <Bookmark size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Bookmarked</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white">{savedJobs.length} Jobs</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200/50 dark:border-slate-800/40">
        <button
          onClick={() => handleTabChange('applications')}
          className={`flex items-center gap-1.5 px-6 py-3 font-semibold text-sm border-b-2 transition-all ${
            activeTab === 'applications'
              ? 'border-primary-500 text-primary-500'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <FileText size={16} />
          My Applications ({applications.length})
        </button>
        <button
          onClick={() => handleTabChange('saved')}
          className={`flex items-center gap-1.5 px-6 py-3 font-semibold text-sm border-b-2 transition-all ${
            activeTab === 'saved'
              ? 'border-primary-500 text-primary-500'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Bookmark size={16} />
          Bookmarked ({savedJobs.length})
        </button>
        <button
          onClick={() => handleTabChange('recommended')}
          className={`flex items-center gap-1.5 px-6 py-3 font-semibold text-sm border-b-2 transition-all ${
            activeTab === 'recommended'
              ? 'border-primary-500 text-primary-500'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Sparkles size={16} />
          Recommended ({recommendedJobs.length})
        </button>
      </div>

      {/* Tab Contents */}
      <div className="min-h-[40vh]">
        {loading ? (
          <SkeletonLoader count={3} />
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'applications' && (
              <motion.div
                key="apps"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm"
              >
                {applications.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                    <p className="font-bold">No applications submitted yet.</p>
                    <Link to="/jobs" className="text-primary-500 hover:underline mt-2 inline-block text-sm">
                      Browse and apply for jobs now &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/50 dark:border-slate-800/40 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          <th className="px-6 py-4">Job Title</th>
                          <th className="px-6 py-4">Company</th>
                          <th className="px-6 py-4">Location</th>
                          <th className="px-6 py-4">Salary</th>
                          <th className="px-6 py-4">Applied Date</th>
                          <th className="px-6 py-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                        {applications.map((app) => (
                          <tr key={app._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                              {app.job ? (
                                <Link to={`/jobs/${app.job._id}`} className="hover:text-primary-500 hover:underline">
                                  {app.job.title}
                                </Link>
                              ) : (
                                <span className="text-slate-400 italic font-medium">[Job Deleted]</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-350">{app.job?.companyName || '—'}</td>
                            <td className="px-6 py-4 text-slate-500"><span className="flex items-center gap-1"><MapPin size={14} />{app.job?.location || '—'}</span></td>
                            <td className="px-6 py-4 text-slate-500"><span className="flex items-center gap-1"><DollarSign size={14} />{app.job?.salary || '—'}</span></td>
                            <td className="px-6 py-4 text-slate-500">
                              <span className="flex items-center gap-1 text-xs">
                                <Clock size={12} />
                                {new Date(app.createdAt).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(app.status)}`}>
                                {app.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'saved' && (
              <motion.div
                key="saved"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {savedJobs.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-12 text-center rounded-3xl text-slate-500">
                    <p className="font-bold">No bookmarked jobs.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedJobs.map((job) => (
                      <JobCard key={job._id} job={job} isSaved={true} onSaveToggle={handleSavedToggle} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'recommended' && (
              <motion.div
                key="rec"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {recommendedJobs.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-12 text-center rounded-3xl text-slate-500">
                    <p className="font-bold">No custom recommendations. Add skills in your profile to trigger suggestions!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedJobs.map((job) => (
                      <JobCard key={job._id} job={job} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
