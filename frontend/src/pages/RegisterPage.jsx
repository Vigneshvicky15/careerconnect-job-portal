import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Lock, UserPlus, ArrowRight, Briefcase, UserCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { user, register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('seeker'); // default to 'seeker'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(`/dashboard/${user.role}`);
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error('Please fill in all fields');
    }

    setLoading(true);
    const result = await register(name, email, password, role);
    setLoading(false);

    if (result && result.success) {
      navigate(`/dashboard/${result.user.role}`);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-400/10 dark:bg-primary-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-100/50 dark:shadow-none"
      >
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Join CareerConnect and scale your career or recruitment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role selection toggle */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              I want to join as a:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setRole('seeker')}
                className={`flex flex-col items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                  role === 'seeker'
                    ? 'border-primary-500 bg-primary-50/40 text-primary-600 dark:border-primary-500 dark:bg-primary-950/20 dark:text-primary-400 font-bold ring-2 ring-primary-500/10'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-850'
                }`}
              >
                <UserCheck size={24} className="mb-2" />
                <span className="text-sm">Job Seeker</span>
              </div>
              <div
                onClick={() => setRole('recruiter')}
                className={`flex flex-col items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                  role === 'recruiter'
                    ? 'border-primary-500 bg-primary-50/40 text-primary-600 dark:border-primary-500 dark:bg-primary-950/20 dark:text-primary-400 font-bold ring-2 ring-primary-500/10'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-850'
                }`}
              >
                <Briefcase size={24} className="mb-2" />
                <span className="text-sm">Recruiter</span>
              </div>
            </div>
          </div>

          {/* Full Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Full Name
            </label>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 px-4 py-3 rounded-2xl focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/10 transition-all">
              <UserIcon className="text-slate-400 shrink-0" size={18} />
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
              />
            </div>
          </div>

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
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 px-4 py-3 rounded-2xl focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/10 transition-all">
              <Lock className="text-slate-400 shrink-0" size={18} />
              <input
                type="password"
                required
                placeholder="Min 6 characters"
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
            className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 rounded-2xl transition-all shadow-md shadow-primary-500/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <UserPlus size={16} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-bold hover:underline inline-flex items-center gap-0.5"
            >
              Sign in <ArrowRight size={14} />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
