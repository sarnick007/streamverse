import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import VideoCard from './VideoCard';
import { SkeletonGrid } from './SkeletonCard';

const VideoGrid = ({ videos, onVideoClick, isLoading }) => {
  if (isLoading) {
    return <SkeletonGrid />;
  }

  return (
    <motion.div 
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-8"
      role="feed"
      aria-busy={isLoading}
      aria-label="Video grid"
    >
      <AnimatePresence mode="popLayout">
        {videos.map((video) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            onClick={onVideoClick} 
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default VideoGrid;
