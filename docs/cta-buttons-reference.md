# CTA Buttons Reference

## Now Landing Page (`src/now-landing-frontend.tsx`)

| Location | Text | Element | Notes |
|----------|------|---------|-------|
| Nav desktop | `Get Now` | `<a href={buyUrl} className="now-nav-cta" target="_blank">` | Geo-routed buy URL |
| Nav mobile | `Get Now` | `<a href={buyUrl} className="now-nav-cta" target="_blank">` | Has `onClick` for menu close |
| Hero CTA | `Get Now — {displayPrice}` | `<a href={buyUrl} className="now-btn-primary" target="_blank">` | Primary button, geo-routed |
| Hero download | `Download for {OS}` | `<a href={downloadUrl} className="now-btn-secondary">` | OS-detected |
| Pricing CTA | `Get Now` | `<a href={buyUrl} className="now-plan-cta" target="_blank">` | Inside pricing card |

## Auris Landing Page (`src/auris-landing.tsx`)

| Location | Original Text | Element | Notes |
|----------|---------------|---------|-------|
| Nav desktop | `Get Auris` | `<a href="https://chromewebstore.google.com" target="_blank" rel="noopener noreferrer" className="auris-nav-cta">` | External link |
| Nav mobile | `Get Auris` | `<a href="https://chromewebstore.google.com" target="_blank" rel="noopener noreferrer" className="auris-nav-cta">` | Has `onClick={() => setMobileMenuOpen(false)}` |
| Hero CTA | `Get Auris` | `<a href="https://chromewebstore.google.com" target="_blank" rel="noopener noreferrer" className="auris-btn-primary">` | Primary button |
| Pricing CTA | `Get Auris` | `<a href="https://chromewebstore.google.com" target="_blank" rel="noopener noreferrer" className="auris-plan-cta">` | Inside pricing card |

**Note:** Auris buttons are still set to "Coming Soon" (disabled) in the code. The values above are the intended launch values.

## Portfolio Page (`src/ricardo-portfolio.tsx`)

| Location | Text | Element | Notes |
|----------|------|---------|-------|
| Auris card | `Coming Soon · Learn more →` | `<a href="/products/auris">` | Still disabled |
| Now card | `$5.99 · Learn more →` | `<a href="/products/now">` | Active |

## Geo-Conditional Pricing (Now)

Pricing and buy URLs are geo-routed via `src/hooks/useGeoAndPlatform.ts`:

| Region | Price | Buy URL |
|--------|-------|---------|
| Indonesia (`ID`) | Rp. 99.000 | Mayar (placeholder) |
| Rest of world | $5.99 | Paddle (placeholder) |

## Download Links (Now)

OS-detected via `useDetectedOS()` hook. Download URLs are configured in `NOW_CONFIG.downloadUrls`:

| Platform | URL |
|----------|-----|
| Windows | Placeholder |
| macOS | Placeholder |
| Linux | Placeholder |

All placeholder URLs are prefixed with `PLACEHOLDER_` in `src/hooks/useGeoAndPlatform.ts` for easy search-and-replace.
