import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, Palette, Laptop, BarChart, ArrowRight, ShieldCheck, Star, FileText, UserPlus, LogIn } from 'lucide-react';

const categories = [
  { name: 'Software Development', icon: Code, count: '140+ Jobs' },
  { name: 'Design & Creative', icon: Palette, count: '80+ Jobs' },
  { name: 'Product Management', icon: Laptop, count: '45+ Jobs' },
  { name: 'Marketing & Sales', icon: BarChart, count: '90+ Jobs' },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/70 via-white to-transparent dark:from-slate-900/40 dark:via-slate-950 dark:to-transparent py-20 lg:py-32 px-4">
        {/* Decorative background shapes */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-primary-400/20 dark:bg-primary-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/10 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-6xl mx-auto text-center space-y-10">
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
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            Find Your Dream Job <br />
            <span className="text-gradient">With CareerConnect</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Join an exclusive community of professionals. Discover thousands of job opportunities from top-tier recruiters and land your next role effortlessly.
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-all shadow-xl shadow-primary-500/20 hover:-translate-y-1"
            >
              <UserPlus size={18} />
              Register Now
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-xl transition-all shadow-sm hover:-translate-y-1"
            >
              <LogIn size={18} />
              Login to Account
            </button>
          </motion.div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Popular Categories</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm">
            Browse through various active roles grouped by popular developer and product categories. Log in to apply!
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
                onClick={() => navigate('/register')}
              >
                <div className="p-3 bg-primary-50 dark:bg-primary-950/40 rounded-xl text-primary-500 w-fit group-hover:bg-primary-500 group-hover:text-white transition-all">
                  <IconComponent size={24} />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-4">{cat.name}</h3>
                <p className="text-slate-400 text-xs mt-1">{cat.count}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Register to view <ArrowRight size={12} />
                </div>
              </motion.div>
            );
          })}
        </div>
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
