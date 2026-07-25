import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Home, Compass, TrendingUp, Library, Clock, ThumbsUp, Search } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { VIDEOS, GENRES } from './data';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import GenreBar from './components/GenreBar';
import VideoGrid from './components/VideoGrid';
import WatchPage from './components/WatchPage';
import Toast from './components/Toast';
import ScrollToTop from './components/ScrollToTop';

// ═══════════════════════════════════════════════════════════════════════
// VIEW TITLE MAP
// ═══════════════════════════════════════════════════════════════════════
const VIEW_CONFIG = {
  home:     { icon: Home,       label: 'Recommended' },
  explore:  { icon: Compass,    label: 'Explore' },
  trending: { icon: TrendingUp, label: 'Trending' },
  library:  { icon: Library,    label: 'Your Library' },
  history:  { icon: Clock,      label: 'Watch History' },
  liked:    { icon: ThumbsUp,   label: 'Liked Videos' },
};

// ═══════════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════
export default function App() {
  // ─── Core UI State ────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [currentView, setCurrentView] = useState('home');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeGenre, setActiveGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // ─── Toast System ─────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = toast.id || Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ─── Persistent State (localStorage) ─────────────────────────────
  const [watchHistory, setWatchHistory] = useLocalStorage('sv-history', []);
  const [likedVideos, setLikedVideos] = useLocalStorage('sv-liked', []);
  const [watchLater, setWatchLater] = useLocalStorage('sv-watchlater', []);

  // ─── Responsive Sidebar ───────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ─── Simulated Loading ────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  // ─── Keyboard Shortcuts ───────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      // '/' -> focus search (only when not typing in an input)
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
      // Escape -> back to browse from watch page
      if (e.key === 'Escape' && selectedVideo) {
        setSelectedVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVideo]);

  // ─── Filter Videos ────────────────────────────────────────────────
  const filteredVideos = useMemo(() => {
    let vids = VIDEOS;

    // View-specific filtering
    if (currentView === 'history' && watchHistory.length > 0) {
      vids = watchHistory
        .map((id) => VIDEOS.find((v) => v.id === id))
        .filter(Boolean)
        .reverse(); // Most recent first
    } else if (currentView === 'liked' && likedVideos.length > 0) {
      vids = likedVideos
        .map((id) => VIDEOS.find((v) => v.id === id))
        .filter(Boolean);
    } else if (currentView === 'library') {
      // Library shows watch later items
      if (watchLater.length > 0) {
        vids = watchLater
          .map((id) => VIDEOS.find((v) => v.id === id))
          .filter(Boolean);
      }
    }

    // Genre filter (only on home/explore/trending)
    if (['home', 'explore', 'trending'].includes(currentView) && activeGenre !== 'All') {
      vids = vids.filter((v) => v.genre === activeGenre);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      vids = vids.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.channel.toLowerCase().includes(q) ||
          v.genre.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q)
      );
    }

    return vids;
  }, [activeGenre, searchQuery, currentView, watchHistory, likedVideos, watchLater]);

  // ─── Handlers ─────────────────────────────────────────────────────
  const handleVideoClick = useCallback((video) => {
    setSelectedVideo(video);
    // Add to watch history
    setWatchHistory((prev) => {
      const filtered = prev.filter((id) => id !== video.id);
      return [...filtered, video.id];
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setWatchHistory]);

  const handleBackOrSwitch = useCallback((video) => {
    if (video) {
      setSelectedVideo(video);
      // Add to watch history
      setWatchHistory((prev) => {
        const filtered = prev.filter((id) => id !== video.id);
        return [...filtered, video.id];
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSelectedVideo(null);
    }
  }, [setWatchHistory]);

  const handleLogoClick = useCallback(() => {
    setSelectedVideo(null);
    setCurrentView('home');
    setSearchQuery('');
    setActiveGenre('All');
  }, []);

  const handleNavigate = useCallback((id) => {
    if (id) {
      setCurrentView(id);
      setSelectedVideo(null);
      setActiveGenre('All');
      setSearchQuery('');
    }
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleToggleLike = useCallback((videoId) => {
    setLikedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  }, [setLikedVideos]);

  const handleToggleSave = useCallback((videoId) => {
    setWatchLater((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  }, [setWatchLater]);

  // ─── Current view config ──────────────────────────────────────────
  const viewConfig = VIEW_CONFIG[currentView] || VIEW_CONFIG.home;
  const ViewIcon = viewConfig.icon;

  // ─── Determine sidebar margin for main content ────────────────────
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  const mainMarginLeft = isMobile ? 0 : (sidebarOpen ? 240 : 72);

  // ─── Empty state messages ─────────────────────────────────────────
  const getEmptyMessage = () => {
    if (currentView === 'history') return { title: 'No watch history yet', sub: 'Videos you watch will appear here' };
    if (currentView === 'liked') return { title: 'No liked videos yet', sub: 'Videos you like will appear here' };
    if (currentView === 'library') return { title: 'Your library is empty', sub: 'Save videos to Watch Later to see them here' };
    return { title: 'No videos found', sub: 'Try adjusting your search or genre filter' };
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar
        onToggleSidebar={() => setSidebarOpen((p) => !p)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLogoClick={handleLogoClick}
      />

      <Sidebar
        isOpen={sidebarOpen}
        currentView={currentView}
        onNavigate={handleNavigate}
        onClose={handleCloseSidebar}
      />

      {/* ─── Main Content Area ──────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {selectedVideo ? (
          <motion.main
            key="watch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ marginLeft: mainMarginLeft }}
            className="transition-[margin] duration-300"
            role="main"
          >
            <WatchPage
              video={selectedVideo}
              onBack={handleBackOrSwitch}
              allVideos={VIDEOS}
              isLiked={likedVideos.includes(selectedVideo.id)}
              isSaved={watchLater.includes(selectedVideo.id)}
              onToggleLike={handleToggleLike}
              onToggleSave={handleToggleSave}
              addToast={addToast}
            />
          </motion.main>
        ) : (
          <motion.main
            key="browse"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="pt-20 pb-10 transition-[margin] duration-300"
            style={{ marginLeft: mainMarginLeft }}
            role="main"
          >
            <div className="px-4 sm:px-6 max-w-[1800px] mx-auto">
              {/* Page Title */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <ViewIcon className="w-6 h-6 text-indigo-400" />
                  {viewConfig.label}
                </h1>
                {searchQuery && (
                  <p className="text-sm text-slate-500 mt-2">
                    Showing results for "<span className="text-indigo-400">{searchQuery}</span>"
                    {' — '}{filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} found
                  </p>
                )}
              </motion.div>

              {/* Genre Bar (only on browse views) */}
              {['home', 'explore', 'trending'].includes(currentView) && (
                <GenreBar activeGenre={activeGenre} setActiveGenre={setActiveGenre} />
              )}

              {/* Video Grid or Empty State */}
              {filteredVideos.length > 0 ? (
                <VideoGrid
                  videos={filteredVideos}
                  onVideoClick={handleVideoClick}
                  isLoading={isLoading}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <div className="w-20 h-20 rounded-2xl bg-slate-800/60 flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-400">
                    {getEmptyMessage().title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {getEmptyMessage().sub}
                  </p>
                  {(searchQuery || activeGenre !== 'All') && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSearchQuery('');
                        setActiveGenre('All');
                      }}
                      className="mt-4 px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-500 transition-colors"
                      id="clear-filters"
                    >
                      Clear all filters
                    </motion.button>
                  )}
                </motion.div>
              )}
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* ─── Global UI Overlays ─────────────────────────────────────── */}
      <Toast toasts={toasts} removeToast={removeToast} />
      <ScrollToTop />
    </div>
  );
}
