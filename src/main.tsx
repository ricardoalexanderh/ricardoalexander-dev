import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RicardoPortfolio from './ricardo-portfolio.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RicardoPortfolio />
  </StrictMode>,
)
