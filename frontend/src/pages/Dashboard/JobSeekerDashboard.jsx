import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Bookmark, Sparkles, Clock, MapPin, DollarSign, CheckCircle } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import JobCard from '../../components/JobCard';
import SkeletonLoader from '../../components/SkeletonLoader';
import ApplicationTimeline from '../../components/ApplicationTimeline';

const JobSeekerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'applications';
  const [expandedAppId, setExpandedAppId] = useState(null);

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
                  <div className="grid grid-cols-1 gap-4 p-4">
                    {applications.map((app) => (
                      <div key={app._id} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 hover:border-primary-300 dark:hover:border-primary-500/50 transition-all">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                              {app.job ? (
                                <Link to={`/jobs/${app.job._id}`} className="hover:text-primary-500 hover:underline">
                                  {app.job.title}
                                </Link>
                              ) : (
                                <span className="text-slate-400 italic">[Job Deleted]</span>
                              )}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-3">
                              <span className="flex items-center gap-1"><MapPin size={14} />{app.job?.location || '—'}</span>
                              <span className="flex items-center gap-1"><DollarSign size={14} />{app.job?.salary || '—'}</span>
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            <span className={`inline-flex px-3 py-1.5 rounded-xl text-xs font-bold ${getStatusStyle(app.status)}`}>
                              {app.status}
                            </span>
                            <button
                              onClick={() => setExpandedAppId(expandedAppId === app._id ? null : app._id)}
                              className="text-sm font-semibold text-primary-500 hover:text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/40 px-4 py-2 rounded-xl transition-all"
                            >
                              {expandedAppId === app._id ? 'Hide Timeline' : 'View Timeline'}
                            </button>
                          </div>
                        </div>

                        {/* Expandable Timeline */}
                        <AnimatePresence>
                          {expandedAppId === app._id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden border-t border-slate-200 dark:border-slate-800 mt-4 pt-4"
                            >
                              <ApplicationTimeline timeline={app.timeline} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
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
