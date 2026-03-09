import React, { useState, useEffect, useRef, useCallback } from 'react'

const AurisLanding: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [atBottom, setAtBottom] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const slideTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchXRef = useRef(0)

  const scrollToNextSection = useCallback(() => {
    const ids = ['hero', 'how', 'outputs', 'voice-commands', 'providers', 'features', 'personas', 'privacy', 'pricing', 'faq']
    const scrollY = window.scrollY
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY
        if (top > scrollY + 80) {
          el.scrollIntoView({ behavior: 'smooth' })
          return
        }
      }
    }
  }, [])

  const totalSlides = 12
  const [personaSlide, setPersonaSlide] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const startAutoSlide = useCallback(() => {
    if (slideTimerRef.current) clearInterval(slideTimerRef.current)
    slideTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 4500)
  }, [])

  const goToSlide = useCallback((idx: number, resetTimer = true) => {
    setCurrentSlide(((idx % totalSlides) + totalSlides) % totalSlides)
    if (resetTimer) startAutoSlide()
  }, [startAutoSlide])

  // Nav scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
      setShowScrollTop(window.scrollY > 600)
      setAtBottom(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Start slideshow auto-play
  useEffect(() => {
    startAutoSlide()
    return () => { if (slideTimerRef.current) clearInterval(slideTimerRef.current) }
  }, [startAutoSlide])

  // Persona slideshow auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setPersonaSlide((prev) => (prev + 1) % 8)
    }, 5000)
    return () => clearInterval(timer)
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

  const slides = [
    { type: 't-error', label: 'Error & Exception', text: "Null pointer exception on line 42 of auth.ts \u2014 the user object isn't being checked before accessing its token property.", transcript: '"yeah fix it"' },
    { type: 't-plan', label: 'Code Plan', text: "I'll add a null check before accessing user.token, update the type signature to reflect that user may be undefined, and adjust the downstream callers. 3 files will change.", transcript: '"sounds good, go ahead"' },
    { type: 't-permission', label: 'Permission Request', text: 'Shall I also update the test suite to cover the null case? This will modify auth.test.ts and add 2 new test cases.', transcript: '"yes, update the tests"' },
    { type: 't-completion', label: 'Code Completion', text: 'Done. Updated auth.ts with a null guard, adjusted the AuthService type, and added 2 passing test cases in auth.test.ts. All existing tests still pass.', transcript: '"save this session"' },
    { type: 't-search', label: 'Web Search Result', text: 'Found 3 relevant results for "Next.js 14 server actions form validation". The top result from the official docs covers the useFormState hook introduced in Next.js 14.1.', transcript: '"open the first one"' },
    { type: 't-option', label: 'Option Selection', text: 'There are 3 ways to handle this: A) Throw early with a descriptive error, B) Return a nullable type and let callers decide, or C) Use a Result type pattern. Which do you prefer?', transcript: '"option B"' },
    { type: 't-file', label: 'File Change', text: 'Modified src/services/auth.ts \u2014 removed the non-null assertion on line 42, updated the return type from User to User | null, and added an early return guard.', transcript: '"what else changed?"' },
    { type: 't-test', label: 'Test Result', text: 'All 47 tests passed in 3.2 seconds. 2 new tests added for the null user case. No regressions detected. Coverage increased from 84% to 87%.', transcript: '"nice, commit it"' },
    { type: 't-followup', label: 'Follow-up Question', text: 'Should I also update the API route handlers that call this function? They may need to handle the null case explicitly before sending a response to the client.', transcript: '"yes, handle the null"' },
    { type: 't-general', label: 'General Response', text: "The pattern you're using is a common defensive programming technique. Returning null or undefined is idiomatic in TypeScript when a value is genuinely optional, and it pushes error handling to the caller where it belongs.", transcript: '"got it, skip"' },
    { type: 't-instruct', label: 'Voice Command to Claude', text: 'You said: "Tell Claude to fix the auth bug in the login component." Auris will send this to Claude Code. Say "send" to confirm or "cancel" to discard.', transcript: '"send"' },
    { type: 't-status', label: 'Status Query', text: 'Session active for 24 minutes. Last 3 outputs: test results (all passed), file change (auth.ts), and a follow-up question. 0 errors. 0 pending permissions.', transcript: '"what\'s happening?"' },
  ]

  const faqData = [
    {
      q: 'How do I install Auris?',
      a: 'Auris is a Chrome extension. Install it from the Chrome Web Store with one click — no sign-up, no account, no configuration required. Once installed, open Claude Code for Web (claude.ai) and Auris activates automatically. The extension icon in your toolbar lets you access settings, switch personas, and control voice output.',
    },
    {
      q: 'Do I need an API key to use Auris?',
      a: "For voice, no \u2014 speech recognition and text-to-speech run entirely inside your browser with zero API keys. For AI summarization and intent understanding, it depends on your provider. Claude, OpenAI, Gemini, Groq, and cloud providers require their respective API key. Ollama and LM Studio run locally and need no key at all. Keys are stored in Chrome\u2019s encrypted local storage \u2014 Auris never sees them.",
    },
    {
      q: 'Which AI provider should I use?',
      a: 'It depends on your priorities. Ollama or LM Studio \u2014 fully local, zero API cost, full privacy. Claude or OpenAI \u2014 best summarization quality via API. Gemini \u2014 great if you\u2019re already in the Google ecosystem. Groq or DeepSeek \u2014 fast and cheap cloud inference. Auris supports 10 presets and lets you switch providers anytime from the settings panel.',
    },
    {
      q: 'Does my voice get sent to any server?',
      a: 'Never. Speech recognition and text-to-speech run entirely inside your Chrome browser \u2014 nothing leaves your machine. The only network call Auris makes is sending the text summary to your chosen AI provider. If you use Ollama or LM Studio, even that stays fully on-device. Auris has no analytics, no telemetry, and no account system.',
    },
    {
      q: 'How large is the first download?',
      a: "On first install, Auris downloads its local voice models \u2014 around 113MB total. This is a one-time download cached in your browser forever. After that, everything is instant. If the local models fail for any reason, Auris automatically falls back to the browser\u2019s built-in Web Speech API.",
    },
    {
      q: 'What languages does Auris support?',
      a: 'V1 supports English only — both text-to-speech and speech recognition are optimized for English. Multi-language support is on the roadmap for a future release.',
    },
    {
      q: 'Does it only work with Claude Code for Web?',
      a: 'V1 is focused entirely on Claude Code for Web (claude.ai). Auris watches the DOM, classifies every output, and never modifies the page. Support for other web AI coding tools is planned for V2.',
    },
    {
      q: 'Can I send commands to Claude by voice?',
      a: 'Yes. Say "Tell Claude to..." or "Ask Claude..." followed by your instruction. Auris transcribes your command, optionally reads it back for confirmation, and sends it directly to Claude Code. You can also enable auto-submit to skip the confirmation step. A 5-second cooldown prevents accidental spam.',
    },
    {
      q: 'Can I check what Claude is doing without looking at the screen?',
      a: 'Yes. Say "What\u2019s happening?" for a quick status update, "What did I miss?" for a summary since your last interaction, "Any errors?" for an error count, or "How long?" for session duration. Auris answers from session context \u2014 no screen needed.',
    },
  ]

  const howItWorksCards = [
    {
      icon: '\uD83D\uDC41',
      title: 'Auris watches Claude Code',
      desc: 'A smart observer monitors Claude Code for Web in real time, detecting every new output the moment it finishes streaming \u2014 classifying it into one of 10 types: errors, plans, permissions, completions, and more.',
    },
    {
      icon: '\uD83D\uDD0A',
      title: 'Summarizes & reads it aloud',
      desc: 'Your AI provider summarizes the output using a specialized prompt for that type. Then Auris reads it aloud \u2014 entirely on your machine, in whichever of the 50+ voices and 8 personas you\u2019ve chosen.',
    },
    {
      icon: '\uD83C\uDF99',
      title: 'You talk back \u2014 or talk first',
      desc: 'Reply to Claude\u2019s output with "yes", "option A", or "skip". Or instruct Claude directly \u2014 "Tell Claude to fix the auth bug", "Ask Claude how to optimize this query". Your voice is transcribed instantly, right inside your browser \u2014 no servers, no cloud.',
    },
    {
      icon: '\uD83E\uDDE0',
      title: 'Intent understood. Action taken.',
      desc: 'A built-in rule engine catches common commands instantly \u2014 yes, no, skip, repeat, save. Voice-to-Claude commands get confirmed and sent. Status queries like "What\u2019s happening?" or "Any errors?" are answered on the spot. Anything more nuanced goes to your AI provider.',
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
    { color: '#d97706', label: 'Claude' },
    { color: '#10b981', label: 'OpenAI' },
    { color: '#3b82f6', label: 'Gemini' },
    { color: '#8b5cf6', label: 'Ollama' },
    { color: '#ec4899', label: 'LM Studio' },
    { color: '#f59e0b', label: 'Groq' },
    { color: '#06b6d4', label: 'DeepSeek' },
    { color: '#6366f1', label: 'Mistral' },
    { color: '#84cc16', label: 'xAI / Grok' },
    { color: '#5a5a7a', label: 'Custom' },
  ]

  const features = [
    { icon: '\uD83D\uDD12', title: '100% On-device Voice', desc: 'All voice processing runs directly inside your browser \u2014 nothing recorded, nothing uploaded, nothing sent anywhere. Falls back to Web Speech API if needed.' },
    { icon: '\uD83E\uDDE9', title: '10 AI Provider Presets', desc: 'Claude, OpenAI, Gemini, Ollama, LM Studio, Groq, DeepSeek, Mistral, xAI, and more. Selecting a preset auto-fills the URL and model defaults. Switch anytime.' },
    { icon: '\uD83C\uDFAD', title: '8 Voice Personas', desc: 'Choose how Auris talks to you \u2014 Professional, Friendly, Concise, Encouraging, Zen, Comedic, Sarcastic, or Pirate. Your assistant, your tone.' },
    { icon: '\uD83C\uDF0D', title: 'Multiple Voice Options', desc: 'Pick from a variety of natural-sounding English voices with different tones and styles. Multi-language support coming in a future release.' },
    { icon: '\u26A1', title: 'Instant Command Engine', desc: 'A built-in rule engine catches "yes", "no", "skip", "repeat", "option A", "save" \u2014 instantly, no API call. Anything more nuanced falls back to your AI provider.' },
    { icon: '\uD83D\uDCAC', title: 'Voice-to-Claude Commands', desc: 'Speak directly to Claude Code \u2014 "Tell Claude to fix the auth bug" or "Ask Claude how to optimize this". Optional confirmation flow before sending. Auto-submit available.' },
    { icon: '\uD83D\uDCE1', title: 'Hands-free Status Queries', desc: 'Ask "What\u2019s happening?", "Any errors?", "Pending permissions?", or "What did I miss?" \u2014 Auris answers instantly from session context, no screen required.' },
    { icon: '\uD83D\uDEE1', title: 'Confirmation Before Send', desc: 'Auris reads back your command before sending to Claude. Say "send" to confirm, "cancel" to discard. Disable confirmation or enable auto-submit from settings.' },
    { icon: '\uD83C\uDF9A', title: 'Verbosity + Personas per Type', desc: 'Set Brief, Normal, or Detailed summaries per output type. Errors get full detail; completions stay quick. Specialized AI prompts per output category.' },
    { icon: '\uD83C\uDF99', title: '"Hey Auris" Wake Word', desc: 'Activate Auris hands-free with a customizable wake word like "Hey Auris" — no buttons needed.' },
    { icon: '\uD83D\uDCC1', title: 'Session History', desc: 'Every output and conversation saved locally. Configurable max sessions, auto-clear after N days. Export as Markdown or JSON.' },
    { icon: '\u2699\uFE0F', title: 'Full Settings Portability', desc: 'Export and import your entire Auris config as JSON. Test your provider connection and browse available models \u2014 all from the settings panel.' },
  ]

  const privacyItems = [
    { icon: '\uD83C\uDF99', title: 'Voice stays local', desc: 'All voice processing runs entirely inside your browser \u2014 on your device, on your terms. Zero audio data sent anywhere.' },
    { icon: '\uD83D\uDD11', title: 'You own the keys', desc: 'Bring your own API key or local model. Auris never proxies your requests or stores your credentials.' },
    { icon: '\uD83D\uDCCA', title: 'Zero telemetry', desc: 'No analytics, no tracking, no account required. Your coding sessions are yours.' },
    { icon: '\uD83C\uDF10', title: 'Works offline', desc: 'Voice processing needs no internet. Pair with Ollama or LM Studio for a fully air-gapped setup.' },
  ]

  const pricingFeatures = [
    'On-device voice \u2014 multiple English voices',
    'All 10 Claude Code output types, classified & spoken',
    'AI-powered summaries with specialized prompts per type',
    '10 AI provider presets \u2014 Claude, OpenAI, Gemini, Ollama, LM Studio & more',
    '8 voice personas \u2014 Professional, Friendly, Concise, Pirate, and more',
    '3 verbosity levels \u2014 Brief, Normal, Detailed',
    'Instant rule engine + natural language fallback',
    'Voice-to-Claude commands \u2014 speak instructions directly to Claude Code',
    'Hands-free status queries \u2014 "What\u2019s happening?", "Any errors?", and more',
    'Customizable "Hey Auris" wake word for hands-free activation',
    'Session history with auto-clear & export (MD / JSON)',
    'Settings import / export',
    'Web Speech API fallback if local models fail',
    'Zero telemetry \u00B7 Non-intrusive page access \u00B7 All future updates',
  ]

  const waveformBars = Array.from({ length: 10 }, (_, i) => i)

  // Slide type to color map
  const slideColors: Record<string, string> = {
    't-error': '#f87171', 't-plan': '#60a5fa', 't-permission': '#fbbf24',
    't-completion': '#34d399', 't-search': '#7b6cff', 't-option': '#a78bfa',
    't-file': '#f472b6', 't-test': '#34d399', 't-followup': '#fb923c',
    't-general': '#94a3b8',
    't-instruct': '#06b6d4',
    't-status': '#f59e0b',
  }

  const slideColorBg: Record<string, string> = {
    't-error': 'rgba(248,113,113,0.07)', 't-plan': 'rgba(96,165,250,0.07)',
    't-permission': 'rgba(251,191,36,0.07)', 't-completion': 'rgba(52,211,153,0.07)',
    't-search': 'rgba(123,108,255,0.07)', 't-option': 'rgba(167,139,250,0.07)',
    't-file': 'rgba(244,114,182,0.07)', 't-test': 'rgba(52,211,153,0.07)',
    't-followup': 'rgba(251,146,60,0.07)', 't-general': 'rgba(148,163,184,0.07)',
    't-instruct': 'rgba(6,182,212,0.07)', 't-status': 'rgba(245,158,11,0.07)',
  }

  const personas = [
    { emoji: '\uD83D\uDC54', name: 'Professional', tag: 'Default', desc: 'Clear, direct, no filler. Gets to the point fast.', example: "Null pointer on line 42 of auth.ts. The user object isn\u2019t checked before accessing its token property. Recommend adding a null guard." },
    { emoji: '\uD83D\uDE04', name: 'Friendly', desc: 'Warm and approachable. Like pair-programming with a patient colleague.', example: "Hey, looks like there\u2019s a null pointer issue on line 42 of auth.ts. The user object might not exist when we try to grab the token. Easy fix though \u2014 just need a quick null check!" },
    { emoji: '\u26A1', name: 'Concise', desc: 'Minimal words, maximum signal. For when you just need the facts.', example: 'Null pointer, auth.ts line 42. Missing null check on user object.' },
    { emoji: '\uD83E\uDDD8', name: 'Zen', desc: 'Calm and measured. Keeps stress low during tough debugging sessions.', example: "A small issue has surfaced on line 42 of auth.ts. The user object needs a gentle check before we access its token. Nothing to worry about \u2014 a simple guard will resolve this." },
    { emoji: '\uD83C\uDFAD', name: 'Sarcastic', desc: 'Dry wit included. For devs who appreciate a roast with their bugs.', example: "Oh wonderful, another null pointer. Line 42, auth.ts. Apparently we thought the user would always exist. Spoiler: they don\u2019t. Add a null check, please." },
    { emoji: '\uD83C\uDFF4\u200D\u2620\uFE0F', name: 'Pirate', desc: 'Arrr! For the adventurous developer sailing through code.', example: "Blimey! We\u2019ve hit a null pointer on line 42 of auth.ts, cap\u2019n! The user object be missin\u2019 before we plunder its token. Best add a null guard before we sink the ship!" },
    { emoji: '\uD83D\uDCAA', name: 'Encouraging', desc: 'Positive and motivating. Keeps morale high even when bugs pile up.', example: "You\u2019re doing great! Just a small bump \u2014 there\u2019s a null pointer on line 42 of auth.ts. The user object needs a quick check before accessing the token. You\u2019ve got this, it\u2019s an easy fix!" },
    { emoji: '\uD83E\uDD23', name: 'Comedic', desc: 'Laugh through the pain. Because debugging should at least be entertaining.', example: "Plot twist! Line 42 of auth.ts just tried to access a token on a user that doesn\u2019t exist. It\u2019s like checking the fridge for leftovers you never cooked. Add a null check and we\u2019re back in business!" },
  ]


  return (
    <div className="auris-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&family=DM+Sans:ital,wght@0,300;0,400;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .auris-page {
          --bg: #09090f;
          --surface: #0f0f1a;
          --border: #1e1e32;
          --dim: #2a2a44;
          --muted: #5a5a7a;
          --subtle: #8888aa;
          --body: #c4c4d8;
          --bright: #eeeef8;
          --accent: #7b6cff;
          --accent2: #a78bfa;
          --glow: rgba(123, 108, 255, 0.18);
          --green: #34d399;
          --red: #f87171;
          --yellow: #fbbf24;
          --blue: #60a5fa;

          background: var(--bg);
          color: var(--body);
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          min-height: 100vh;
          position: relative;
          scroll-behavior: smooth;
          overflow-x: hidden;
          width: 100%;
        }

        .auris-page::before {
          content: '';
          position: fixed; inset: 0; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }

        .auris-ambient {
          position: fixed; top: -30vh; left: 50%;
          transform: translateX(-50%);
          width: 70vw; height: 70vw; max-width: 900px;
          background: radial-gradient(ellipse, rgba(123,108,255,0.12) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
          animation: auris-breathe 8s ease-in-out infinite;
        }

        .auris-container { max-width: 1200px; margin: 0 auto; padding: 0 2.5rem; position: relative; z-index: 1; box-sizing: border-box; width: 100%; }

        @keyframes auris-breathe {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
          50%       { opacity: 1;   transform: translateX(-50%) scale(1.1); }
        }
        @keyframes auris-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes auris-wave {
          0%, 100% { height: 5px; }
          50%       { height: 22px; }
        }
        @keyframes auris-micPulse {
          0%, 100% { box-shadow: 0 0 16px rgba(123,108,255,0.4); }
          50%       { box-shadow: 0 0 28px rgba(123,108,255,0.7); }
        }
        @keyframes auris-fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .auris-reveal {
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .auris-reveal.auris-visible { opacity: 1; transform: translateY(0); }

        /* NAV */
        .auris-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 101;
          padding: 1.2rem 2rem;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid transparent;
          transition: all 0.3s;
          backdrop-filter: blur(0px);
        }
        .auris-nav.scrolled {
          background: rgba(9,9,15,0.85);
          border-bottom-color: var(--border);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .auris-nav-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.3rem;
          color: var(--bright); letter-spacing: -0.02em;
          display: flex; align-items: center; gap: 0.5rem;
          cursor: pointer; text-decoration: none;
        }
        .auris-nav-logo .ear-icon { color: var(--accent); font-size: 1.1rem; }
        .auris-nav a {
          color: var(--subtle); text-decoration: none; font-size: 0.875rem;
          transition: color 0.2s;
        }
        .auris-nav a:hover { color: var(--bright); }
        .auris-nav-links { display: flex; gap: 2rem; align-items: center; }
        .auris-nav-cta {
          background: var(--accent) !important;
          color: white !important;
          padding: 0.5rem 1.25rem;
          border-radius: 6px;
          font-weight: 500; font-size: 0.875rem;
          transition: opacity 0.2s, transform 0.2s !important;
        }
        .auris-nav-cta:hover { opacity: 0.88 !important; transform: translateY(-1px); }

        /* HERO */
        .auris-hero {
          min-height: auto;
          display: flex; flex-direction: column;
          align-items: center; justify-content: flex-start;
          text-align: center;
          padding: 7rem 2rem 4rem;
          position: relative;
        }

        /* Desktop landscape — center hero and fill viewport */
        @media (min-width: 641px) and (orientation: landscape) {
          .auris-hero {
            min-height: 100vh;
            justify-content: center;
            padding: 8rem 2rem 5rem;
          }
        }
        .auris-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          border: 1px solid var(--dim);
          background: rgba(123,108,255,0.07);
          border-radius: 999px;
          padding: 0.35rem 1rem;
          font-size: 0.8rem;
          color: var(--accent2);
          font-family: 'DM Mono', monospace;
          margin-bottom: 2rem;
          animation: auris-fadeUp 0.6s ease both;
        }
        .auris-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent);
          animation: auris-pulse 2s ease-in-out infinite;
        }
        .auris-hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.2rem, 5vw, 4.5rem);
          font-weight: 800; line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--bright);
          margin: 0 0 1rem;
          animation: auris-fadeUp 0.6s 0.1s ease both;
        }
        .auris-gradient-text {
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .auris-tagline {
          font-size: clamp(1rem, 2.2vw, 1.3rem);
          color: var(--subtle);
          max-width: 700px;
          margin: 0 auto 2.5rem;
          font-weight: 300; font-style: italic;
          animation: auris-fadeUp 0.6s 0.2s ease both;
        }
        .auris-hero-actions {
          display: flex; gap: 1rem; align-items: center; justify-content: center;
          flex-wrap: wrap;
          animation: auris-fadeUp 0.6s 0.3s ease both;
        }
        .auris-btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: var(--accent);
          color: white; font-weight: 600;
          padding: 0.85rem 2rem; border-radius: 8px;
          text-decoration: none; font-size: 1rem;
          transition: all 0.2s;
          box-shadow: 0 0 32px rgba(123,108,255,0.35);
          border: none; cursor: pointer;
        }
        .auris-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 48px rgba(123,108,255,0.5); }
        .auris-btn-secondary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          border: 1px solid var(--dim);
          color: var(--body); font-weight: 400;
          padding: 0.85rem 2rem; border-radius: 8px;
          text-decoration: none; font-size: 1rem;
          transition: all 0.2s; background: transparent;
        }
        .auris-btn-secondary:hover { border-color: var(--muted); color: var(--bright); }
        .auris-price-hint {
          margin-top: 1rem; font-size: 0.82rem;
          color: var(--muted); font-family: 'DM Mono', monospace;
          animation: auris-fadeUp 0.6s 0.4s ease both;
        }
        .auris-price-hint strong { color: var(--green); }

        /* HERO SCROLL HINT */
        .auris-hero-scroll-hint {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%) translateY(12px);
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px;
          border: 1px solid var(--border);
          border-radius: 50%;
          background: var(--surface);
          color: var(--muted);
          text-decoration: none;
          cursor: pointer;
          opacity: 0; pointer-events: none;
          transition: opacity 0.3s, transform 0.3s, border-color 0.2s, color 0.2s;
          z-index: 100;
        }
        .auris-hero-scroll-hint.visible {
          opacity: 1; pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }
        .auris-hero-scroll-hint:hover {
          border-color: var(--accent); color: var(--bright);
        }
        .auris-hero-scroll-hint svg {
          width: 20px; height: 20px;
          animation: auris-hero-bounce 2s ease-in-out infinite;
        }
        @keyframes auris-hero-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }

        /* DEMO SLIDESHOW */
        .auris-demo-container {
          margin-top: 3rem;
          animation: auris-fadeUp 0.8s 0.5s ease both;
          position: relative;
        }
        .auris-demo-label {
          text-align: center; font-size: 0.75rem;
          color: var(--muted); font-family: 'DM Mono', monospace;
          margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.1em;
        }
        .auris-demo-window {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px; overflow: hidden;
          max-width: 740px; margin: 0 auto;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(123,108,255,0.08);
        }
        .auris-demo-titlebar {
          background: #0c0c18;
          padding: 0.6rem 1rem;
          display: flex; flex-direction: column; gap: 0.35rem;
          border-bottom: 1px solid var(--border);
        }
        .auris-titlebar-top {
          display: flex; align-items: center; gap: 0.5rem;
        }
        .auris-titlebar-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .auris-titlebar-label {
          font-family: 'DM Mono', monospace; font-size: 0.72rem;
          color: var(--muted); margin-left: auto;
        }
        .auris-titlebar-meta {
          display: flex; align-items: center; gap: 1rem;
          padding-left: 1.5rem;
          font-family: 'DM Mono', monospace; font-size: 0.65rem;
          color: var(--muted);
        }
        .auris-titlebar-meta span { display: flex; align-items: center; gap: 0.3rem; }
        .auris-slides-wrap { overflow: hidden; }
        .auris-slides-track {
          display: flex;
          transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .auris-slide {
          min-width: 100%;
          padding: 1.5rem;
          display: flex; flex-direction: column; gap: 1rem;
          box-sizing: border-box;
        }
        .auris-demo-output {
          border-radius: 8px; padding: 1rem;
          border-left: 3px solid transparent;
          font-size: 0.875rem;
        }
        .auris-output-type {
          font-family: 'DM Mono', monospace; font-size: 0.68rem;
          text-transform: uppercase; letter-spacing: 0.08em;
          margin-bottom: 0.4rem; opacity: 0.85;
        }
        .auris-output-text { color: var(--body); line-height: 1.55; }
        .auris-demo-divider {
          display: flex; align-items: center; gap: 1rem;
          font-size: 0.72rem; color: var(--muted); font-family: 'DM Mono', monospace;
        }
        .auris-demo-divider::before, .auris-demo-divider::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }
        .auris-voice-bar {
          display: flex; align-items: center; gap: 1rem;
          background: rgba(123,108,255,0.06);
          border: 1px solid rgba(123,108,255,0.2);
          border-radius: 8px; padding: 0.75rem 1rem;
        }
        .auris-mic-btn {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--accent);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; border: none; cursor: pointer;
          box-shadow: 0 0 16px rgba(123,108,255,0.4);
          animation: auris-micPulse 2s ease-in-out infinite;
        }
        .auris-waveform { flex: 1; display: flex; align-items: center; gap: 3px; height: 28px; }
        .auris-wave-bar {
          width: 3px; background: var(--accent2); border-radius: 3px;
          animation: auris-wave 0.8s ease-in-out infinite; opacity: 0.7;
        }
        .auris-wave-bar:nth-child(odd)  { animation-delay: 0.0s; }
        .auris-wave-bar:nth-child(even) { animation-delay: 0.22s; }
        .auris-voice-transcript {
          font-family: 'DM Mono', monospace; font-size: 0.78rem;
          color: var(--accent2); font-style: italic; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
        }
        .auris-slide-controls {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.6rem 1rem;
          border-top: 1px solid var(--border);
          background: rgba(255,255,255,0.01);
        }
        .auris-slide-arrow {
          width: 28px; height: 28px; border-radius: 6px;
          border: 1px solid var(--border); background: transparent;
          color: var(--muted); cursor: pointer; font-size: 0.8rem;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s; line-height: 1;
        }
        .auris-slide-arrow:hover { border-color: var(--accent); color: var(--accent); }
        .auris-slide-dots { display: flex; align-items: center; gap: 5px; }
        .auris-slide-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--dim); cursor: pointer; transition: all 0.25s;
          border: none; padding: 0;
        }
        .auris-slide-dot.active { background: var(--accent); width: 16px; border-radius: 3px; }
        .auris-slide-counter {
          font-family: 'DM Mono', monospace; font-size: 0.68rem; color: var(--muted);
        }

        /* SECTIONS */
        .auris-section-label {
          font-family: 'DM Mono', monospace; font-size: 0.75rem;
          text-transform: uppercase; letter-spacing: 0.12em;
          color: var(--accent); margin-bottom: 1rem; text-align: center;
        }
        .auris-section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700; color: var(--bright);
          text-align: center; letter-spacing: -0.02em;
          margin-bottom: 1rem;
        }
        .auris-section-sub {
          text-align: center; color: var(--muted);
          max-width: 500px; margin: 0 auto 4rem; font-size: 1rem;
        }

        /* HOW IT WORKS */
        .auris-flow-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 640px) {
          .auris-flow-grid { grid-template-columns: 1fr; }
        }
        .auris-flow-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px; padding: 1.75rem;
          position: relative; overflow: hidden;
          transition: border-color 0.3s, transform 0.3s;
        }
        .auris-flow-card:hover { border-color: var(--dim); transform: translateY(-3px); }
        .auris-flow-num {
          position: absolute; top: -0.5rem; right: 1rem;
          font-family: 'Syne', sans-serif; font-size: 5rem;
          font-weight: 800; color: var(--border); line-height: 1;
          pointer-events: none;
        }
        .auris-flow-icon { font-size: 1.5rem; margin-bottom: 1rem; }
        .auris-flow-title {
          font-family: 'Syne', sans-serif; font-weight: 700;
          color: var(--bright); font-size: 1.1rem; margin-bottom: 0.5rem;
        }
        .auris-flow-desc { color: var(--muted); font-size: 0.9rem; line-height: 1.6; }

        /* FEATURES */
        .auris-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 14px; overflow: hidden;
        }
        .auris-feature-cell {
          background: var(--bg); padding: 2rem;
          transition: background 0.3s;
        }
        .auris-feature-cell:hover { background: var(--surface); }
        .auris-feature-icon { font-size: 1.5rem; margin-bottom: 1rem; }
        .auris-feature-title {
          font-family: 'Syne', sans-serif; font-weight: 700;
          color: var(--bright); margin-bottom: 0.5rem; font-size: 1rem;
        }
        .auris-feature-desc { color: var(--muted); font-size: 0.875rem; line-height: 1.6; }

        /* OUTPUT PILLS */
        .auris-outputs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr));
          gap: 1rem; margin-top: 3rem;
        }
        .auris-output-pill {
          display: flex; align-items: center; gap: 0.75rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px; padding: 1rem 1.25rem;
          font-size: 0.875rem; color: var(--body);
          transition: all 0.2s;
        }
        .auris-output-pill:hover { border-color: var(--dim); color: var(--bright); }
        .auris-pill-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

        /* VOICE COMMANDS SECTION */
        .auris-voice-cmds-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 3rem;
        }
        .auris-voice-cmd-group {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 2rem;
        }
        .auris-voice-cmd-heading {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--bright);
          margin-bottom: 0.5rem;
        }
        .auris-voice-cmd-desc {
          color: var(--muted);
          font-size: 0.85rem;
          line-height: 1.55;
          margin-bottom: 1.25rem;
        }
        .auris-voice-cmd-examples {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .auris-voice-cmd-examples code {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.4rem 0.75rem;
          font-family: 'DM Mono', monospace;
          font-size: 0.78rem;
          color: var(--accent);
          white-space: nowrap;
        }

        /* PROVIDERS */
        .auris-providers-label {
          text-align: center; font-family: 'DM Mono', monospace;
          font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em;
          color: var(--muted); margin-bottom: 1.75rem;
        }
        .auris-providers-row {
          display: flex; align-items: center; justify-content: center;
          flex-wrap: nowrap; gap: 0.75rem; overflow-x: auto;
        }
        .auris-provider-pill {
          display: flex; align-items: center; gap: 0.5rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 0.55rem 1.1rem;
          font-size: 0.85rem; font-weight: 500;
          color: var(--body); transition: all 0.2s;
          flex-shrink: 0; white-space: nowrap;
        }
        .auris-provider-pill:hover { border-color: var(--accent); color: var(--bright); }
        .auris-provider-pip { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

        /* PERSONAS SLIDER */
        .auris-persona-tabs {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.75rem;
        }
        .auris-persona-tab {
          display: flex; align-items: center; gap: 0.4rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 0.45rem 1rem;
          font-size: 0.8rem; font-weight: 500;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.25s;
          font-family: 'DM Sans', sans-serif;
        }
        .auris-persona-tab:hover { border-color: var(--dim); color: var(--body); }
        .auris-persona-tab.active {
          border-color: var(--accent);
          color: var(--bright);
          background: rgba(123,108,255,0.08);
          box-shadow: 0 0 16px rgba(123,108,255,0.15);
        }
        .auris-persona-tab .tab-emoji { font-size: 1rem; }
        .auris-persona-slide-wrap {
          max-width: 600px;
          margin: 0 auto;
        }
        .auris-persona-slide {
          animation: auris-personaFade 0.4s ease;
        }
        @keyframes auris-personaFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .auris-persona-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          position: relative;
        }
        .auris-persona-card-emoji {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
          line-height: 1;
        }
        .auris-persona-card-title {
          font-family: 'Syne', sans-serif; font-weight: 700;
          color: var(--bright); font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }
        .auris-persona-tag {
          font-family: 'DM Mono', monospace; font-size: 0.65rem;
          padding: 0.15rem 0.5rem; border-radius: 4px;
          background: rgba(123,108,255,0.1); color: var(--accent2);
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .auris-persona-desc {
          color: var(--muted); font-size: 0.85rem; margin-bottom: 1rem; line-height: 1.5;
        }
        .auris-persona-example {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.85rem 1rem;
          font-size: 0.82rem;
          color: var(--subtle);
          font-style: italic;
          line-height: 1.55;
          position: relative;
        }
        .auris-persona-example::before {
          content: '\u201C';
          position: absolute; top: 0.25rem; left: 0.6rem;
          font-size: 1.5rem; color: var(--dim); font-style: normal;
          font-family: serif; line-height: 1;
        }
        .auris-persona-example-inner { padding-left: 1rem; }
        .auris-persona-example-label {
          font-family: 'DM Mono', monospace; font-size: 0.65rem;
          color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em;
          margin-bottom: 0.4rem; font-style: normal;
        }

        /* PRIVACY */
        .auris-privacy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
          gap: 2rem; text-align: center;
        }
        .auris-privacy-icon { font-size: 2rem; margin-bottom: 0.75rem; }
        .auris-privacy-title {
          font-family: 'Syne', sans-serif; font-weight: 700;
          color: var(--bright); font-size: 0.95rem; margin-bottom: 0.4rem;
        }
        .auris-privacy-desc { color: var(--muted); font-size: 0.82rem; line-height: 1.5; }

        /* PRICING */
        .auris-pricing-card {
          background: var(--surface);
          border: 1px solid var(--accent);
          border-radius: 16px;
          box-shadow: 0 0 60px rgba(123,108,255,0.12), 0 0 0 1px rgba(123,108,255,0.08);
          overflow: hidden;
        }
        .auris-pricing-inner {
          display: grid;
          grid-template-columns: 280px 1px 1fr;
          gap: 0;
        }
        .auris-pricing-left {
          padding: 2.5rem;
          display: flex; flex-direction: column;
          border-right: 1px solid var(--border);
        }
        .auris-pricing-divider { background: var(--border); width: 1px; }
        .auris-plan-name {
          font-family: 'Syne', sans-serif; font-weight: 800;
          color: var(--accent2); font-size: 0.9rem;
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 1rem;
        }
        .auris-plan-price {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 3.5rem; color: var(--bright);
          letter-spacing: -0.03em; line-height: 1;
          margin-bottom: 0.25rem;
        }
        .auris-plan-price .currency { font-size: 1.75rem; vertical-align: top; margin-top: 0.4rem; display: inline-block; }
        .auris-plan-price .period { font-size: 1rem; color: var(--muted); font-weight: 400; }
        .auris-plan-note { font-size: 0.8rem; color: var(--muted); margin-bottom: 2rem; line-height: 1.5; }
        .auris-plan-features {
          list-style: none;
          display: flex; flex-direction: column; gap: 0.75rem;
          padding: 2.5rem;
          margin: 0;
        }
        .auris-plan-features li {
          display: flex; align-items: flex-start; gap: 0.6rem;
          font-size: 0.9rem; color: var(--body);
        }
        .auris-plan-features li .check { color: var(--green); flex-shrink: 0; margin-top: 0.1rem; }
        .auris-plan-cta {
          display: block; text-align: center;
          padding: 0.9rem; border-radius: 8px;
          font-weight: 600; font-size: 1rem;
          text-decoration: none;
          transition: all 0.2s;
          margin-top: auto;
          background: var(--accent); color: white;
          box-shadow: 0 0 24px rgba(123,108,255,0.3);
          border: none; cursor: pointer;
        }
        .auris-plan-cta:hover { opacity: 0.88; transform: translateY(-1px); }
        .auris-plan-guarantee {
          text-align: center; font-size: 0.72rem;
          color: var(--muted); margin-top: 0.75rem;
          font-family: 'DM Mono', monospace;
        }

        /* FAQ */
        .auris-faq-list { max-width: 740px; margin: 3rem auto 0; }
        .auris-faq-item { border-bottom: 1px solid var(--border); padding: 1.5rem 0; }
        .auris-faq-item:first-child { border-top: 1px solid var(--border); }
        .auris-faq-q {
          font-family: 'Syne', sans-serif; font-weight: 600;
          color: var(--bright); font-size: 1rem;
          cursor: pointer; background: none; border: none; width: 100%;
          display: flex; justify-content: space-between; align-items: center;
          gap: 1rem; text-align: left; padding: 0;
        }
        .auris-faq-q:hover { color: var(--accent2); }
        .auris-faq-arrow { color: var(--muted); transition: transform 0.3s; flex-shrink: 0; }
        .auris-faq-item.open .auris-faq-arrow { transform: rotate(180deg); }
        .auris-faq-a {
          color: var(--muted); font-size: 0.9rem; line-height: 1.7;
          max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s;
        }
        .auris-faq-item.open .auris-faq-a { max-height: 300px; padding-top: 1rem; }

        /* FOOTER */
        .auris-footer {
          padding: 2.5rem 0;
          border-top: 1px solid var(--border);
          text-align: center;
          position: relative; z-index: 1;
        }
        .auris-footer-logo {
          font-family: 'Syne', sans-serif; font-weight: 800;
          color: var(--bright); font-size: 1.1rem; margin-bottom: 0.5rem;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
        }
        .auris-footer-logo .ear-icon { color: var(--accent); font-size: 1.1rem; }
        .auris-footer-sub { font-size: 0.8rem; color: var(--muted); font-style: italic; }

        /* SCROLL TO TOP */
        .auris-scroll-top {
          position: fixed;
          bottom: 2rem; right: 2rem;
          width: 44px; height: 44px;
          border-radius: 50%;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--muted);
          font-size: 1.2rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; pointer-events: none;
          transform: translateY(12px);
          transition: opacity 0.3s, transform 0.3s, border-color 0.2s, color 0.2s;
          z-index: 100;
        }
        .auris-scroll-top.visible {
          opacity: 1; pointer-events: auto;
          transform: translateY(0);
        }
        .auris-scroll-top:hover {
          border-color: var(--accent); color: var(--bright);
        }

        /* HAMBURGER */
        .auris-hamburger {
          display: none;
          background: none; border: none; cursor: pointer;
          width: 40px; height: 40px;
          flex-direction: column; align-items: center; justify-content: center; gap: 5px;
          padding: 0; z-index: 101;
          -webkit-tap-highlight-color: transparent;
          flex-shrink: 0;
        }
        .auris-hamburger span {
          display: block; width: 22px; height: 2px;
          background: var(--bright); border-radius: 2px;
          transition: transform 0.3s, opacity 0.3s;
          transform-origin: center center;
        }
        .auris-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .auris-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .auris-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* MOBILE MENU */
        .auris-mobile-menu {
          display: none;
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(9,9,15,0.97);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          z-index: 100;
          flex-direction: column; align-items: center; justify-content: center;
          gap: 2rem;
        }
        .auris-mobile-menu.open { display: flex; }
        .auris-mobile-menu a {
          font-family: 'Syne', sans-serif; font-weight: 600;
          font-size: 1.4rem; color: var(--subtle);
          text-decoration: none; transition: color 0.2s;
        }
        .auris-mobile-menu a:hover { color: var(--bright); }
        .auris-mobile-menu .auris-nav-cta {
          font-size: 1rem; margin-top: 1rem;
        }

        /* Tablet */
        @media (max-width: 900px) {
          .auris-features-grid { grid-template-columns: repeat(2, 1fr); }
          .auris-voice-cmds-grid { grid-template-columns: 1fr; }
        }

        /* Mobile: portrait + landscape */
        @media (max-width: 640px) {
          .auris-hamburger { display: flex; }
          .auris-nav-links { display: none; }
          .auris-nav { padding: 0.75rem 1rem; }
          .auris-container { padding: 0 1rem; }

          /* Hero */
          .auris-hero { padding: 4.5rem 1rem 2.5rem; min-height: auto; overflow: hidden; max-width: 100%; }
          .auris-hero .auris-container { max-width: 100%; overflow: hidden; padding: 0 1rem; }
          .auris-hero h1 { font-size: clamp(1.5rem, 7vw, 2rem); word-break: break-word; max-width: 100%; }
          .auris-tagline { font-size: 0.9rem; font-style: italic; max-width: 100%; word-break: break-word; }
          .auris-badge { font-size: 0.65rem; padding: 0.3rem 0.75rem; white-space: normal; text-align: center; line-height: 1.4; max-width: 100%; }
          .auris-hero-actions { flex-direction: column; width: 100%; max-width: 100%; }
          .auris-btn-primary, .auris-btn-secondary { width: 100%; text-align: center; justify-content: center; box-sizing: border-box; }
          .auris-price-hint { font-size: 0.72rem; max-width: 100%; word-break: break-word; }

          /* Demo slideshow */
          .auris-demo-container { margin-top: 2.5rem; max-width: 100%; overflow: hidden; }
          .auris-demo-label { font-size: 0.65rem; }
          .auris-demo-window { border-radius: 10px; max-width: 100%; }
          .auris-titlebar-label { font-size: 0.6rem; }
          .auris-titlebar-meta { display: none; }
          .auris-slide { padding: 0.75rem; }
          .auris-demo-output { padding: 0.6rem; font-size: 0.8rem; }
          .auris-output-text { word-break: break-word; }
          .auris-voice-bar { padding: 0.5rem 0.6rem; gap: 0.6rem; }
          .auris-mic-btn { width: 30px; height: 30px; }
          .auris-waveform { height: 22px; }
          .auris-voice-transcript { font-size: 0.7rem; white-space: normal; word-break: break-word; }
          .auris-slide-arrow { width: 24px; height: 24px; font-size: 0.7rem; }

          /* Sections */
          .auris-section-title { font-size: 1.5rem; }
          .auris-section-sub { font-size: 0.9rem; margin-bottom: 2.5rem; }
          section { padding: 4rem 0 !important; overflow: hidden; max-width: 100%; }

          /* Grids */
          .auris-flow-grid { grid-template-columns: 1fr; }
          .auris-features-grid { grid-template-columns: 1fr; }
          .auris-persona-tabs { gap: 0.35rem; }
          .auris-persona-tab { font-size: 0.72rem; padding: 0.35rem 0.75rem; }
          .auris-persona-card { padding: 1.5rem; }
          .auris-privacy-grid { grid-template-columns: 1fr 1fr; }

          /* Pricing */
          .auris-pricing-inner { grid-template-columns: 1fr !important; }
          .auris-pricing-left { border-right: none !important; border-bottom: 1px solid var(--border); padding: 1.5rem; }
          .auris-pricing-divider { display: none; }
          .auris-plan-features { padding: 1.5rem; }

          /* FAQ */
          .auris-faq-q { font-size: 0.9rem; }
          .auris-faq-a { font-size: 0.82rem; }
        }

        /* Small phones */
        @media (max-width: 400px) {
          .auris-hero h1 { font-size: 1.4rem; }
          .auris-privacy-grid { grid-template-columns: 1fr; }
          .auris-badge { font-size: 0.6rem; padding: 0.25rem 0.6rem; }
        }

        /* Mobile landscape */
        @media (max-height: 500px) and (orientation: landscape) {
          .auris-hero { min-height: auto; padding: 4rem 2rem 2rem; }
          .auris-hero-actions { flex-direction: row; width: auto; }
          .auris-btn-primary, .auris-btn-secondary { width: auto; }
          .auris-demo-container { margin-top: 2rem; }
        }
      `}</style>

      <div className="auris-ambient" />

      {/* NAV */}
      <nav className={`auris-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="auris-nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="ear-icon">{'\u25C8'}</span> Auris
        </div>
        <div className="auris-nav-links">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#personas">Personas</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a href="https://chromewebstore.google.com" target="_blank" rel="noopener noreferrer" className="auris-nav-cta">Get Auris</a>
        </div>
        <button className={`auris-hamburger ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span /><span /><span />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`auris-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#how" onClick={() => setMobileMenuOpen(false)}>How it works</a>
        <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
        <a href="#personas" onClick={() => setMobileMenuOpen(false)}>Personas</a>
        <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
        <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
        <a href="https://chromewebstore.google.com" target="_blank" rel="noopener noreferrer" className="auris-nav-cta" onClick={() => setMobileMenuOpen(false)}>Get Auris</a>
      </div>

      {/* HERO */}
      <section id="hero" className="auris-hero">
        <div className="auris-container">
          <div className="auris-badge">
            <img src="/chrome-web-store-icon.svg" alt="Chrome Web Store" width="16" height="16" style={{ flexShrink: 0 }} />
            Chrome Extension
          </div>
          <h1>Your AI Coding Assistant,<br /><span className="auris-gradient-text">out loud.</span></h1>
          <p className="auris-tagline">An AI voice assistant for <span style={{ color: '#D97757', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><img src="/claude-ai-icon.svg" alt="Claude" width="18" height="18" style={{ verticalAlign: 'middle' }} />Claude Code</span> for Web &mdash; keeping you in flow.</p>
          <div className="auris-hero-actions">
            <a href="https://chromewebstore.google.com" target="_blank" rel="noopener noreferrer" className="auris-btn-primary">Get Auris</a>
            <a href="#how" className="auris-btn-secondary">See how it works &rarr;</a>
          </div>
          <p className="auris-price-hint"><strong>1-day free trial</strong> &middot; Full features &middot; $29 one-time &middot; BYOK</p>

          {/* DEMO SLIDESHOW */}
          <div className="auris-demo-container">
            <p className="auris-demo-label">Auris side panel &mdash; 10 output types + voice commands + status queries, all spoken aloud</p>
            <div
              className="auris-demo-window"
              onMouseEnter={() => { if (slideTimerRef.current) clearInterval(slideTimerRef.current) }}
              onMouseLeave={() => startAutoSlide()}
            >
              <div className="auris-demo-titlebar">
                <div className="auris-titlebar-top">
                  <span className="auris-titlebar-dot" style={{ background: '#ff5f57' }} />
                  <span className="auris-titlebar-dot" style={{ background: '#ffbd2e' }} />
                  <span className="auris-titlebar-dot" style={{ background: '#28c840' }} />
                  <span className="auris-titlebar-label">Auris &middot; <span style={{ color: '#34d399' }}>{'\u25CF'}</span> claude-sonnet-4-5 &middot; connected</span>
                </div>
                <div className="auris-titlebar-meta">
                  <span><span style={{ opacity: 0.5 }}>repo</span> acme-app</span>
                  <span><span style={{ opacity: 0.5 }}>branch</span> <span style={{ color: '#fbbf24' }}>{'\u23C7'}</span> fix/auth-null-check</span>
                  <span><span style={{ opacity: 0.5 }}>session</span> <span style={{ color: 'var(--accent2)' }}>#</span> auth-refactor-03</span>
                </div>
              </div>
              <div
                className="auris-slides-wrap"
                onTouchStart={(e) => { touchXRef.current = e.touches[0].clientX }}
                onTouchEnd={(e) => {
                  const diff = touchXRef.current - e.changedTouches[0].clientX
                  if (Math.abs(diff) > 40) goToSlide(currentSlide + (diff > 0 ? 1 : -1))
                }}
              >
                <div className="auris-slides-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                  {slides.map((slide, i) => (
                    <div key={i} className="auris-slide">
                      <div className="auris-demo-output" style={{ background: slideColorBg[slide.type], borderLeftColor: slideColors[slide.type] }}>
                        <div className="auris-output-type" style={{ color: slideColors[slide.type] }}>{'\u25CF'} {slide.label}</div>
                        <div className="auris-output-text">{slide.text}</div>
                      </div>
                      <div className="auris-demo-divider">auris heard you</div>
                      <div className="auris-voice-bar">
                        <button className="auris-mic-btn"><span style={{ fontSize: '1rem' }}>{'\uD83C\uDF99'}</span></button>
                        <div className="auris-waveform">
                          {waveformBars.map((_, j) => (
                            <div key={j} className="auris-wave-bar" />
                          ))}
                        </div>
                        <div className="auris-voice-transcript">{slide.transcript}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="auris-slide-controls">
                <button className="auris-slide-arrow" onClick={() => goToSlide(currentSlide - 1)} aria-label="Previous">{'\u2190'}</button>
                <div className="auris-slide-dots">
                  {slides.map((_, i) => (
                    <button key={i} className={`auris-slide-dot ${i === currentSlide ? 'active' : ''}`} onClick={() => goToSlide(i)} aria-label={`Slide ${i + 1}`} />
                  ))}
                </div>
                <span className="auris-slide-counter">{currentSlide + 1} / {totalSlides}</span>
                <button className="auris-slide-arrow" onClick={() => goToSlide(currentSlide + 1)} aria-label="Next">{'\u2192'}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '7rem 0', position: 'relative', zIndex: 1 }}>
        <div className="auris-container">
          <p className="auris-section-label auris-reveal">How it works</p>
          <h2 className="auris-section-title auris-reveal">Claude Code talks. You listen. You talk back.</h2>
          <p className="auris-section-sub auris-reveal">Auris sits between you and Claude Code for Web &mdash; reading every output aloud and understanding everything you say back.</p>
          <div className="auris-flow-grid">
            {howItWorksCards.map((card, i) => (
              <div key={i} className="auris-flow-card auris-reveal">
                <span className="auris-flow-num">{i + 1}</span>
                <div className="auris-flow-icon">{card.icon}</div>
                <div className="auris-flow-title">{card.title}</div>
                <div className="auris-flow-desc">{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT AURIS READS ALOUD */}
      <section id="outputs" style={{ padding: '5rem 0', position: 'relative', zIndex: 1 }}>
        <div className="auris-container">
          <p className="auris-section-label auris-reveal">What Auris reads aloud</p>
          <h2 className="auris-section-title auris-reveal">Every output. Classified. Spoken.</h2>
          <p className="auris-section-sub auris-reveal">Auris doesn&apos;t just read text &mdash; it knows what type of output Claude Code produced and announces it with context.</p>
          <div className="auris-outputs-grid auris-reveal">
            {outputTypes.map((item, i) => (
              <div key={i} className="auris-output-pill">
                <span className="auris-pill-dot" style={{ background: item.color }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU CAN SAY */}
      <section id="voice-commands" style={{ padding: '5rem 0', position: 'relative', zIndex: 1 }}>
        <div className="auris-container">
          <p className="auris-section-label auris-reveal">What you can say</p>
          <h2 className="auris-section-title auris-reveal">Talk back. Send commands. Stay in flow.</h2>
          <p className="auris-section-sub auris-reveal">Auris doesn&apos;t just read &mdash; it listens. Reply to Claude, instruct it directly, or check status without touching the screen.</p>

          <div className="auris-voice-cmds-grid auris-reveal">
            <div className="auris-voice-cmd-group">
              <h3 className="auris-voice-cmd-heading">Quick replies</h3>
              <p className="auris-voice-cmd-desc">Respond instantly to Claude&apos;s output &mdash; no AI call needed.</p>
              <div className="auris-voice-cmd-examples">
                <code>&ldquo;yes&rdquo;</code>
                <code>&ldquo;no&rdquo;</code>
                <code>&ldquo;skip&rdquo;</code>
                <code>&ldquo;option B&rdquo;</code>
                <code>&ldquo;read again&rdquo;</code>
                <code>&ldquo;save this&rdquo;</code>
                <code>&ldquo;explain&rdquo;</code>
              </div>
            </div>

            <div className="auris-voice-cmd-group">
              <h3 className="auris-voice-cmd-heading">Instruct Claude</h3>
              <p className="auris-voice-cmd-desc">Speak a command and Auris types it into Claude Code for you. Optional confirmation before sending.</p>
              <div className="auris-voice-cmd-examples">
                <code>&ldquo;Tell Claude to fix the auth bug&rdquo;</code>
                <code>&ldquo;Ask Claude how to optimize this query&rdquo;</code>
                <code>&ldquo;Write create a unit test for the parser&rdquo;</code>
              </div>
            </div>

            <div className="auris-voice-cmd-group">
              <h3 className="auris-voice-cmd-heading">Status queries</h3>
              <p className="auris-voice-cmd-desc">Ask what&apos;s happening without looking at the screen.</p>
              <div className="auris-voice-cmd-examples">
                <code>&ldquo;What&apos;s happening?&rdquo;</code>
                <code>&ldquo;Any errors?&rdquo;</code>
                <code>&ldquo;What did I miss?&rdquo;</code>
                <code>&ldquo;Pending permissions?&rdquo;</code>
                <code>&ldquo;How long?&rdquo;</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROVIDERS */}
      <section id="providers" style={{ padding: '3.5rem 0', position: 'relative', zIndex: 1, borderTop: '1px solid var(--border)' }}>
        <div className="auris-container">
          <p className="auris-providers-label auris-reveal">Works with your preferred AI provider &mdash; 10 presets built in</p>
          <div className="auris-providers-row auris-reveal">
            {providers.map((p, i) => (
              <div key={i} className="auris-provider-pill">
                <span className="auris-provider-pip" style={{ background: p.color }} />
                {p.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '5rem 0', position: 'relative', zIndex: 1 }}>
        <div className="auris-container">
          <p className="auris-section-label auris-reveal">Features</p>
          <h2 className="auris-section-title auris-reveal">Built for deep work.</h2>
          <p className="auris-section-sub auris-reveal">Every feature designed around one goal &mdash; keeping developers in flow.</p>
          <div className="auris-features-grid auris-reveal">
            {features.map((f, i) => (
              <div key={i} className="auris-feature-cell">
                <div className="auris-feature-icon">{f.icon}</div>
                <div className="auris-feature-title">{f.title}</div>
                <div className="auris-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERSONAS */}
      <section id="personas" style={{ padding: '6rem 0', position: 'relative', zIndex: 1 }}>
        <div className="auris-container">
          <p className="auris-section-label auris-reveal">Voice Personas</p>
          <h2 className="auris-section-title auris-reveal">8 personas. Your assistant, your tone.</h2>
          <p className="auris-section-sub auris-reveal">Auris doesn&apos;t just read &mdash; it speaks with personality. Pick the voice that matches your workflow.</p>
          <div className="auris-persona-tabs auris-reveal">
            {personas.map((p, i) => (
              <button
                key={i}
                className={`auris-persona-tab ${i === personaSlide ? 'active' : ''}`}
                onClick={() => setPersonaSlide(i)}
              >
                <span className="tab-emoji">{p.emoji}</span> {p.name}
              </button>
            ))}
          </div>
          <div className="auris-persona-slide-wrap auris-reveal">
            {personas.map((p, i) => (
              i === personaSlide && (
                <div key={i} className="auris-persona-slide">
                  <div className="auris-persona-card">
                    <div className="auris-persona-card-emoji">{p.emoji}</div>
                    <div className="auris-persona-card-title">{p.name} {p.tag && <span className="auris-persona-tag">{p.tag}</span>}</div>
                    <div className="auris-persona-desc">{p.desc}</div>
                    <div className="auris-persona-example">
                      <div className="auris-persona-example-inner">
                        <div className="auris-persona-example-label">Error detected</div>
                        {p.example}
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section id="privacy" style={{ padding: '4rem 0', position: 'relative', zIndex: 1, borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="auris-container">
          <div className="auris-privacy-grid auris-reveal">
            {privacyItems.map((item, i) => (
              <div key={i}>
                <div className="auris-privacy-icon">{item.icon}</div>
                <div className="auris-privacy-title">{item.title}</div>
                <div className="auris-privacy-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '7rem 0', position: 'relative', zIndex: 1 }}>
        <div className="auris-container">
          <p className="auris-section-label auris-reveal">Pricing</p>
          <h2 className="auris-section-title auris-reveal">Pay once. Yours forever.</h2>
          <p className="auris-section-sub auris-reveal">No subscription. No usage fees. No server costs passed to you.</p>
          <div className="auris-reveal" style={{ maxWidth: 780, margin: '0 auto' }}>
            <div className="auris-pricing-card">
              <div className="auris-pricing-inner">
                <div className="auris-pricing-left">
                  <div className="auris-plan-name">Auris</div>
                  <div className="auris-plan-price"><span className="currency">$</span>29<span className="period"> one-time</span></div>
                  <div className="auris-plan-note">1-day free trial &middot; Lifetime access &middot; No subscription</div>
                  <a href="https://chromewebstore.google.com" target="_blank" rel="noopener noreferrer" className="auris-plan-cta">Get Auris</a>
                  <p className="auris-plan-guarantee">{'\uD83D\uDD12'} Secure in-app purchase</p>
                </div>
                <div className="auris-pricing-divider" />
                <ul className="auris-plan-features">
                  {pricingFeatures.map((feat, i) => (
                    <li key={i}><span className="check">{'\u2713'}</span> {feat}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '5rem 0 7rem', position: 'relative', zIndex: 1 }}>
        <div className="auris-container">
          <p className="auris-section-label auris-reveal">FAQ</p>
          <h2 className="auris-section-title auris-reveal">Common questions</h2>
          <div className="auris-faq-list auris-reveal">
            {faqData.map((item, i) => (
              <div key={i} className={`auris-faq-item ${openFaq === i ? 'open' : ''}`}>
                <button className="auris-faq-q" onClick={() => toggleFaq(i)}>
                  {item.q}
                  <span className="auris-faq-arrow">{'\u25BE'}</span>
                </button>
                <div className="auris-faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="auris-footer">
        <div className="auris-container">
          <div className="auris-footer-logo"><span className="ear-icon">{'\u25C8'}</span> Auris</div>
          <p className="auris-footer-sub">An AI voice assistant for Claude Code for Web &mdash; keeping you in flow.</p>
        </div>
      </footer>

      {/* Scroll to next section */}
      <button
        className={`auris-hero-scroll-hint ${!atBottom ? 'visible' : ''}`}
        onClick={scrollToNextSection}
        aria-label="Scroll to next section"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Scroll to top */}
      <button
        className={`auris-scroll-top ${showScrollTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        ↑
      </button>

    </div>
  )
}

export default AurisLanding
