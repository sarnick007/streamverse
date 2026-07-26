import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play } from 'lucide-react';

const VideoCard = ({ video, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      id={`video-card-${video.id}`}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      onClick={() => onClick(video)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer rounded-2xl overflow-hidden bg-slate-900/40 border border-slate-800/30 hover:border-indigo-500/30 transition-all duration-300 card-shine relative"
      role="article"
      aria-label={`Video: ${video.title} by ${video.channelName}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(video);
        }
      }}
    >
      {/* Thumbnail container */}
      <div className="relative overflow-hidden aspect-video player-aspect">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-slate-800 animate-pulse" />
        )}
        <img
          src={video.thumbnail}
          alt={`${video.title} thumbnail`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-md">
          {video.duration}
        </div>
        
        {/* Play overlay on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-600/90 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white pl-1">
                <Play className="w-6 h-6 fill-current" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Info area */}
      <div className="p-3.5 flex gap-3">
        <div 
          className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-base"
          aria-hidden="true"
        >
          {video.channelAvatarEmoji}
        </div>
        
        <div className="flex flex-col min-w-0">
          <h3 className="text-sm font-semibold text-slate-100 line-clamp-2 leading-snug mb-1 group-hover:text-indigo-400 transition-colors">
            {video.title}
          </h3>
          <div className="text-xs text-slate-400 font-medium mb-0.5 truncate">
            {video.channelName}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>{video.views} views</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>{video.uploadedAt}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(VideoCard);
