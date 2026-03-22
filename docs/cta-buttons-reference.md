# CTA Buttons Reference — Original Values

When products are ready to launch, restore these buttons by replacing "Coming Soon" with the original text and removing the disabled styles.

## Now Landing Page (`src/now-landing-frontend.tsx`)

| Location | Original Text | Element | Notes |
|----------|---------------|---------|-------|
| Nav desktop | `Get Now` | `<a href="#" className="now-nav-cta">` | |
| Nav mobile | `Get Now` | `<a href="#" className="now-nav-cta">` | Has `onClick={() => setMobileMenuOpen(false)}` |
| Hero CTA | `Get Now &mdash; $4.99` | `<a href="#" className="now-btn-primary">` | Primary button |
| Pricing CTA | `Get Now` | `<a href="#" className="now-plan-cta">` | Inside pricing card |

## Auris Landing Page (`src/auris-landing.tsx`)

| Location | Original Text | Element | Notes |
|----------|---------------|---------|-------|
| Nav desktop | `Get Auris` | `<a href="https://chromewebstore.google.com" target="_blank" rel="noopener noreferrer" className="auris-nav-cta">` | External link |
| Nav mobile | `Get Auris` | `<a href="https://chromewebstore.google.com" target="_blank" rel="noopener noreferrer" className="auris-nav-cta">` | Has `onClick={() => setMobileMenuOpen(false)}` |
| Hero CTA | `Get Auris` | `<a href="https://chromewebstore.google.com" target="_blank" rel="noopener noreferrer" className="auris-btn-primary">` | Primary button |
| Pricing CTA | `Get Auris` | `<a href="https://chromewebstore.google.com" target="_blank" rel="noopener noreferrer" className="auris-plan-cta">` | Inside pricing card |

## Portfolio Page (`src/ricardo-portfolio.tsx`)

| Location | Original Text | Element | Notes |
|----------|---------------|---------|-------|
| Auris card | `$49 &middot; Learn more &rarr;` | `<a href="/products/auris" className="...text-emerald-500...mt-auto">` | Keep href, just restore text |
| Now card | `$4.99 &middot; Learn more &rarr;` | `<a href="/products/now" className="...text-emerald-500...mt-auto">` | Keep href, just restore text |

## Disabled Style Applied

All CTA buttons were changed to:
- Text: "Coming Soon"
- Style: `opacity: 0.5; pointer-events: none; cursor: not-allowed`
- href removed or set to `#`

To restore: remove the disabled inline styles and change text back to original values above.
