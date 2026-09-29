import React, { useEffect } from 'react'

// Terms and Privacy pages for Now — linked from the Now footer.

const CONTACT_EMAIL = 'main@ricardoalexander.dev'
const LAST_UPDATED = 'September 28, 2026'

const LEGAL_PAGES = [
  { path: '/products/now/terms', label: 'Terms' },
  { path: '/products/now/privacy', label: 'Privacy' },
]

function Email() {
  return <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
}

function LegalLayout({ title, path, children }: { title: string; path: string; children: React.ReactNode }) {
  useEffect(() => {
    const prev = document.title
    document.title = `${title} · Now`
    window.scrollTo(0, 0)
    return () => { document.title = prev }
  }, [title])

  return (
    <div className="now-legal">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700&display=swap');

        .now-legal {
          --bg: #0a0a12;
          --border: #1a1a30;
          --dim: #252545;
          --muted: #5a5a80;
          --subtle: #8888aa;
          --body: #c4c4d8;
          --bright: #eeeef8;
          --accent: #7BEAD2;

          background: var(--bg);
          color: var(--body);
          font-family: 'Outfit', sans-serif;
          font-size: 16px;
          line-height: 1.7;
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }
        .now-legal *, .now-legal *::before, .now-legal *::after { box-sizing: border-box; }
        .now-legal-container { max-width: 760px; margin: 0 auto; padding: 0 1.5rem; width: 100%; }

        .now-legal-nav { border-bottom: 1px solid var(--border); }
        .now-legal-nav-inner {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 1.1rem; padding-bottom: 1.1rem;
        }
        .now-legal-logo {
          font-family: 'Silkscreen', cursive; font-weight: 700; font-size: 1.2rem;
          color: var(--bright); text-decoration: none; letter-spacing: 0.02em;
        }
        .now-legal-back { font-size: 0.85rem; color: var(--muted); text-decoration: none; transition: color 0.2s; }
        .now-legal-back:hover { color: var(--bright); }

        .now-legal-main { padding-top: 4rem; padding-bottom: 5rem; }
        .now-legal-label {
          font-family: 'Space Mono', monospace; font-size: 0.72rem;
          text-transform: uppercase; letter-spacing: 0.14em;
          color: var(--accent); margin: 0 0 1rem;
        }
        .now-legal-title {
          font-family: 'Silkscreen', cursive; font-weight: 700;
          font-size: clamp(1.5rem, 4vw, 2.25rem); line-height: 1.2;
          color: var(--bright); letter-spacing: 0.01em; margin: 0 0 0.75rem;
        }
        .now-legal-updated { font-size: 0.85rem; color: var(--muted); margin: 0 0 3rem; }

        .now-legal-body h2 { font-size: 1.15rem; font-weight: 600; color: var(--bright); margin: 2.5rem 0 0.75rem; }
        .now-legal-body p { margin: 0 0 1rem; }
        .now-legal-body ul { margin: 0 0 1rem; padding-left: 1.25rem; list-style: square; }
        .now-legal-body li { margin-bottom: 0.5rem; }
        .now-legal-body li::marker { color: var(--accent); }
        .now-legal-body a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; overflow-wrap: anywhere; }
        .now-legal-body strong { color: var(--bright); font-weight: 600; }

        .now-legal-footer {
          border-top: 1px solid var(--border); padding: 2rem 0;
          text-align: center; font-size: 0.75rem; color: var(--dim);
        }
        .now-legal-links { display: flex; gap: 1.25rem; justify-content: center; margin-bottom: 0.75rem; }
        .now-legal-links a { color: var(--muted); text-decoration: none; transition: color 0.2s; }
        .now-legal-links a:hover, .now-legal-links a[aria-current="page"] { color: var(--bright); }

        @media (max-width: 640px) {
          .now-legal-container { padding: 0 1rem; }
          .now-legal-main { padding-top: 2.5rem; padding-bottom: 3.5rem; }
          .now-legal-updated { margin-bottom: 2rem; }
        }
      `}</style>

      <header className="now-legal-nav">
        <div className="now-legal-container now-legal-nav-inner">
          <a href="/products/now" className="now-legal-logo">Now</a>
          <a href="/products/now" className="now-legal-back">{'←'} Back to Now</a>
        </div>
      </header>

      <main className="now-legal-container now-legal-main">
        <p className="now-legal-label">Legal</p>
        <h1 className="now-legal-title">{title}</h1>
        <p className="now-legal-updated">Last updated: {LAST_UPDATED}</p>
        <div className="now-legal-body">{children}</div>
      </main>

      <footer className="now-legal-footer">
        <div className="now-legal-container">
          <nav className="now-legal-links" aria-label="Legal">
            {LEGAL_PAGES.map(p => (
              <a key={p.path} href={p.path} aria-current={p.path === path ? 'page' : undefined}>{p.label}</a>
            ))}
          </nav>
          <p style={{ margin: 0 }}>&copy; 2026 XANDR</p>
        </div>
      </footer>
    </div>
  )
}

export function NowTerms() {
  return (
    <LegalLayout title="Terms of Service" path="/products/now/terms">
      <p>
        These terms cover your purchase and use of Now, a desktop companion app made by Ricardo Alexander, trading
        as XANDR (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By buying, downloading, or using Now, you agree to them.
      </p>

      <h2>Purchases</h2>
      <ul>
        <li>Now is a one-time purchase. There is no subscription.</li>
        <li>
          Orders from outside Indonesia are processed by Polar (Polar Software, Inc.), our Merchant of Record. Polar
          handles payment, sales tax, and billing support for these orders, and Polar&rsquo;s{' '}
          <a href="https://polar.sh/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer">Buyer Terms</a> also apply.
        </li>
        <li>Orders from Indonesia are processed by Mayar and charged in Indonesian Rupiah.</li>
        <li>The price shown depends on your country. Taxes may be added at checkout where required.</li>
      </ul>

      <h2>Refunds</h2>
      <ul>
        <li>
          <strong>Orders from Indonesia (Mayar) are final.</strong> They can&rsquo;t be refunded once your license key
          has been delivered. If you were charged more than once for the same order, email us and we&rsquo;ll refund
          the extra charge.
        </li>
        <li>Refunds for orders from outside Indonesia are handled by Polar under its Buyer Terms.</li>
        <li>If Now won&rsquo;t install or run, email us first and we&rsquo;ll help you get it working.</li>
        <li>A refund ends your license. You must stop using Now and uninstall it.</li>
      </ul>

      <h2>Your license</h2>
      <ul>
        <li>
          When you buy Now, you get a personal, non-exclusive, non-transferable license to install and use it on
          computers you own or control.
        </li>
        <li>
          Your purchase includes the companions and features described on the product page when you buy, plus the
          updates we release for Now. New character packs may be sold separately.
        </li>
        <li>
          Now is available for the platforms listed on the product page. Platforms and features marked as
          &ldquo;coming soon&rdquo; are planned but not guaranteed until they are released.
        </li>
      </ul>

      <h2>What you can&rsquo;t do</h2>
      <ul>
        <li>Share, resell, or redistribute Now or your license.</li>
        <li>Reverse engineer, decompile, or modify Now, except where the law allows it.</li>
        <li>Remove copyright or other notices from Now.</li>
      </ul>

      <h2>Third-party services</h2>
      <p>
        Some features connect to services we don&rsquo;t run, such as AI providers you use with your own API key.
        Those services have their own terms, and any charges they bill you are yours to pay.
      </p>

      <h2>No warranty</h2>
      <p>
        Now is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind, to the
        extent the law allows.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent the law allows, we are not liable for indirect or consequential losses, and our total liability
        for any claim about Now is limited to the amount you paid for it.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of the Republic of Indonesia. Nothing in them limits rights you have
        under the consumer protection laws where you live.
      </p>

      <h2>Changes</h2>
      <p>If we change these terms, we&rsquo;ll update the date at the top of this page.</p>

      <h2>Contact</h2>
      <p>Questions about these terms: <Email /></p>
    </LegalLayout>
  )
}

export function NowPrivacy() {
  return (
    <LegalLayout title="Privacy Policy" path="/products/now/privacy">
      <p>
        This policy explains what data is involved when you visit the Now website, buy Now, and use the app. Now is
        made by Ricardo Alexander, trading as XANDR (&ldquo;we&rdquo;, &ldquo;us&rdquo;).
      </p>

      <h2>The Now app</h2>
      <ul>
        <li>
          Now runs locally on your computer. It has no telemetry or analytics, and we don&rsquo;t collect your habits,
          notes, or other data.
        </li>
        <li>
          Features that need online data, such as weather or AI features that use your own API key, connect directly
          from your device to that service. We don&rsquo;t receive that data, and the service&rsquo;s own privacy
          policy applies.
        </li>
      </ul>

      <h2>This website</h2>
      <ul>
        <li>We don&rsquo;t use cookies, analytics, or ad trackers.</li>
        <li>
          To show the price for your country, your browser asks ipapi.co to look up your country from your IP
          address. The result is kept in your browser&rsquo;s session storage until you close the tab.
        </li>
        <li>The weather demo on the Now page asks wttr.in for the weather near you, based on your IP address.</li>
        <li>Fonts are loaded from Google Fonts, which receives your IP address when it serves them.</li>
        <li>The site is hosted on Vercel, which keeps standard server logs such as IP address and browser type.</li>
      </ul>

      <h2>Purchases</h2>
      <ul>
        <li>
          Payments are handled by Polar (outside Indonesia) and Mayar (Indonesia). They collect your name, email,
          billing details, and payment information under their own privacy policies.
        </li>
        <li>
          We receive your order details, such as your name, email, country, and what you bought. We use them only to
          deliver your purchase, process refunds, and answer support requests. We never see your full card details.
        </li>
        <li>We don&rsquo;t sell your personal data.</li>
      </ul>

      <h2>Your choices</h2>
      <p>
        To ask what order data we hold about you, or to have it deleted, email us. We may need to keep some records
        where the law requires it, such as tax records.
      </p>

      <h2>Changes</h2>
      <p>If we change this policy, we&rsquo;ll update the date at the top of this page.</p>

      <h2>Contact</h2>
      <p>Privacy questions: <Email /></p>
    </LegalLayout>
  )
}
