# 💪 FitTrack — Your Personalized Fitness Command Center

<div align="center">

![FitTrack](https://img.shields.io/badge/FitTrack-v2.1-2979ff?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xOCAyMFYxMCIvPjxwYXRoIGQ9Ik0xMiAyMFY0Ii8+PHBhdGggZD0iTTYgMjB2LTYiLz48L3N2Zz4=)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.x-88CE02?style=for-the-badge&logo=greensock&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)

**A premium, fully client-side fitness tracking web application with a cinematic dark UI, interactive charts, AI coaching, and zero backend required.**

[Live Demo →](https://fittrack-invictuz.vercel.app) · [Report Bug](https://github.com/Invictuz07/FITTRACK/issues)

</div>

---

## ✨ Features

### 🌌 Cinematic Landing Page
- Interactive **starfield canvas** with mouse-parallax and nebula clouds
- GSAP-powered entrance animations
- Floating hero image with glow effects

### 📊 Smart Dashboard
- Personalized greeting with time-of-day awareness
- Real-time stat cards — BMR, TDEE, BMI, target calories
- Circular progress rings for daily calories, protein, and hydration
- Live workout streak counter with fire animation
- Daily motivational quotes

### 🏋️ Workout System
- **5 built-in workout plans** — Push/Pull/Legs, Upper/Lower, Full Body, Bro Split, Powerlifting
- Weekly schedule view with today highlighting
- **Active workout mode** with live timer, set tracking, and weight/rep logging
- Exercise video library with form demonstrations
- Full workout history with expandable details
- Personal records (PR) tracking

### 🍳 Nutrition Tracker
- **700+ food database** with full macro breakdowns
- Meal logging across Breakfast, Lunch, Dinner, and Snacks
- Real-time macro donut chart (Chart.js)
- **8 curated meal plans** — Muscle Building, Lean Cut, Keto, Mediterranean, etc.
- Hydration tracker with interactive water glass UI
- Calorie target calculator based on user goals

### 📈 Progress Analytics
- **Weight tracking** with interactive line charts and trend analysis
- **Body measurements** — chest, waist, arms, thighs with radar chart visualization
- **GitHub-style workout heatmap** — see your consistency at a glance
- Personal records dashboard
- Weight change indicators (gain/loss since start)


### ⚙️ Settings & Data
- Dark / Light theme toggle with smooth transitions
- Metric / Imperial unit switching
- Sound effects toggle
- Achievement system with 10 unlockable badges
- **Full data export/import** (JSON) for backups
- Data reset with confirmation

### 📱 Mobile Responsive
- Hamburger navigation menu on mobile
- Touch-friendly workout schedules with horizontal scroll
- Adaptive grid layouts across all screen sizes
- Optimized for iPhone SE through desktop ultrawide

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Bundler** | [Vite 6](https://vitejs.dev/) — lightning-fast HMR and builds |
| **Language** | Vanilla JavaScript (ES2022 modules) |
| **Styling** | Pure CSS with custom design tokens & CSS variables |
| **Animations** | [GSAP 3](https://gsap.com/) + CSS keyframe animations |
| **Charts** | [Chart.js 4](https://www.chartjs.org/) — line, donut, and radar charts |
| **Icons** | [Lucide](https://lucide.dev/) icon library |
| **Fonts** | [Inter](https://fonts.google.com/specimen/Inter) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) |
| **AI** | [Google Gemini API](https://ai.google.dev/) (optional, for AI Coach) |
| **Storage** | Browser `localStorage` — fully client-side, no server needed |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```
fittrack/
├── public/
│   ├── images/            # Hero images
│   └── videos/            # Exercise form videos
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── navbar.js      # Navigation bar with hamburger menu
│   │   ├── modal.js       # Modal dialog system
│   │   ├── toast.js       # Toast notification system
│   │   ├── timer.js       # Workout timer
│   │   ├── heatmap.js     # GitHub-style activity heatmap
│   │   ├── progressRing.js# Circular progress indicators
│   │   ├── statCard.js    # Stat display cards
│   │   └── badges.js      # Achievement badge renderer
│   ├── data/              # Static data & databases
│   │   ├── exercises.js   # Exercise library (100+ exercises)
│   │   ├── foods.js       # Food database (700+ items)
│   │   ├── workoutPlans.js# Pre-built workout programs
│   │   ├── mealPlans.js   # Curated meal plans
│   │   ├── quotes.js      # Motivational quotes
│   │   └── achievements.js# Achievement definitions
│   ├── pages/             # Page modules (SPA routes)
│   │   ├── landing.js     # Cinematic landing with starfield
│   │   ├── onboarding.js  # 4-step user setup wizard
│   │   ├── dashboard.js   # Main dashboard
│   │   ├── workouts.js    # Workout tracking & plans
│   │   ├── nutrition.js   # Nutrition logging & meal plans
│   │   ├── progress.js    # Charts, heatmap & analytics
│   │   ├── settings.js    # Settings & achievements
│   │   └── ai.js          # AI Coach (Gemini integration)
│   ├── styles/            # CSS architecture
│   │   ├── base.css       # Reset, tokens, typography
│   │   ├── components.css # Component styles
│   │   ├── pages.css      # Page-specific styles
│   │   └── animations.css # Keyframes & animation utilities
│   ├── utils/             # Helper modules
│   │   ├── dom.js         # DOM creation utilities
│   │   ├── formatters.js  # Date/number formatting
│   │   ├── calculations.js# BMR, TDEE, BMI calculators
│   │   ├── scrollReveal.js# Scroll-triggered animations
│   │   └── gemini.js      # Gemini API client
│   ├── main.js            # App entry point & route registration
│   ├── router.js          # Hash-based SPA router
│   └── store.js           # localStorage state management
├── index.html             # HTML entry point
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/Invictuz07/FITTRACK.git

# Navigate to the project
cd FITTRACK

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will open at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready for deployment.

### Preview Production Build

```bash
npm run preview
```

---

## 🤖 AI Coach Setup (Optional)

The AI Coach feature requires a free Google Gemini API key:

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a free API key
3. Open FitTrack → **Settings** → paste your API key
4. Start chatting with your AI Coach!

> **Note:** The API key is stored locally in your browser. It is never sent to any server other than Google's Gemini API.

---

## 🎨 Design System

FitTrack uses a custom-built design system with:

- **Dark-first theme** with full light mode support
- **CSS Custom Properties** for all colors, spacing, radii, and shadows
- **Glassmorphism** cards with backdrop blur
- **Ambient floating orbs** for depth
- **Noise texture overlay** for premium feel
- **Scroll-triggered reveal animations** across all pages
- **Ripple effect** on interactive elements

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `vite` | Build tool & dev server |
| `chart.js` | Data visualization (line, donut, radar charts) |
| `gsap` | Premium animation engine |
| `lucide` | Modern icon library |

**Zero runtime frameworks.** Pure vanilla JavaScript — fast, lightweight, and dependency-minimal.

---

## 🌐 Deployment

FitTrack is deployed on **Vercel** with automatic deploys from the `main` branch. Every push triggers a new production build.

To deploy your own:

1. Fork this repo
2. Connect it to [Vercel](https://vercel.com)
3. Deploy — no environment variables or backend needed!

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made by Aziz** ⚡

</div>
