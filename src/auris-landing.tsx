import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AurisLanding: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const navigate = useNavigate()

  // Nav scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll reveal observer
  useEffect(() => {
    const reveals = document.querySelectorAll('.auris-reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('auris-visible'), i * 80)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    reveals.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqData = [
    {
      q: 'Do I need an API key to use Auris?',
      a: "For voice, no \u2014 speech recognition and TTS run entirely inside your browser. For AI summarization and intent understanding, it depends on your provider. Claude, OpenAI, Gemini, and cloud providers require an API key. Ollama and LM Studio run locally with no key needed. Keys are stored in Chrome\u2019s encrypted local storage \u2014 Auris never sees them.",
    },
    {
      q: 'Which AI provider should I use?',
      a: 'Depends on your priorities. Ollama or LM Studio \u2014 fully local, zero cost, full privacy. Claude or OpenAI \u2014 best summarization quality. Gemini \u2014 great if you\u2019re already in the Google ecosystem. Groq or DeepSeek \u2014 fast and cheap cloud inference. Auris supports 10 presets and lets you switch anytime from the settings panel.',
    },
    {
      q: 'Does my voice get sent to any server?',
      a: 'Never. Speech recognition and TTS run entirely inside your Chrome browser \u2014 nothing leaves your machine. The only network call Auris makes is sending the text summary to your chosen AI provider. If you use Ollama or LM Studio, even that stays fully on-device. No analytics, no telemetry, no account required.',
    },
    {
      q: 'How large is the first download?',
      a: "On first install, Auris downloads its local voice models \u2014 around 113MB total. This is a one-time download cached in your browser forever. If the local models fail for any reason, Auris automatically falls back to the browser\u2019s built-in Web Speech API.",
    },
    {
      q: 'What languages does voice support?',
      a: 'Auris ships with 50+ voices across 10 languages: American English, British English, Japanese, Mandarin, Korean, French, Hindi, Italian, Brazilian Portuguese, and Spanish. The voice picker is organized by language, with gender indicators per voice. Speech recognition is English-first in V1, with multilingual STT on the V2 roadmap.',
    },
    {
      q: 'Does it only work with Claude Code?',
      a: 'V1 is focused entirely on claude.ai \u2014 the web interface for Claude Code. Auris watches the DOM, classifies every output, and never modifies the page. Support for other AI coding tools (Cursor, Windsurf, GitHub Copilot) is planned for V2.',
    },
  ]

  const howItWorksCards = [
    {
      icon: '\uD83D\uDC41',
      title: 'Auris watches Claude',
      desc: 'A smart observer monitors claude.ai in real time, detecting every new output the moment Claude finishes streaming \u2014 errors, plans, permissions, completions and more.',
    },
    {
      icon: '\uD83D\uDD0A',
      title: 'Reads it aloud',
      desc: 'Auris converts the output to natural speech and plays it through your headphones \u2014 entirely on your machine. No cloud, no round-trips, no audio ever leaving your device.',
    },
    {
      icon: '\uD83C\uDF99',
      title: 'You reply by voice',
      desc: 'Your voice is transcribed instantly, right inside your browser \u2014 no servers, no cloud APIs. Say "yes", "explain that", "option A", or anything natural \u2014 Auris understands.',
    },
    {
      icon: '\uD83E\uDDE0',
      title: 'Intent understood',
      desc: 'A fast rule engine catches common commands instantly. Anything more nuanced is handled by your connected AI provider \u2014 Claude, OpenAI, Gemini, Ollama, or LM Studio. Your model, your choice, your data.',
    },
  ]

  const outputTypes = [
    { color: '#f87171', label: 'Errors & Exceptions' },
    { color: '#60a5fa', label: 'Code Plans' },
    { color: '#fbbf24', label: 'Permission Requests' },
    { color: '#34d399', label: 'Code Completions' },
    { color: '#7b6cff', label: 'Web Search Results' },
    { color: '#a78bfa', label: 'Option Selections' },
    { color: '#f472b6', label: 'File Changes' },
    { color: '#34d399', label: 'Test Results' },
    { color: '#fb923c', label: 'Follow-up Questions' },
    { color: '#5a5a7a', label: 'General Responses' },
  ]

  const providers = [
    { color: '#f59e0b', label: 'Claude' },
    { color: '#10b981', label: 'OpenAI' },
    { color: '#60a5fa', label: 'Gemini' },
    { color: '#7b6cff', label: 'Ollama' },
    { color: '#ec4899', label: 'LM Studio' },
    { color: '#f59e0b', label: 'Groq' },
    { color: '#06b6d4', label: 'DeepSeek' },
    { color: '#6366f1', label: 'Mistral' },
    { color: '#84cc16', label: 'xAI / Grok' },
    { color: '#5a5a7a', label: 'Custom' },
  ]

  const features = [
    {
      icon: '\uD83D\uDD12',
      title: '100% On-device Voice',
      desc: 'All voice processing runs directly inside your browser \u2014 nothing recorded, nothing uploaded, nothing sent anywhere. Falls back to Web Speech API if needed.',
    },
    {
      icon: '\uD83E\uDDE9',
      title: '10 AI Provider Presets',
      desc: 'Claude, OpenAI, Gemini, Ollama, LM Studio, Groq, DeepSeek, Mistral, xAI, and Custom. Selecting a preset auto-fills the URL and model defaults. Switch anytime.',
    },
    {
      icon: '\uD83C\uDFAD',
      title: '8 Voice Personas',
      desc: 'Choose how Auris talks \u2014 Professional, Friendly, Concise, Encouraging, Zen, Comedic, Sarcastic, or Pirate. Your assistant, your tone.',
    },
    {
      icon: '\uD83C\uDF0D',
      title: '50+ Voices, 10 Languages',
      desc: 'Pick from 50+ Kokoro voices across American English, British English, Japanese, Mandarin, Korean, French, Hindi, Italian, Portuguese, and Spanish.',
    },
    {
      icon: '\u26A1',
      title: 'Instant Command Engine',
      desc: 'Built-in rule engine catches "yes", "no", "skip", "repeat", "option A", "save" instantly \u2014 zero API call. Anything more nuanced falls back to your AI provider.',
    },
    {
      icon: '\uD83C\uDF9A',
      title: 'Verbosity Per Output Type',
      desc: 'Set Brief, Normal, or Detailed summaries per output type. Errors get full detail; completions stay quick. Specialized AI prompts per output category.',
    },
    {
      icon: '\uD83C\uDF99',
      title: 'Push-to-Talk & DND',
      desc: 'Bind any key as push-to-talk. Enable Do Not Disturb to silence Auris while you\u2019re heads-down. Toggle auto-read or trigger manually per output.',
    },
    {
      icon: '\uD83D\uDCC1',
      title: 'Session History',
      desc: 'Every output and conversation saved locally. Configurable max sessions, auto-clear after N days. Export as Markdown or JSON.',
    },
    {
      icon: '\u2699\uFE0F',
      title: 'Full Settings Portability',
      desc: 'Export and import your entire Auris config as JSON. Test your provider connection and browse available models from the settings panel.',
    },
  ]

  const privacyItems = [
    {
      icon: '\uD83C\uDF99',
      title: 'Voice stays local',
      desc: 'All voice processing runs entirely inside your browser \u2014 on your device, on your terms. Zero audio data sent anywhere.',
    },
    {
      icon: '\uD83D\uDD11',
      title: 'You own the keys',
      desc: 'Bring your own API key or local model. Auris never proxies your requests or stores your credentials.',
    },
    {
      icon: '\uD83D\uDCCA',
      title: 'Zero telemetry',
      desc: 'No analytics, no tracking, no account required. Your coding sessions are yours.',
    },
    {
      icon: '\uD83C\uDF10',
      title: 'Works offline',
      desc: 'Voice processing needs no internet. Pair with Ollama or LM Studio for a fully air-gapped setup.',
    },
  ]

  const pricingFeatures = [
    'On-device voice \u2014 50+ voices, 10 languages',
    'All 10 Claude output types, classified & spoken',
    'AI-powered summaries with specialized prompts per type',
    '10 AI provider presets \u2014 Claude, OpenAI, Gemini, Ollama, LM Studio & more',
    '8 voice personas \u2014 Professional, Friendly, Concise, Pirate, and more',
    '3 verbosity levels \u2014 Brief, Normal, Detailed',
    'Instant rule engine + natural language fallback',
    'Push-to-talk key binding & Do Not Disturb mode',
    'Session history with auto-clear & export (MD / JSON)',
    'Settings import / export',
    'Web Speech API fallback if local models fail',
    'Zero telemetry \u00B7 Read-only page access \u00B7 All future V1 updates',
  ]

  // Waveform bars data
  const waveformBars = Array.from({ length: 12 }, (_, i) => i)

  return (
    <div className="auris-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&family=DM+Sans:ital,wght@0,300;0,400;1,300&display=swap');

        .auris-page {
          --bg: #09090f;
          --surface: #0f0f1a;
          --border: #1e1e32;
          --muted: #5a5a7a;
          --subtle: #8888aa;
          --body: #c4c4d8;
          --bright: #eeeef8;
          --accent: #7b6cff;
          --accent2: #a78bfa;
          --green: #34d399;
          --red: #f87171;
          --yellow: #fbbf24;
          --blue: #60a5fa;

          background: var(--bg);
          color: var(--body);
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        /* Noise texture overlay */
        .auris-page::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        /* Ambient glow */
        .auris-glow {
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(123,108,255,0.15) 0%, transparent 70%);
          pointer-events: none;
          animation: breathe 8s ease-in-out infinite;
        }

        @keyframes breathe {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
          50%       { opacity: 1;   transform: translateX(-50%) scale(1.1); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }

        @keyframes wave {
          0%, 100% { height: 6px; }
          50%       { height: 22px; }
        }

        @keyframes micPulse {
          0%, 100% { box-shadow: 0 0 16px rgba(123,108,255,0.4); }
          50%       { box-shadow: 0 0 28px rgba(123,108,255,0.7); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .auris-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .auris-reveal.auris-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .auris-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s;
        }
        .auris-nav.scrolled {
          background: rgba(15,15,26,0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }

        .auris-hero-badge { animation: fadeUp 0.6s ease both; animation-delay: 0s; }
        .auris-hero-h1 { animation: fadeUp 0.6s ease both; animation-delay: 0.1s; }
        .auris-hero-tagline { animation: fadeUp 0.6s ease both; animation-delay: 0.2s; }
        .auris-hero-ctas { animation: fadeUp 0.6s ease both; animation-delay: 0.3s; }
        .auris-hero-price { animation: fadeUp 0.6s ease both; animation-delay: 0.4s; }
        .auris-hero-demo { animation: fadeUp 0.6s ease both; animation-delay: 0.5s; }

        .auris-wave-bar {
          width: 3px;
          border-radius: 2px;
          background: var(--accent);
          animation: wave 0.8s ease-in-out infinite;
        }

        .auris-mic-btn {
          animation: micPulse 2s ease-in-out infinite;
        }

        .auris-badge-dot {
          animation: pulse 2s ease-in-out infinite;
        }

        .auris-gradient-text {
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .auris-btn-primary {
          background: var(--accent);
          color: #fff;
          padding: 14px 32px;
          border-radius: 10px;
          font-family: 'DM Mono', monospace;
          font-weight: 400;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 0 24px rgba(123,108,255,0.3);
          text-decoration: none;
          display: inline-block;
        }
        .auris-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 32px rgba(123,108,255,0.5);
        }

        .auris-btn-ghost {
          background: transparent;
          color: var(--body);
          padding: 14px 32px;
          border-radius: 10px;
          font-family: 'DM Mono', monospace;
          font-weight: 400;
          font-size: 15px;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .auris-btn-ghost:hover {
          border-color: var(--accent);
          color: var(--bright);
        }

        .auris-section-label {
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--accent);
          margin-bottom: 12px;
        }
        .auris-section-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          color: var(--bright);
          margin-bottom: 16px;
          line-height: 1.15;
        }
        .auris-section-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          color: var(--subtle);
          max-width: 600px;
          margin: 0 auto 48px;
          font-size: 16px;
          line-height: 1.6;
        }

        /* FAQ */
        .auris-faq-item {
          border-bottom: 1px solid var(--border);
        }
        .auris-faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 20px 0;
          background: none;
          border: none;
          color: var(--bright);
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          text-align: left;
        }
        .auris-faq-question:hover { color: var(--accent2); }
        .auris-faq-arrow {
          transition: transform 0.3s;
          color: var(--muted);
          flex-shrink: 0;
          margin-left: 16px;
        }
        .auris-faq-arrow.open { transform: rotate(180deg); }
        .auris-faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, padding 0.3s ease;
        }
        .auris-faq-answer.open {
          max-height: 300px;
          padding-bottom: 20px;
        }
        .auris-faq-answer p {
          color: var(--subtle);
          font-size: 15px;
          line-height: 1.7;
        }

        /* Feature grid */
        .auris-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }
        .auris-feature-cell {
          background: var(--bg);
          padding: 32px 28px;
          transition: background 0.2s;
        }
        .auris-feature-cell:hover { background: var(--surface); }

        @media (max-width: 900px) {
          .auris-feature-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .auris-feature-grid { grid-template-columns: 1fr; }
          .auris-pricing-inner { flex-direction: column !important; }
          .auris-pricing-left { border-right: none !important; border-bottom: 1px solid var(--border) !important; padding-bottom: 32px !important; margin-bottom: 32px !important; width: 100% !important; }
          .auris-nav-links { display: none !important; }
          .auris-hero-h1-text { font-size: 2.8rem !important; }
          .auris-demo-window { padding: 16px !important; }
        }
      `}</style>

      {/* Ambient Glow */}
      <div className="auris-glow" />

      {/* NAV */}
      <nav className={`auris-nav ${scrolled ? 'scrolled' : ''}`}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--accent)' }}>&#x25C8;</span>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--bright)' }}>Auris</span>
          </div>
          <div className="auris-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <a href="#how" style={{ color: 'var(--subtle)', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 14, transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--bright)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--subtle)')}>How it works</a>
            <a href="#features" style={{ color: 'var(--subtle)', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 14, transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--bright)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--subtle)')}>Features</a>
            <a href="#pricing" style={{ color: 'var(--subtle)', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: 14, transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--bright)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--subtle)')}>Pricing</a>
            <a href="#" className="auris-btn-primary" style={{ padding: '10px 20px', fontSize: 13 }}>Get Auris &mdash; $29</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="auris-hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', position: 'relative' }}>
        {/* Badge pill */}
        <div className="auris-hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', border: '1px solid var(--border)', borderRadius: 999, background: 'rgba(123,108,255,0.06)', marginBottom: 32 }}>
          <span className="auris-badge-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--subtle)' }}>Chrome Extension &middot; claude.ai &middot; On-device Voice</span>
        </div>

        {/* Headline */}
        <h1 className="auris-hero-h1" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1.05, color: 'var(--bright)', margin: '0 0 24px' }}>
          <span className="auris-hero-h1-text">Your AI,<br /><span className="auris-gradient-text">out loud.</span></span>
        </h1>

        {/* Tagline */}
        <p className="auris-hero-tagline" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300, fontStyle: 'italic', color: 'var(--muted)', maxWidth: 560, fontSize: 18, lineHeight: 1.6, margin: '0 auto 40px' }}>
          An AI voice assistant for your AI coding assistant &mdash; keeping you in flow.
        </p>

        {/* CTAs */}
        <div className="auris-hero-ctas" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
          <a href="#" className="auris-btn-primary">Get Auris &mdash; $29</a>
          <a href="#how" className="auris-btn-ghost">See how it works &rarr;</a>
        </div>

        {/* Price hint */}
        <p className="auris-hero-price" style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--muted)', marginBottom: 60 }}>
          <span style={{ color: 'var(--green)' }}>$29 one-time</span> &middot; No subscription &middot; No recurring fees &middot; BYOK
        </p>

        {/* Demo UI */}
        <div className="auris-hero-demo auris-demo-window" style={{ maxWidth: 640, width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', textAlign: 'left', padding: 0 }}>
          {/* Title bar */}
          <div style={{ borderBottom: '1px solid var(--border)', padding: '14px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f87171' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#fbbf24' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#34d399' }} />
              </div>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--subtle)', marginLeft: 8 }}>
                Auris &middot; <span style={{ color: 'var(--green)' }}>&bull;</span> claude-sonnet-4-5 &middot; connected
              </span>
            </div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--muted)' }}>
              repo <span style={{ color: 'var(--subtle)' }}>acme-app</span> &middot; &#x23C7; <span style={{ color: 'var(--yellow)' }}>fix/auth-null-check</span> &middot; # <span style={{ color: 'var(--accent)' }}>auth-refactor-03</span>
            </div>
          </div>

          {/* Demo body */}
          <div style={{ padding: '20px' }}>
            {/* Error output card */}
            <div style={{ borderLeft: '3px solid var(--red)', background: 'rgba(248,113,113,0.04)', borderRadius: '0 8px 8px 0', padding: '14px 18px', marginBottom: 16 }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--red)', marginBottom: 6, fontWeight: 400 }}>&bull; Error Detected</div>
              <p style={{ fontSize: 13, color: 'var(--body)', lineHeight: 1.5, margin: 0 }}>
                &quot;Null pointer exception on line 42 of auth.ts &mdash; the user object isn&apos;t being checked before accessing its token property. Want me to explain the fix?&quot;
              </p>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>auris heard you</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            {/* Voice bar */}
            <div style={{ background: 'rgba(123,108,255,0.06)', border: '1px solid rgba(123,108,255,0.15)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <button className="auris-mic-btn" style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <span style={{ fontSize: 16 }}>&#x1F399;</span>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 28 }}>
                {waveformBars.map((_, i) => (
                  <div key={i} className="auris-wave-bar" style={{ animationDelay: `${(i * 0.03).toFixed(2)}s` }} />
                ))}
              </div>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--subtle)', marginLeft: 'auto', fontStyle: 'italic' }}>&quot;yeah go ahead and fix it&quot;</span>
            </div>

            {/* Code plan card */}
            <div style={{ borderLeft: '3px solid var(--blue)', background: 'rgba(96,165,250,0.04)', borderRadius: '0 8px 8px 0', padding: '14px 18px', marginBottom: 12 }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--blue)', marginBottom: 6, fontWeight: 400 }}>&bull; Code Plan</div>
              <p style={{ fontSize: 13, color: 'var(--body)', lineHeight: 1.5, margin: 0 }}>
                &quot;Got it. I&apos;ll add a null check before accessing user.token, then update the type signature. 2 files will change.&quot;
              </p>
            </div>

            {/* Permission request card */}
            <div style={{ borderLeft: '3px solid var(--yellow)', background: 'rgba(251,191,36,0.04)', borderRadius: '0 8px 8px 0', padding: '14px 18px' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--yellow)', marginBottom: 6, fontWeight: 400 }}>&bull; Permission Request</div>
              <p style={{ fontSize: 13, color: 'var(--body)', lineHeight: 1.5, margin: 0 }}>
                &quot;Shall I also update the test suite to cover the null case? This will modify auth.test.ts.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="auris-section-label auris-reveal">How it works</div>
          <h2 className="auris-section-title auris-reveal">Claude talks. You listen. You talk back.</h2>
          <p className="auris-section-subtitle auris-reveal">
            Auris sits between you and Claude &mdash; reading every output aloud and understanding everything you say back.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {howItWorksCards.map((card, i) => (
            <div key={i} className="auris-reveal" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '32px 28px', position: 'relative', overflow: 'hidden', transition: 'transform 0.2s, border-color 0.3s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              <span style={{ position: 'absolute', top: -8, right: 12, fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 96, color: 'var(--border)', lineHeight: 1, pointerEvents: 'none' }}>{i + 1}</span>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{card.icon}</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--bright)', marginBottom: 10 }}>{card.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--subtle)', lineHeight: 1.6 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT AURIS READS ALOUD */}
      <section id="outputs" style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="auris-section-label auris-reveal">What Auris reads aloud</div>
          <h2 className="auris-section-title auris-reveal">Every output. Classified. Spoken.</h2>
          <p className="auris-section-subtitle auris-reveal">
            Auris doesn&apos;t just read text &mdash; it knows what type of output Claude produced and announces it with context.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {outputTypes.map((item, i) => (
            <div key={i} className="auris-reveal" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, transition: 'border-color 0.2s, color 0.2s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(136,136,170,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: 'var(--body)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PROVIDERS STRIP */}
      <section style={{ padding: '48px 24px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <p className="auris-reveal" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--muted)', marginBottom: 20 }}>Works with your preferred AI provider &mdash; 10 presets built in</p>
        <div className="auris-reveal" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
          {providers.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--border)', transition: 'border-color 0.2s', cursor: 'default' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.color }} />
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--body)' }}>{p.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="auris-section-label auris-reveal">Features</div>
          <h2 className="auris-section-title auris-reveal">Built for deep work.</h2>
          <p className="auris-section-subtitle auris-reveal">
            Every feature designed around one goal &mdash; keeping developers in flow.
          </p>
        </div>
        <div className="auris-feature-grid auris-reveal">
          {features.map((f, i) => (
            <div key={i} className="auris-feature-cell">
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--bright)', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--subtle)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRIVACY STRIP */}
      <section style={{ padding: '64px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32, textAlign: 'center' }}>
          {privacyItems.map((item, i) => (
            <div key={i} className="auris-reveal">
              <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--bright)', marginBottom: 6 }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--subtle)', lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <div className="auris-section-label auris-reveal">Pricing</div>
        <h2 className="auris-section-title auris-reveal">Pay once. Yours forever.</h2>
        <p className="auris-section-subtitle auris-reveal">No subscription. No usage fees. No server costs passed to you.</p>

        <div className="auris-reveal" style={{ maxWidth: 780, margin: '0 auto', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div className="auris-pricing-inner" style={{ display: 'flex' }}>
            {/* Left column */}
            <div className="auris-pricing-left" style={{ width: 280, flexShrink: 0, padding: '40px 32px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--accent)', marginBottom: 12 }}>Auris</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 36, color: 'var(--bright)', marginBottom: 8 }}>$29 <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--muted)', fontFamily: 'DM Sans, sans-serif' }}>one-time</span></div>
              <p style={{ fontSize: 13, color: 'var(--subtle)', marginBottom: 28, lineHeight: 1.5 }}>Lifetime access &middot; No subscription &middot; Yours forever</p>
              <a href="#" className="auris-btn-primary" style={{ textAlign: 'center', marginBottom: 12 }}>Get Auris &mdash; $29</a>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>&#x1F512; Secure checkout via Lemon Squeezy</p>
            </div>
            {/* Right column */}
            <div style={{ flex: 1, padding: '36px 32px', textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {pricingFeatures.map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: 14, lineHeight: '20px', flexShrink: 0 }}>&#x2713;</span>
                    <span style={{ fontSize: 14, color: 'var(--body)', lineHeight: '20px' }}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '100px 24px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="auris-section-label auris-reveal">FAQ</div>
          <h2 className="auris-section-title auris-reveal">Common questions</h2>
        </div>
        <div className="auris-reveal" style={{ marginTop: 40 }}>
          {faqData.map((item, i) => (
            <div key={i} className="auris-faq-item">
              <button className="auris-faq-question" onClick={() => toggleFaq(i)}>
                {item.q}
                <span className={`auris-faq-arrow ${openFaq === i ? 'open' : ''}`}>&#x25BC;</span>
              </button>
              <div className={`auris-faq-answer ${openFaq === i ? 'open' : ''}`}>
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--accent)' }}>&#x25C8;</span>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--bright)' }}>Auris</span>
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300, fontStyle: 'italic', fontSize: 14, color: 'var(--muted)', maxWidth: 480, margin: '0 auto' }}>
          An AI voice assistant for your AI coding assistant &mdash; keeping you in flow.
        </p>
      </footer>
    </div>
  )
}

export default AurisLanding
