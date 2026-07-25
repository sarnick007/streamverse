import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2 } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, videoTitle, addToast }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = () => {
    const url = `https://streamverse.app/watch/${encodeURIComponent(videoTitle || '')}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        addToast({ id: Date.now(), message: 'Link copied to clipboard!', type: 'success' });
        onClose();
      })
      .catch(() => {
        addToast({ id: Date.now(), message: 'Failed to copy link', type: 'error' });
      });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="share-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] flex justify-center items-start"
        >
          <motion.div
            id="share-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-auto mt-[20vh] bg-slate-900 rounded-2xl border border-slate-700/50 p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-2">
              <Share2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-100">Share Video</h2>
            </div>
            <p className="text-sm text-slate-400 mb-6 truncate" aria-label="Video Title">
              {videoTitle}
            </p>

            <div className="flex gap-2 mb-6">
              <input
                id="share-url-input"
                type="text"
                readOnly
                value={`https://streamverse.app/watch/${encodeURIComponent(videoTitle || '')}`}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm focus:outline-none"
                aria-label="Share URL"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                id="close-share-modal"
                onClick={onClose}
                aria-label="Close share modal"
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                Close
              </button>
              <button
                id="copy-link-btn"
                onClick={handleCopy}
                aria-label="Copy Link"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Copy Link
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
