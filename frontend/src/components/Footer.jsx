import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Github, Linkedin, Twitter, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white">
              <div className="p-1.5 bg-gradient-to-tr from-primary-500 to-indigo-600 rounded-xl text-white">
                <Briefcase size={18} />
              </div>
              <span>Career<span className="text-primary-500">Connect</span></span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Connect with top companies, recruit exceptional candidates, and accelerate your professional journey with our advanced MERN job portal.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 rounded-full transition-colors text-slate-600 dark:text-slate-400 shadow-sm" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
              <a href="#" className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 rounded-full transition-colors text-slate-600 dark:text-slate-400 shadow-sm" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a href="#" className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 rounded-full transition-colors text-slate-600 dark:text-slate-400 shadow-sm" aria-label="GitHub">
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/jobs" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} CareerConnect. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            Built with <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" /> for recruiters and hiring managers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
