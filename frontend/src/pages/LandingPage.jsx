import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Code, Palette, Laptop, BarChart, FileText, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import JobCard from '../components/JobCard';
import SkeletonLoader from '../components/SkeletonLoader';

const categories = [
  { name: 'Software Development', icon: Code, count: '140+ Jobs', query: 'developer' },
  { name: 'Design & Creative', icon: Palette, count: '80+ Jobs', query: 'designer' },
  { name: 'Product Management', icon: Laptop, count: '45+ Jobs', query: 'product' },
  { name: 'Marketing & Sales', icon: BarChart, count: '90+ Jobs', query: 'marketing' },
];

const LandingPage = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const res = await axiosInstance.get('/jobs?limit=3');
        if (res.data.success) {
          setJobs(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load recent jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/70 via-white to-transparent dark:from-slate-900/40 dark:via-slate-950 dark:to-transparent py-20 lg:py-28 px-4">
        {/* Decorative background shapes */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-primary-400/20 dark:bg-primary-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/10 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-6xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100/60 dark:bg-primary-950/45 text-primary-700 dark:text-primary-400 text-xs font-semibold tracking-wide"
          >
            <Star size={12} className="fill-current" />
            Empowering Careers Worldwide
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]"
          >
            Find Your Dream Job <br />
            <span className="text-gradient">With CareerConnect</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto"
          >
            Discover thousands of job opportunities from top-tier recruiters, manage your professional application pipelines, and land your next role effortlessly.
          </motion.p>

          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto bg-white dark:bg-slate-900 shadow-xl shadow-slate-100/70 dark:shadow-none border border-slate-200/80 dark:border-slate-800 p-2 rounded-2xl flex flex-col md:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-2 flex-1 w-full px-3 py-2 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
              <Search className="text-slate-400 shrink-0" size={20} />
              <input
                type="text"
                placeholder="Job title, keywords, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-slate-800 dark:text-slate-200 text-sm placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2 flex-1 w-full px-3 py-2">
              <MapPin className="text-slate-400 shrink-0" size={20} />
              <input
                type="text"
                placeholder="City, state, or remote..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-slate-800 dark:text-slate-200 text-sm placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-all shadow-md shadow-primary-500/20 active:scale-95"
            >
              Search
            </button>
          </motion.form>
        </div>
      </section>

      {/* Top Categories */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Popular Categories</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm">
            Browse through various active roles grouped by popular developer and product categories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                onClick={() => navigate(`/jobs?search=${cat.query}`)}
              >
                <div className="p-3 bg-primary-50 dark:bg-primary-950/40 rounded-xl text-primary-500 w-fit group-hover:bg-primary-500 group-hover:text-white transition-all">
                  <IconComponent size={24} />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-4">{cat.name}</h3>
                <p className="text-slate-400 text-xs mt-1">{cat.count}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Recent Job Postings</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Discover the latest opportunities published by verified recruiters.
            </p>
          </div>
          <Link
            to="/jobs"
            className="flex items-center gap-1 text-sm font-bold text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            Browse All Jobs
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <SkeletonLoader count={3} />
        ) : jobs.length === 0 ? (
          <div className="text-center py-10 bg-slate-100 dark:bg-slate-900 rounded-2xl p-8">
            <p className="text-slate-500 dark:text-slate-400">No jobs posted yet. Be the first to post a job!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Trust & Stats */}
      <section className="bg-slate-100 dark:bg-slate-900/60 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-950/40 rounded-full text-primary-500 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Verified Companies</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Our partners are hand-screened to ensure absolute application transparency.
            </p>
          </div>
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-950/40 rounded-full text-indigo-500 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Seamless Application</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              One-click application pipeline matching resumes instantly with recruiting requirements.
            </p>
          </div>
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 rounded-full text-emerald-500 flex items-center justify-center">
              <Star size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Modern SaaS Dashboard</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Track your application statuses, review analytics cards, and update status in real-time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
