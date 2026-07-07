import React from 'react';
import { motion } from 'motion/react';

const SummaryCard = ({ item, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-surface-container-lowest p-6 rounded-xl border border-surface-container-highest flex flex-col gap-3 relative overflow-hidden group hover:border-outline-variant transition-colors w-full h-full"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 ${item.bgClass} rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
      <div className="flex items-center justify-between">
        <span className="font-label-md text-label-md text-on-surface-variant">{item.label}</span>
        <span className={`material-symbols-outlined ${item.colorClass}`}>{item.icon}</span>
      </div>
      <div className="font-headline-xl text-headline-xl text-primary">{item.value}</div>
      <div className={`flex items-center gap-1 font-label-sm text-label-sm ${item.colorClass === 'text-primary' ? 'text-tertiary' : item.colorClass}`}>
        <span className="material-symbols-outlined text-[16px]">{item.trendIcon || 'trending_up'}</span>
        <span>{item.trend}</span>
      </div>
    </motion.div>
  );
};

export default SummaryCard;
