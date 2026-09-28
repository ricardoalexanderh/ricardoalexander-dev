import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import RicardoPortfolio from './ricardo-portfolio.tsx'
// import AurisLanding from './auris-landing.tsx'
import NowLandingFrontend from './now-landing-frontend.tsx'
import { NowTerms, NowPrivacy, NowRefund } from './now-legal.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RicardoPortfolio />} />
        {/* <Route path="/products/auris" element={<AurisLanding />} /> */}
        <Route path="/products/now" element={<NowLandingFrontend />} />
        <Route path="/products/now/terms" element={<NowTerms />} />
        <Route path="/products/now/privacy" element={<NowPrivacy />} />
        <Route path="/products/now/refund" element={<NowRefund />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
