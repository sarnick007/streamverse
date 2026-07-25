import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Compass, TrendingUp, BookOpen, History, ThumbsUp, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'library', label: 'Library', icon: BookOpen },
  { id: 'history', label: 'History', icon: History },
  { id: 'liked', label: 'Liked Videos', icon: ThumbsUp },
];

const Sidebar = ({ isOpen, currentView, onNavigate, onClose }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Determine sidebar variants based on mobile state
  const sidebarVariants = {
    open: {
      x: 0,
      width: 240,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closed: {
      x: isMobile ? -280 : 0,
      width: isMobile ? 240 : 72,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        className="fixed left-0 top-16 bottom-0 z-40 bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/30 flex flex-col overflow-hidden"
        role="complementary"
        aria-label="Sidebar navigation"
      >
        <div className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <motion.button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  flex items-center gap-4 px-3 py-2.5 rounded-xl transition-colors whitespace-nowrap
                  ${isActive 
                    ? 'bg-indigo-500/15 text-indigo-400 font-medium' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className={`text-sm ${!isOpen && !isMobile ? 'opacity-0 w-0' : 'opacity-100'} transition-opacity duration-200`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Settings at bottom */}
        <div className="p-2 border-t border-slate-800/30 mt-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors whitespace-nowrap"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className={`text-sm ${!isOpen && !isMobile ? 'opacity-0 w-0' : 'opacity-100'} transition-opacity duration-200`}>
              Settings
            </span>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
