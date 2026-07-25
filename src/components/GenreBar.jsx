import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Monitor, Radio, Gamepad2, Laugh, FlaskConical, Plane, CookingPot, Dumbbell, Palette } from 'lucide-react';
import { GENRES } from '../data';

const genreIconMap = {
  'All': Sparkles,
  'Tech': Monitor,
  'Music': Radio,
  'Gaming': Gamepad2,
  'Comedy': Laugh,
  'Science': FlaskConical,
  'Travel': Plane,
  'Cooking': CookingPot,
  'Fitness': Dumbbell,
  'Design': Palette
};

const GenreBar = ({ activeGenre, setActiveGenre }) => {
  return (
    <div className="relative mb-6">
      <div 
        className="flex gap-2 overflow-x-auto pb-2" 
        style={{ scrollbarWidth: 'none' }}
        role="tablist"
        aria-label="Video genres"
      >
        {GENRES.map((genre) => {
          const Icon = genreIconMap[genre] || Sparkles;
          const isActive = activeGenre === genre;
          
          return (
            <motion.button
              key={genre}
              id={`genre-${genre.toLowerCase()}`}
              role="tab"
              aria-selected={isActive}
              aria-label={`Filter by ${genre}`}
              onClick={() => setActiveGenre(genre)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 genre-pill-active' 
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 hover:text-slate-200 border border-slate-700/30'
                }
              `}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{genre}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(GenreBar);
