import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, DollarSign, Clock, Briefcase, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import SkeletonLoader from '../components/SkeletonLoader';
import toast from 'react-hot-toast';

const JobDetailsPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/jobs/${id}`);
        if (res.data.success) {
          setJob(res.data.data);
        }

        // Check if user is seeker and has already applied
        if (user && user.role === 'seeker') {
          const appsRes = await axiosInstance.get('/applications/seeker/my-applications');
          if (appsRes.data.success) {
            const applied = appsRes.data.data.some((app) => app.job?._id === id);
            setHasApplied(applied);
          }
        }
      } catch (err) {
        console.error('Failed to load job details:', err);
        toast.error('Error loading job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) {
      toast.error('Please log in to apply.');
      navigate('/login');
      return;
    }

    if (user.role !== 'seeker') {
      toast.error('Only Job Seekers can apply for jobs.');
      return;
    }

    if (!user.resumeUrl) {
      toast.error('Please upload a resume in your profile before applying.');
      navigate('/profile');
      return;
    }

    try {
      setApplying(true);
      const res = await axiosInstance.post(`/applications/apply/${id}`);
      if (res.data.success) {
        setHasApplied(true);
        toast.success('Application submitted successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <SkeletonLoader count={2} />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Job Posting Not Found</h3>
        <p className="text-slate-500 mt-2">This job posting might have been deleted or expired.</p>
        <Link to="/jobs" className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-primary-500 hover:underline">
          <ArrowLeft size={16} /> Back to Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Job Description and requirements */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {job.companyLogoUrl ? (
                  <img
                    src={job.companyLogoUrl}
                    alt={job.companyName}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-800"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold text-xl">
                    <Briefcase size={28} />
                  </div>
                )}
                <div>
                  <h3 className="text-base font-semibold text-slate-500 dark:text-slate-400">{job.companyName}</h3>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{job.title}</h2>
                </div>
              </div>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <span className="text-xs px-3 py-1.5 font-semibold bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400 rounded-xl">
                {job.jobType}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                <MapPin size={14} />
                {job.location}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                <DollarSign size={14} />
                {job.salary}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Job Description
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 rounded-3xl space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                Requirements & Skills
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-350">
                    <span className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Apply summary card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white">Job Summary</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <span className="text-slate-400 font-medium">Job Type</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{job.jobType}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <span className="text-slate-400 font-medium">Location</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{job.location}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <span className="text-slate-400 font-medium">Salary Range</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{job.salary}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <span className="text-slate-400 font-medium">Experience Level</span>
                <span className="font-bold text-slate-700 dark:text-slate-200 capitalize">{job.experienceLevel}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <span className="text-slate-400 font-medium">Published On</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Apply Action Trigger */}
            {user?.role === 'recruiter' || user?.role === 'admin' ? (
              <div className="text-xs text-amber-500 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-center font-semibold">
                You are logged in as a {user.role}. Recruiters and Admins cannot submit job applications.
              </div>
            ) : hasApplied ? (
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm font-bold rounded-2xl cursor-not-allowed"
              >
                <CheckCircle size={16} />
                Application Submitted
              </button>
            ) : (
              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full py-3.5 text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 rounded-2xl transition-all shadow-md shadow-primary-500/25 active:scale-98 disabled:opacity-60 flex justify-center items-center gap-1.5"
              >
                {applying ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FileText size={16} />
                    Apply For Job
                  </>
                )}
              </button>
            )}
          </div>

          {/* Recruiter Details Card */}
          {job.recruiter && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl text-center space-y-4">
              <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider text-left">About the Recruiter</h3>
              <div className="flex items-center gap-3">
                {job.recruiter.profilePhotoUrl ? (
                  <img
                    src={job.recruiter.profilePhotoUrl}
                    alt={job.recruiter.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                    {job.recruiter.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{job.recruiter.name}</h4>
                  <p className="text-xs text-slate-400">{job.recruiter.email}</p>
                </div>
              </div>
              {job.recruiter.bio && (
                <p className="text-xs text-slate-500 dark:text-slate-450 italic text-left leading-relaxed">
                  "{job.recruiter.bio}"
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
