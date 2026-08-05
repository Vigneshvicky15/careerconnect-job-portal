import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email address');

    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/forgot-password', { email });
      if (res.data.success) {
        toast.success(res.data.message);
        setSent(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-100/50 dark:shadow-none">
        
        <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to login
        </Link>

        <div className="space-y-2 mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Forgot Password</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {sent ? "Check your email for the reset code and proceed to reset your password." : "Enter your email address and we'll send you a 6-digit code to reset your password."}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 px-4 py-3 rounded-2xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                <Mail className="text-slate-400 shrink-0" size={18} />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-all shadow-md flex justify-center items-center disabled:opacity-70"
            >
              {loading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                'Send Reset Code'
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <Link
              to="/reset-password"
              state={{ email }}
              className="w-full block text-center py-3.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-2xl transition-all shadow-md"
            >
              I have the code, Reset Password
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
