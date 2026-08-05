import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const getStatusIcon = (status) => {
  switch (status) {
    case 'Pending':
    case 'Under Review':
      return <Clock size={20} className="text-blue-500" />;
    case 'Shortlisted':
    case 'Interviewing':
      return <AlertCircle size={20} className="text-purple-500" />;
    case 'Accepted':
      return <CheckCircle2 size={20} className="text-emerald-500" />;
    case 'Rejected':
      return <XCircle size={20} className="text-rose-500" />;
    default:
      return <Clock size={20} className="text-slate-500" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
    case 'Under Review':
      return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    case 'Shortlisted':
    case 'Interviewing':
      return 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800';
    case 'Accepted':
      return 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800';
    case 'Rejected':
      return 'bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800';
    default:
      return 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700';
  }
};

const ApplicationTimeline = ({ timeline }) => {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent pt-4 pb-4">
      {timeline.map((event, index) => (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          key={index}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
        >
          {/* Icon Marker */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-900 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-[-8px] md:left-1/2 z-10">
            {getStatusIcon(event.status)}
          </div>

          {/* Card */}
          <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border shadow-sm ${getStatusColor(event.status)}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-800 dark:text-slate-100">{event.status}</span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {new Date(event.date).toLocaleDateString()}
              </span>
            </div>
            {event.comment && (
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{event.comment}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ApplicationTimeline;
