import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Clock, Bookmark, Briefcase } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

const JobCard = ({ job, isSaved: initialIsSaved, onSaveToggle }) => {
  const { user } = useContext(AuthContext);
  const [isSaved, setIsSaved] = useState(initialIsSaved || (user && user.savedJobs?.includes(job._id)));
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please log in as a Job Seeker to bookmark this job.');
      return;
    }

    if (user.role !== 'seeker') {
      toast.error('Only Job Seekers can bookmark jobs.');
      return;
    }

    try {
      setSaving(true);
      const res = await axiosInstance.post(`/jobs/${job._id}/save`);
      if (res.data.success) {
        setIsSaved(res.data.isSaved);
        toast.success(res.data.message);
        if (onSaveToggle) {
          onSaveToggle(job._id, res.data.isSaved);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating bookmark');
    } finally {
      setSaving(false);
    }
  };

  const getJobTypeColor = (type) => {
    switch (type) {
      case 'Full-time': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400';
      case 'Part-time': return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400';
      case 'Contract': return 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400';
      case 'Internship': return 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary-400/50 dark:hover:border-primary-500/40 transition-all group flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            {job.companyLogoUrl ? (
              <img
                src={job.companyLogoUrl}
                alt={job.companyName}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold">
                <Briefcase size={20} />
              </div>
            )}
            <div>
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400">{job.companyName}</h4>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors mt-0.5">
                <Link to={`/jobs/${job._id}`}>{job.title}</Link>
              </h3>
            </div>
          </div>

          {user?.role === 'seeker' && (
            <button
              onClick={handleSave}
              disabled={saving}
              className={`p-2 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-primary-50 border-primary-200 text-primary-500 dark:bg-primary-950/40 dark:border-primary-900/60 dark:text-primary-400'
                  : 'bg-transparent border-slate-200 text-slate-400 hover:text-slate-600 dark:border-slate-800 dark:text-slate-500 dark:hover:text-slate-300'
              }`}
              title={isSaved ? 'Bookmarked' : 'Bookmark Job'}
            >
              <Bookmark size={16} className={isSaved ? 'fill-current' : ''} />
            </button>
          )}
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap gap-2.5 my-4">
          <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold tracking-wide ${getJobTypeColor(job.jobType)}`}>
            {job.jobType}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-850 px-2.5 py-1 rounded-lg">
            <MapPin size={12} />
            {job.location}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-850 px-2.5 py-1 rounded-lg">
            <DollarSign size={12} />
            {job.salary}
          </span>
        </div>

        {/* Requirements preview */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.requirements.slice(0, 3).map((req, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
              >
                {req}
              </span>
            ))}
            {job.requirements.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 text-slate-400 font-medium">
                +{job.requirements.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-auto">
        <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
          <Clock size={12} />
          {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <Link
          to={`/jobs/${job._id}`}
          className="text-xs font-bold text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-0.5"
        >
          View Details &rarr;
        </Link>
      </div>
    </motion.div>
  );
};

export default JobCard;
