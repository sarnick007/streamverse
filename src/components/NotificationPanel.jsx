import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const mockNotifications = [
  { id: 'n1', avatar: '🤖', text: 'CodeCraft AI uploaded: New React 19 Tutorial', time: '2 hours ago', isRead: false },
  { id: 'n2', avatar: '🎵', text: 'NeonBeats Studio is live now!', time: '5 hours ago', isRead: false },
  { id: 'n3', avatar: '🎮', text: 'GameMaster Pro replied to your comment', time: '1 day ago', isRead: false },
  { id: 'n4', avatar: '🔬', text: 'ScienceUnboxed: Check out our new series!', time: '2 days ago', isRead: true },
  { id: 'n5', avatar: '👨‍🍳', text: 'ChefStudio Premium uploaded: 5-Min Recipes', time: '3 days ago', isRead: true }
];

const NotificationPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="notification-panel"
          ref={panelRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="fixed right-4 top-16 w-96 max-h-[480px] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl z-50 flex flex-col"
        >
          <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 px-4 py-3 flex justify-between items-center z-10">
            <h3 className="font-bold text-slate-100">Notifications</h3>
            <button
              id="mark-all-read-btn"
              onClick={markAllRead}
              aria-label="Mark all as read"
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Mark all as read
            </button>
          </div>
          <div className="flex flex-col py-2">
            {notifications.map(n => (
              <div
                key={n.id}
                id={`notification-${n.id}`}
                className="flex items-start gap-3 px-4 py-3 hover:bg-slate-800/50 transition-colors cursor-pointer relative"
              >
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl shrink-0">
                  {n.avatar}
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <p className={`text-sm ${n.isRead ? 'text-slate-400' : 'text-slate-200 font-medium'}`}>
                    {n.text}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{n.time}</p>
                </div>
                {!n.isRead && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500" aria-label="Unread indicator" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
