import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const skeletons = Array.from({ length: count });

  if (type === 'table') {
    return (
      <div className="animate-pulse space-y-4 w-full">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-full"></div>
        {skeletons.map((_, idx) => (
          <div key={idx} className="h-16 bg-slate-200 dark:bg-slate-800 rounded-lg w-full"></div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {skeletons.map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3 w-full">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                </div>
              </div>
            </div>
            <div className="space-y-2 py-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-16"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-20"></div>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="animate-pulse space-y-4 w-full">
      {skeletons.map((_, idx) => (
        <div key={idx} className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
