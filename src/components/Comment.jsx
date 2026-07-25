import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { formatNumber } from '../utils/helpers';

const Comment = React.memo(({ comment, index }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  return (
    <motion.div
      id={`comment-${comment?.id || index}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex gap-4 p-4 bg-slate-800/50 rounded-xl"
    >
      <div className="w-10 h-10 rounded-full bg-slate-700 shrink-0 flex items-center justify-center text-xl">
        {comment?.avatar || '👤'}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-slate-200 text-sm">{comment?.author || 'User'}</span>
          <span className="text-xs text-slate-400">{comment?.time || 'Just now'}</span>
        </div>
        <p className="text-slate-300 text-sm mb-3">
          {comment?.text}
        </p>
        <div className="flex items-center gap-4">
          <motion.button
            id={`comment-${comment?.id || index}-like-btn`}
            whileTap={{ scale: 0.8 }}
            onClick={handleLike}
            aria-label="Like comment"
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              isLiked ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            {formatNumber((comment?.likes || 0) + (isLiked ? 1 : 0))}
          </motion.button>
          
          <motion.button
            id={`comment-${comment?.id || index}-dislike-btn`}
            whileTap={{ scale: 0.8 }}
            onClick={handleDislike}
            aria-label="Dislike comment"
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              isDisliked ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <ThumbsDown className={`w-3.5 h-3.5 ${isDisliked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

export default Comment;
