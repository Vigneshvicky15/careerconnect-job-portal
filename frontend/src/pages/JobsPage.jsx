import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import JobCard from '../components/JobCard';
import SkeletonLoader from '../components/SkeletonLoader';

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experienceLevel') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalJobs: 0,
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state with URL change
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setLocation(searchParams.get('location') || '');
    setJobType(searchParams.get('jobType') || '');
    setExperienceLevel(searchParams.get('experienceLevel') || '');
    setPage(parseInt(searchParams.get('page') || '1'));
  }, [searchParams]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const params = {};
        if (search) params.search = search;
        if (location) params.location = location;
        if (jobType) params.jobType = jobType;
        if (experienceLevel) params.experienceLevel = experienceLevel;
        params.page = page;
        params.limit = 6;

        const res = await axiosInstance.get('/jobs', { params });
        if (res.data.success) {
          setJobs(res.data.data);
          setPagination({
            totalPages: res.data.pagination.totalPages,
            totalJobs: res.data.pagination.totalJobs,
          });
        }
      } catch (error) {
        console.error('Failed to load jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams, page]); // Triggers when page or query parameters change

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    const params = {};
    if (search) params.search = search;
    if (location) params.location = location;
    if (jobType) params.jobType = jobType;
    if (experienceLevel) params.experienceLevel = experienceLevel;
    params.page = '1'; // Reset page to 1 on filter submit
    setSearchParams(params);
    setShowMobileFilters(false);
  };

  const handleClearFilters = () => {
    setSearch('');
    setLocation('');
    setJobType('');
    setExperienceLevel('');
    setPage(1);
    setSearchParams({});
    setShowMobileFilters(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      const currentParams = Object.fromEntries([...searchParams]);
      currentParams.page = newPage.toString();
      setSearchParams(currentParams);
      setPage(newPage);
    }
  };

  const FilterSidebar = () => (
    <div className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
          <SlidersHorizontal size={18} />
          Filter Jobs
        </h3>
        <button
          onClick={handleClearFilters}
          className="text-xs text-rose-500 hover:text-rose-600 font-bold transition-colors"
        >
          Clear All
        </button>
      </div>

      <form onSubmit={handleApplyFilters} className="space-y-5">
        {/* Title / Keywords Search */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Keywords
          </label>
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2.5 rounded-xl">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Design, Developer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-0 outline-none text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 w-full"
            />
          </div>
        </div>

        {/* Location Search */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Location
          </label>
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2.5 rounded-xl">
            <MapPin size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="London, Remote..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent border-0 outline-none text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 w-full"
            />
          </div>
        </div>

        {/* Job Type Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Job Type
          </label>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2.5 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        {/* Experience Level Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Experience Level
          </label>
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2.5 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="">All Experience Levels</option>
            <option value="Entry">Entry Level</option>
            <option value="Mid">Mid Level</option>
            <option value="Senior">Senior Level</option>
            <option value="Lead">Lead / Executive</option>
          </select>
        </div>

        {/* Apply Filters Button */}
        <button
          type="submit"
          className="w-full py-2.5 text-xs font-bold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors shadow-md shadow-primary-500/10"
        >
          Apply Filters
        </button>
      </form>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Available Positions</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Displaying {pagination.totalJobs} jobs matching your criteria
          </p>
        </div>
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="md:hidden flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar />
        </div>

        {/* Jobs Grid */}
        <div className="col-span-1 lg:col-span-3 flex flex-col justify-between min-h-[60vh]">
          {loading ? (
            <SkeletonLoader count={6} />
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center my-auto">
              <Briefcase size={48} className="text-slate-300 dark:text-slate-600 mb-4 animate-bounce" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Jobs Found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                We couldn't find any job postings matching your queries. Try altering filters or searching alternate keywords.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 px-4 py-2 text-xs font-bold text-white bg-primary-500 hover:bg-primary-600 rounded-xl"
              >
                Clear Search filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12 border-t border-slate-200/50 dark:border-slate-800/40 pt-6">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 border border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl transition-all disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pagination.totalPages}
                className="p-2 border border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl transition-all disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Slide-in filters */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/40 backdrop-blur-sm">
          <div className="relative ml-auto w-full max-w-sm h-full bg-white dark:bg-slate-900 p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={20} />
                </button>
              </div>
              <FilterSidebar />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
