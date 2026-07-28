import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, FileText, Trash2, ShieldCheck, Mail, SlidersHorizontal } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import SkeletonLoader from '../../components/SkeletonLoader';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch analytics
      const analyticsRes = await axiosInstance.get('/admin/analytics');
      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.data);
      }

      // Fetch users
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const usersRes = await axiosInstance.get('/admin/users', { params });
      if (usersRes.data.success) {
        setUsers(usersRes.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load admin metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [search, roleFilter]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? All associated job posts or applications will be removed. This cannot be undone.')) {
      try {
        const res = await axiosInstance.delete(`/admin/users/${userId}`);
        if (res.data.success) {
          toast.success(res.data.message);
          fetchDashboardData();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      
      {/* Welcome header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Platform Administration</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review overall platform metrics and moderate system user directories.
        </p>
      </div>

      {/* Stats indicators */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-primary-50 dark:bg-primary-950/40 text-primary-500 rounded-xl">
              <Users size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Users</span>
              <span className="text-xl font-black text-slate-800 dark:text-white">{analytics.users?.total || 0}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-xl">
              <Briefcase size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Jobs</span>
              <span className="text-xl font-black text-slate-800 dark:text-white">{analytics.jobs?.active || 0}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Applications</span>
              <span className="text-xl font-black text-slate-800 dark:text-white">{analytics.applications?.total || 0}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-500 rounded-xl">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Admins</span>
              <span className="text-xl font-black text-slate-800 dark:text-white">{analytics.users?.admins || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">Moderate User Directory</h3>
          
          {/* Moderation search and filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl">
              <Mail size={14} className="text-slate-450" />
              <input
                type="text"
                placeholder="Search name/email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-0 outline-none text-xs text-slate-700 dark:text-slate-250 w-44"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-700 dark:text-slate-250 outline-none font-bold"
            >
              <option value="">All Roles</option>
              <option value="seeker">Seekers</option>
              <option value="recruiter">Recruiters</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-6"><SkeletonLoader count={3} type="table" /></div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="font-bold">No users match the search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/50 dark:border-slate-800/40 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {users.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{item.name}</td>
                    <td className="px-6 py-4 text-slate-550 dark:text-slate-400">{item.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded text-xs font-bold tracking-wide ${
                          item.role === 'admin'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
                            : item.role === 'recruiter'
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                        }`}
                      >
                        {item.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(item._id)}
                        className="text-rose-500 hover:text-rose-600 p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
                        title="Delete User"
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
    </div>
  );
};

export default AdminDashboard;
