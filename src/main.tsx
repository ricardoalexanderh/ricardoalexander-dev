import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import RicardoPortfolio from './ricardo-portfolio.tsx'
import AurisLanding from './auris-landing.tsx'
import NowLandingFrontend from './now-landing-frontend.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RicardoPortfolio />} />
        <Route path="/products/auris" element={<AurisLanding />} />
        <Route path="/products/now" element={<NowLandingFrontend />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
