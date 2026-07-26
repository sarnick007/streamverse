# StreamVerse – Premium Video-Streaming Web Platform

A modern, highly interactive, responsive **React + Vite** single-page video streaming application inspired by YouTube. Built with standard Vanilla CSS & Tailwind/Motion animations, ambient color glow, and dark mode UI.

Live Demo: [https://streamverse-red.vercel.app/](https://streamverse-red.vercel.app/)

---

##  Features

- **Dynamic Video Player**: Interactive YouTube iframe player with ambient glow matching video theme.
- **Rich Motion Animations**: Smooth page transitions, micro-interactions, skeleton loading shimmers, and interactive modals.
- **Search & Suggestions**: Live search filtering across titles, genres, and channels with autocomplete suggestions.
- **Genre Filter Bar**: Dynamic category pills to filter feed instantly.
- **Persisted User State**:
  -  Watch History
  -  Liked Videos
  -  Watch Later / Saved Library
- **Interactive UI Elements**:
  - Toast Notifications (Save/Like/Share feedback)
  - Copyable Share Link Modal
  - Notification Dropdown Panel
  - Floating Scroll-to-Top Button
  - Interactive Comments with Like/Dislike counters

---

##  Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS / Custom CSS Utilities
- **Animations**: Framer Motion (`motion/react`)
- **Icons**: Lucide React
- **Effects**: JS-Confetti
- **Deployment**: Vercel SPA Configuration (`vercel.json`)

---

##  Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation & Local Run

```bash
# 1. Clone the repository
git clone https://github.com/sarnick007/streamverse.git
cd streamverse

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

##  Production Build

To create an optimized production build:

```bash
npm run build
```

Build outputs are saved to the `dist/` directory with automatic vendor chunk splitting (`react`, `motion`, `icons`, `confetti`).

---

##  Deployment on Vercel

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Update video dataset and thumbnails"
   git push origin main
   ```
2. Vercel will automatically trigger a new deployment for your live site at [https://streamverse-red.vercel.app/](https://streamverse-red.vercel.app/).

---

## 📄 License

MIT License. Free for personal and commercial projects.
