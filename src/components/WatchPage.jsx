import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  ThumbsUp, ThumbsDown, Share2, Bookmark, MessageSquare,
  ChevronDown, ChevronUp, Play, SkipForward, SkipBack,
  Volume2, Maximize, Sparkles, Film, TrendingUp, Send,
  ArrowLeft
} from 'lucide-react';
import Comment from './Comment';
import ShareModal from './ShareModal';
import { formatNumber } from '../utils/helpers';

export default function WatchPage({
  video,
  onBack,
  allVideos,
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave,
  addToast
}) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [ambientMode, setAmbientMode] = useState(true);
  const [cinemaMode, setCinemaMode] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [descExpanded, setDescExpanded] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Reset state when video changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setComments(video.comments || []);
    setIsSubscribed(false);
    setIsDisliked(false);
    setDescExpanded(false);
    setIsPlaying(false);
    setLikeCount(parseInt(video.id.replace('v', '')) * 2400 + 1200);
  }, [video.id, video.comments]);

  const handleSubscribe = () => {
    if (!isSubscribed) {
      const duration = 800;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#6366f1', '#8b5cf6', '#ec4899']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#6366f1', '#8b5cf6', '#ec4899']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
      
      addToast({ message: `Subscribed to ${video.channel}!`, type: 'success' });
    }
    setIsSubscribed(!isSubscribed);
  };

  const handleLikeClick = () => {
    if (isLiked) {
      onToggleLike(video.id);
      setLikeCount(prev => prev - 1);
    } else {
      onToggleLike(video.id);
      setLikeCount(prev => prev + 1);
      if (isDisliked) {
        setIsDisliked(false);
      }
    }
  };

  const handleDislikeClick = () => {
    if (isDisliked) {
      setIsDisliked(false);
    } else {
      setIsDisliked(true);
      if (isLiked) {
        onToggleLike(video.id);
        setLikeCount(prev => prev - 1);
      }
    }
  };

  const handleSaveClick = () => {
    onToggleSave(video.id);
    if (!isSaved) {
      addToast({ message: 'Added to Watch Later', type: 'success' });
    } else {
      addToast({ message: 'Removed from Watch Later', type: 'info' });
    }
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj = {
      id: `c_${Date.now()}`,
      user: 'You',
      avatar: '😎',
      text: newComment,
      time: 'Just now',
      likes: 0
    };

    setComments([commentObj, ...comments]);
    setNewComment('');
    addToast({ message: 'Comment posted', type: 'success' });
  };

  const relatedVideos = allVideos
    .filter(v => v.id !== video.id)
    .slice(0, 8);

  const renderAmbientLight = () => {
    if (!ambientMode || !video.ambientColors) return null;
    
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute -inset-20 -z-10 rounded-3xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${video.ambientColors[0]}40 0%, ${video.ambientColors[1]}20 40%, ${video.ambientColors[2]}00 70%)`,
            filter: 'blur(80px)'
          }}
        />
      </AnimatePresence>
    );
  };

  return (
    <div className={`min-h-screen pt-20 pb-10 px-4 md:px-8 xl:px-12 transition-colors duration-500 relative ${cinemaMode ? 'z-10' : ''}`}>
      {cinemaMode && (
        <div className="fixed inset-0 bg-black/90 z-0 pointer-events-none transition-opacity duration-700" />
      )}
      
      <div className="max-w-screen-2xl mx-auto flex flex-col xl:flex-row gap-8 relative z-10">
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <button 
            onClick={() => onBack()}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors group"
            aria-label="Back to browse"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Browse</span>
          </button>

          {/* Video Player */}
          <div className="relative mb-6">
            {renderAmbientLight()}
            
            <div className="rounded-2xl overflow-hidden bg-slate-900 shadow-2xl relative group aspect-video">
              {isPlaying ? (
                <>
                  <iframe 
                    className="w-full h-full object-cover outline-none bg-black"
                    src={`https://www.youtube.com/embed/${video.youtubeId || 'aqz-KE-bpKQ'}?autoplay=1&mute=0`}
                    title="Video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  {/* Floating Action Buttons for ambient and cinema mode */}
                  <div className="absolute top-4 right-4 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => setAmbientMode(!ambientMode)}
                      className={`p-2 rounded-full backdrop-blur-md transition-colors ${ambientMode ? 'bg-indigo-500/80 text-white' : 'bg-black/40 text-slate-300 hover:bg-black/60'}`}
                      aria-label="Toggle ambient mode"
                      title="Ambient Mode"
                    >
                      <Sparkles size={18} />
                    </button>
                    <button 
                      onClick={() => setCinemaMode(!cinemaMode)}
                      className={`p-2 rounded-full backdrop-blur-md transition-colors ${cinemaMode ? 'bg-indigo-500/80 text-white' : 'bg-black/40 text-slate-300 hover:bg-black/60'}`}
                      aria-label="Toggle cinema mode"
                      title="Cinema Mode"
                    >
                      <Film size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setIsPlaying(true)}
                  />
                  
                  {/* Player Overlay Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
                    <div className="flex justify-end gap-3 pointer-events-auto">
                      <button 
                        onClick={() => setAmbientMode(!ambientMode)}
                        className={`p-2 rounded-full backdrop-blur-md transition-colors ${ambientMode ? 'bg-indigo-500/80 text-white' : 'bg-black/40 text-slate-300 hover:bg-black/60'}`}
                        aria-label="Toggle ambient mode"
                        title="Ambient Mode"
                      >
                        <Sparkles size={18} />
                      </button>
                      <button 
                        onClick={() => setCinemaMode(!cinemaMode)}
                        className={`p-2 rounded-full backdrop-blur-md transition-colors ${cinemaMode ? 'bg-indigo-500/80 text-white' : 'bg-black/40 text-slate-300 hover:bg-black/60'}`}
                        aria-label="Toggle cinema mode"
                        title="Cinema Mode"
                      >
                        <Film size={18} />
                      </button>
                    </div>

                    <button 
                      onClick={() => setIsPlaying(true)}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-indigo-500/80 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110 pointer-events-auto"
                      aria-label="Play video"
                    >
                      <Play size={28} className="ml-1" fill="currentColor" />
                    </button>

                    <div className="pointer-events-auto">
                      <div className="w-full h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer group/progress relative" onClick={() => setIsPlaying(true)}>
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 h-full w-[35%] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
                        <div className="absolute top-1/2 -translate-y-1/2 left-[35%] w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity transform -translate-x-1/2 shadow-lg" />
                      </div>
                      
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-4">
                          <button aria-label="Play/Pause" className="hover:text-indigo-400 transition-colors" onClick={() => setIsPlaying(true)}>
                            <Play size={20} fill="currentColor" />
                          </button>
                          <button aria-label="Skip forward" className="hover:text-indigo-400 transition-colors"><SkipForward size={20} fill="currentColor" /></button>
                          <div className="flex items-center gap-2 group/volume">
                            <button aria-label="Mute" className="hover:text-indigo-400 transition-colors"><Volume2 size={20} /></button>
                            <div className="w-0 group-hover/volume:w-16 overflow-hidden transition-all duration-300 ease-out">
                              <div className="w-16 h-1 bg-white/30 rounded-full mt-2.5">
                                <div className="w-2/3 h-full bg-white rounded-full" />
                              </div>
                            </div>
                          </div>
                          <span className="text-sm font-medium ml-2">4:20 / {video.duration || '12:35'}</span>
                        </div>
                        <button aria-label="Fullscreen" className="hover:text-indigo-400 transition-colors"><Maximize size={20} /></button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Video Info & Actions */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-4 line-clamp-2">{video.title}</h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-2xl overflow-hidden shrink-0">
                  {video.channelAvatar}
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 hover:text-indigo-400 cursor-pointer transition-colors">{video.channel}</h3>
                  <p className="text-sm text-slate-400">1.2M subscribers</p>
                </div>
                
                <button
                  onClick={handleSubscribe}
                  className={`ml-4 px-5 py-2 rounded-full font-medium transition-all relative overflow-hidden ${
                    isSubscribed 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-white text-slate-900 hover:bg-slate-200'
                  }`}
                  aria-label={isSubscribed ? "Unsubscribe" : "Subscribe"}
                >
                  {isSubscribed && (
                    <div className="absolute inset-0 rounded-full subscribe-gradient-border opacity-50 pointer-events-none" />
                  )}
                  <span className="relative z-10">{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                </button>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                <div className="flex items-center bg-slate-800/60 rounded-full">
                  <button 
                    onClick={handleLikeClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-l-full hover:bg-slate-700/80 transition-colors ${isLiked ? 'text-indigo-400' : 'text-slate-300'}`}
                    aria-label="Like video"
                  >
                    <ThumbsUp size={18} className={isLiked ? 'fill-current' : ''} />
                    <span className="font-medium text-sm">{formatNumber(likeCount)}</span>
                  </button>
                  <div className="w-px h-6 bg-slate-600" />
                  <button 
                    onClick={handleDislikeClick}
                    className={`px-4 py-2 rounded-r-full hover:bg-slate-700/80 transition-colors ${isDisliked ? 'text-indigo-400' : 'text-slate-300'}`}
                    aria-label="Dislike video"
                  >
                    <ThumbsDown size={18} className={isDisliked ? 'fill-current' : ''} />
                  </button>
                </div>

                <button 
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 rounded-full hover:bg-slate-700/80 text-slate-300 transition-colors shrink-0"
                  aria-label="Share video"
                >
                  <Share2 size={18} />
                  <span className="font-medium text-sm hidden sm:inline">Share</span>
                </button>

                <button 
                  onClick={handleSaveClick}
                  className={`flex items-center gap-2 px-4 py-2 bg-slate-800/60 rounded-full hover:bg-slate-700/80 transition-colors shrink-0 ${isSaved ? 'text-indigo-400' : 'text-slate-300'}`}
                  aria-label="Save to Watch Later"
                >
                  <Bookmark size={18} className={isSaved ? 'fill-current' : ''} />
                  <span className="font-medium text-sm hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Description Box */}
          <div 
            className={`bg-slate-800/40 hover:bg-slate-800/60 rounded-xl p-4 cursor-pointer transition-colors mb-8 ${descExpanded ? '' : 'line-clamp-2'}`}
            onClick={() => setDescExpanded(!descExpanded)}
            aria-expanded={descExpanded}
            role="button"
            tabIndex={0}
          >
            <div className="font-semibold text-slate-200 mb-2 flex items-center gap-3">
              <span>{video.views}</span>
              <span className="text-slate-400 font-normal">{video.uploadedAt}</span>
            </div>
            <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
              {video.description || "No description provided."}
            </p>
            <div className="mt-2 text-indigo-400 font-medium text-sm">
              {descExpanded ? 'Show less' : 'Show more'}
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare size={20} className="text-indigo-400" />
                Comments <span className="text-slate-400 text-lg font-normal">({formatNumber(comments.length)})</span>
              </h2>
              <button 
                onClick={() => setShowComments(!showComments)}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
                aria-label={showComments ? "Hide comments" : "Show comments"}
              >
                <motion.div animate={{ rotate: showComments ? 180 : 0 }}>
                  <ChevronDown size={20} />
                </motion.div>
              </button>
            </div>

            <AnimatePresence>
              {showComments && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {/* Add Comment */}
                  <form onSubmit={submitComment} className="flex gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                      😎
                    </div>
                    <div className="flex-1 flex flex-col items-end">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full bg-transparent border-b border-slate-700 focus:border-indigo-500 text-slate-200 pb-2 mb-3 outline-none transition-colors"
                        aria-label="Add a comment"
                      />
                      <div className="flex gap-2">
                        {newComment && (
                          <button 
                            type="button"
                            onClick={() => setNewComment('')}
                            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        <button 
                          type="submit"
                          disabled={!newComment.trim()}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-sm font-medium rounded-full transition-colors flex items-center gap-2"
                        >
                          <Send size={16} />
                          Comment
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Comment List */}
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <Comment key={comment.id} comment={comment} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar: Related Videos */}
        <div className="w-full xl:w-96 shrink-0 mt-8 xl:mt-0">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Up Next</h2>
          </div>
          
          <div className="flex flex-col gap-3">
            {relatedVideos.map((relVideo, index) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                key={`related-${relVideo.id}`}
                onClick={() => onBack(relVideo)}
                className="flex gap-3 group cursor-pointer hover:bg-slate-800/40 p-2 rounded-xl transition-colors"
                role="button"
                tabIndex={0}
                aria-label={`Watch ${relVideo.title}`}
              >
                <div className="w-40 shrink-0 aspect-video rounded-lg overflow-hidden relative">
                  <img src={relVideo.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-medium text-white">
                    {relVideo.duration}
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play size={24} className="text-white drop-shadow-md" fill="currentColor" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 py-0.5">
                  <h4 className="font-semibold text-slate-200 text-sm line-clamp-2 group-hover:text-indigo-400 transition-colors leading-tight mb-1">
                    {relVideo.title}
                  </h4>
                  <p className="text-xs text-slate-400 mb-0.5">{relVideo.channel}</p>
                  <p className="text-xs text-slate-500">{relVideo.views} • {relVideo.uploadedAt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareModal 
          isOpen={showShareModal}
          videoTitle={video.title}
          onClose={() => setShowShareModal(false)} 
          addToast={addToast}
        />
      )}
    </div>
  );
}
