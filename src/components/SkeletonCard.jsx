import React from 'react';
import { motion } from 'motion/react';

const SkeletonCard = () => {
  return (
    <div id="skeleton-card" className="rounded-2xl overflow-hidden bg-slate-900/40 border border-slate-800/30">
      <div className="aspect-video bg-slate-800 skeleton-shimmer" />
      <div className="p-3.5 flex gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-800 shrink-0" />
        <div className="flex-1">
          <div className="h-3 w-3/4 rounded bg-slate-800 mb-2" />
          <div className="h-3 w-1/2 rounded bg-slate-800" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid = () => {
  const items = Array.from({ length: 8 });
  return (
    <div id="skeleton-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {items.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <SkeletonCard />
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonCard;
