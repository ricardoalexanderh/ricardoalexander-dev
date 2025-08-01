# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Ricardo Alexander's personal portfolio website - a modern, interactive single-page application showcasing his expertise as a software architect and technology entrepreneur. The portfolio demonstrates cutting-edge web technologies while presenting professional achievements and technical capabilities.

### Important Reference Documents
- **WEBPLAN.md** - Contains the complete master plan for building this portfolio website, including design philosophy, technical architecture, implementation phases, and detailed specifications
- **PORTFOLIO.md** - Contains Ricardo's complete professional portfolio content, including experience details, client list, project descriptions, and all biographical information

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom color palette and font configuration
- **3D Graphics**: Three.js with React Three Fiber (@react-three/fiber) and React Three Drei (@react-three/drei)
- **Animations**: Motion (Framer Motion successor) for UI animations
- **Smooth Scrolling**: Lenis for enhanced scroll experience
- **Icons**: Lucide React and React Icons
- **Linting**: ESLint with TypeScript and React hooks support

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript compilation then Vite build)
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

### Build Process
The build process is two-stage:
1. `tsc -b` - TypeScript compilation with build mode
2. `vite build` - Vite bundling and optimization

## Architecture & Code Organization

### File Structure
```
src/
├── main.tsx              # Application entry point
├── ricardo-portfolio.tsx # Main portfolio component (likely single-page app)
├── index.css            # Global styles and Tailwind imports
├── vite-env.d.ts        # Vite environment type definitions
└── assets/              # Static assets (images, icons)
```

### Key Architectural Decisions

1. **Single Page Application**: The main component is `RicardoPortfolio`, suggesting a single-page portfolio design
2. **Modern React**: Uses React 19 with StrictMode for development safety
3. **TypeScript Configuration**: Multiple tsconfig files for different contexts (app vs node)
4. **3D Integration**: Heavy use of Three.js ecosystem for interactive 3D elements
5. **Custom Design System**: Tailwind extended with custom fonts and color palette

## Styling & Design System

### Custom Fonts
- **Inter**: Primary sans-serif font
- **Orbitron**: Modern geometric font (likely for headings/tech themes)
- **Tinos**: Serif font option
- **Higuen Serif**: Custom serif font (loaded from public/higuen-serif.woff2)

### Color Palette
```css
/* Custom colors defined in Tailwind config */
clean-black: #0a0a0a        /* Deep black */
clean-gray: #1a1a1a         /* Dark gray */
clean-white: #ffffff        /* Pure white */
clean-light: #f8fafc        /* Light background */

/* Text colors for dark/light themes */
text-primary-dark: #0f172a     /* Dark mode primary text */
text-secondary-dark: #64748b   /* Dark mode secondary text */
text-primary-light: #ffffff    /* Light mode primary text */
text-secondary-light: #a3a3a3  /* Light mode secondary text */
```

### Theme Support
- Dark mode support enabled with `darkMode: 'class'`
- Dual color scheme for light/dark themes

## Code Quality & Standards

### ESLint Configuration
- TypeScript support with recommended rules
- React Hooks plugin for hooks-specific rules
- React Refresh plugin for Vite HMR compatibility
- Modern ES2020 syntax support
- Browser globals configured

### Development Best Practices
- StrictMode enabled for development
- TypeScript strict mode implied by build process
- Consistent naming conventions (kebab-case for files, PascalCase for components)

## Performance Considerations

### 3D Optimization
When working with Three.js components:
- Use React Three Fiber's `useFrame` hook for animations
- Implement proper cleanup in useEffect hooks
- Consider using `useMemo` for expensive 3D calculations
- Implement proper loading states for 3D assets

### Build Optimization
- Vite handles code splitting and tree shaking automatically
- Images should be optimized (WebP format recommended)
- 3D models should be compressed (GLB format preferred)

## Deployment

- Configured for Vercel deployment (vercel.json present)
- Static site generation compatible
- Optimized for modern browsers

## Development Workflow

1. **Starting Development**: Run `npm run dev` and navigate to the local server
2. **Code Quality**: Run `npm run lint` before committing changes
3. **Production Testing**: Use `npm run build && npm run preview` to test production builds
4. **3D Development**: Use React DevTools Profiler to monitor 3D performance

## Special Considerations

### Portfolio Context
This is a personal portfolio showcasing:
- 20+ years of software architecture experience
- Work with Fortune 500 companies (Toyota, Bank Mandiri, Astra Group)
- Expertise in enterprise systems, AI/ML, blockchain, and modern web technologies

### Content Strategy
The codebase should reflect the same level of technical excellence that Ricardo demonstrates in his professional work. Focus on:
- Clean, performant code
- Smooth animations and interactions
- Professional presentation
- Technical innovation demonstration

## Maintenance Notes

- Keep dependencies updated, especially Three.js ecosystem packages
- Monitor bundle size when adding new features
- Test 3D performance across different devices and browsers
- Ensure accessibility standards are maintained alongside visual enhancements