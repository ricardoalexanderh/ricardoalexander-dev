# Ricardo Alexander - Portfolio

A modern, interactive portfolio site with multiple routes, showcasing software architecture expertise and 20+ years of enterprise development experience.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js with React Three Fiber and React Three Drei
- **Animations**: Motion (Framer Motion)
- **Smooth Scrolling**: Lenis
- **Icons**: Phosphor Icons, Lucide React, React Icons
- **Routing**: React Router

## Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `ricardo-portfolio.tsx` | Main portfolio with 3D orb, project showcase, skills, and contact |
| `/products/auris` | `auris-landing.tsx` | Product landing page for the Auris Chrome extension |

## Features

- Dark/light theme with localStorage persistence
- Interactive 3D animated orb (Three.js / React Three Fiber)
- Scroll-triggered animations and text scramble effects (Motion)
- YouTube video modal for professional overview
- Downloadable resume (PDF)
- Responsive layout with mobile navigation
- Auris product page with auto-playing slideshow, FAQ accordion, and scroll-reveal animations

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | TypeScript compilation + Vite production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |

## Project Structure

```
src/
  main.tsx                 # App entry with React Router setup
  ricardo-portfolio.tsx    # Main portfolio page
  auris-landing.tsx        # Auris product landing page
  index.css                # Global styles and Tailwind imports
  vite-env.d.ts            # Vite type declarations
  assets/                  # Bundled static assets
public/                    # Static assets (fonts, icons, favicons, resume PDF)
index.html                 # HTML entry point (includes Google Fonts)
vite.config.ts             # Vite configuration
tailwind.config.js         # Tailwind CSS configuration
postcss.config.js          # PostCSS configuration
eslint.config.js           # ESLint configuration
vercel.json                # Vercel deployment rewrites
tsconfig.json              # TypeScript config (root)
```

## Deployment

Deployed on Vercel. See `vercel.json` for configuration.
