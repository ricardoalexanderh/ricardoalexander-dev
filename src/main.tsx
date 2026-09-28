import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import RicardoPortfolio from './ricardo-portfolio.tsx'
// import AurisLanding from './auris-landing.tsx'

// Product pages load on demand so the home page downloads less
const NowLandingFrontend = lazy(() => import('./now-landing-frontend.tsx'))
const NowTerms = lazy(() => import('./now-legal.tsx').then(m => ({ default: m.NowTerms })))
const NowPrivacy = lazy(() => import('./now-legal.tsx').then(m => ({ default: m.NowPrivacy })))

// Matches the Now pages' background so there's no white flash while they load
const nowFallback = <div style={{ minHeight: '100vh', background: '#0a0a12' }} />

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={nowFallback}>
        <Routes>
          <Route path="/" element={<RicardoPortfolio />} />
          {/* <Route path="/products/auris" element={<AurisLanding />} /> */}
          <Route path="/products/now" element={<NowLandingFrontend />} />
          <Route path="/products/now/terms" element={<NowTerms />} />
          <Route path="/products/now/privacy" element={<NowPrivacy />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
