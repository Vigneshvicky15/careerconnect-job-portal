import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';
import { Lock, Hash, ArrowLeft } from 'lucide-react';

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = location.state?.email || '';

  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !token || !newPassword) return toast.error('Please fill in all fields');
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/reset-password', { email, token, newPassword });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-100/50 dark:shadow-none">
        
        <Link to="/forgot-password" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back
        </Link>

        <div className="space-y-2 mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Set New Password</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter the 6-digit code we sent you and create a new secure password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!initialEmail && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-sm outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reset Code (OTP)</label>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 px-4 py-3 rounded-2xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
              <Hash className="text-slate-400 shrink-0" size={18} />
              <input
                type="text"
                required
                maxLength="6"
                placeholder="000000"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-transparent border-0 outline-none text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 tracking-widest font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">New Password</label>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 px-4 py-3 rounded-2xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
              <Lock className="text-slate-400 shrink-0" size={18} />
              <input
                type="password"
                required
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-all shadow-md flex justify-center items-center disabled:opacity-70"
          >
            {loading ? (
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
