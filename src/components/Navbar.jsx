import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Play, Search, Bell, User, X } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import { SEARCH_SUGGESTIONS } from '../data';

const Navbar = ({ onToggleSidebar, searchQuery, setSearchQuery, onLogoClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const unreadCount = 3;
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && inputRef.current && !dropdownRef.current.contains(e.target) && !inputRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = SEARCH_SUGGESTIONS 
    ? SEARCH_SUGGESTIONS.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 flex items-center px-4 gap-4 justify-between"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Left section */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="p-2 rounded-full hover:bg-slate-800/60 text-slate-300 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <button 
          id="btn-logo"
          onClick={onLogoClick}
          aria-label="StreamVerse Home"
          className="flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent hidden sm:block">
            StreamVerse
          </span>
        </button>
      </div>

      {/* Center: search bar */}
      <div className="flex-1 max-w-2xl px-4 relative flex justify-center">
        <div className="w-full max-w-lg relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            placeholder="Search videos, channels, or genres..."
            aria-label="Search"
            className="w-full h-10 pl-10 pr-10 bg-slate-900/50 border border-slate-700/50 focus:border-indigo-500/60 rounded-full text-sm text-slate-200 placeholder-slate-500 outline-none transition-all shadow-sm focus:bg-slate-900/80 focus:shadow-indigo-500/10 focus:ring-1 focus:ring-indigo-500/60"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setShowSearchDropdown(false); inputRef.current?.focus(); }}
              aria-label="Clear search"
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search suggestions dropdown */}
          <AnimatePresence>
            {showSearchDropdown && searchQuery && filteredSuggestions.length > 0 && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700/50 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50 py-2"
              >
                {filteredSuggestions.map((suggestion, idx) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setShowSearchDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 flex items-center gap-3 text-sm text-slate-300 hover:text-slate-100 transition-colors"
                  >
                    <Search className="w-4 h-4 text-slate-500" />
                    {suggestion}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 relative">
        <button
          id="btn-notifications"
          onClick={() => setShowNotifications(!showNotifications)}
          aria-label="Notifications"
          aria-expanded={showNotifications}
          className="p-2 rounded-full hover:bg-slate-800/60 text-slate-300 transition-colors relative outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-950" />
          )}
        </button>
        
        <NotificationPanel 
          isOpen={showNotifications} 
          onClose={() => setShowNotifications(false)} 
        />

        <button
          id="btn-user-profile"
          aria-label="User profile"
          className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:border-slate-500 transition-colors ml-1 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
