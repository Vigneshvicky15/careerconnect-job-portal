import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, Star } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { user, login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(`/dashboard/${user.role}`);
    }
    if (searchParams.get('expired')) {
      toast.error('Session expired. Please log in again.');
    }
  }, [user, navigate, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please enter all fields');
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result && result.success) {
      navigate(`/dashboard/${result.user.role}`);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-400/10 dark:bg-primary-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-100/50 dark:shadow-none"
      >
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your CareerConnect account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 px-4 py-3 rounded-2xl focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/10 transition-all">
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

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-bold text-primary-500 hover:text-primary-600 dark:text-primary-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 px-4 py-3 rounded-2xl focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/10 transition-all">
              <Lock className="text-slate-400 shrink-0" size={18} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 rounded-2xl transition-all shadow-md shadow-primary-500/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-bold hover:underline inline-flex items-center gap-0.5"
            >
              Sign up <ArrowRight size={14} />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
