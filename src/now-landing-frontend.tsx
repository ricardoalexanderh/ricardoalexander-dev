import React, { useState, useEffect, useRef, useCallback } from 'react'

const SPRITE_DATA: Record<string, { sprite: number[][], palette: Record<number, string> }> = {
  ghost: {
    sprite: [[0,0,0,0,1,1,1,1,1,0,0,0,0],[0,0,0,1,2,2,2,2,2,1,0,0,0],[0,0,1,2,2,2,2,2,2,2,1,0,0],[0,1,2,2,5,2,2,2,5,2,2,1,0],[0,1,2,2,2,2,2,2,2,2,2,1,0],[1,2,2,3,3,2,2,2,3,3,2,2,1],[1,2,2,3,3,2,2,2,3,3,2,2,1],[1,2,2,2,2,2,1,2,2,2,2,2,1],[1,2,4,2,2,2,2,2,2,2,4,2,1],[0,1,2,2,2,2,2,2,2,2,2,1,0],[0,1,2,2,2,2,2,2,2,2,2,1,0],[0,0,1,2,2,1,0,1,2,2,1,0,0],[0,0,0,1,1,0,0,0,1,1,0,0,0]],
    palette: {1:'#2E2B36',2:'#F0EDE6',3:'#2E2B36',4:'#F2A871',5:'#FFFFFF'}
  },
  cat: {
    sprite: [[0,0,1,0,0,0,0,0,0,0,1,0,0],[0,1,2,1,0,0,0,0,0,1,2,1,0],[0,1,2,2,1,1,1,1,1,2,2,1,0],[1,2,2,2,2,2,2,2,2,2,2,2,1],[1,2,2,2,2,2,2,2,2,2,2,2,1],[1,2,2,3,3,2,2,2,3,3,2,2,1],[1,2,2,3,5,2,2,2,3,5,2,2,1],[1,2,2,2,2,2,1,2,2,2,2,2,1],[1,2,4,2,2,1,2,1,2,2,4,2,1],[0,1,2,2,2,2,2,2,2,2,2,1,0],[0,0,1,2,2,2,2,2,2,2,1,0,0],[0,0,0,1,1,1,1,1,1,1,0,0,0],[0,0,0,0,0,1,2,1,0,0,0,0,0]],
    palette: {1:'#3A2030',2:'#F5D0C0',3:'#3A2030',4:'#F5A0C0',5:'#60F0A0'}
  },
  robot: {
    sprite: [[0,0,0,1,1,1,1,1,1,1,0,0,0],[0,0,0,1,5,5,5,5,5,1,0,0,0],[0,1,1,1,1,1,1,1,1,1,1,1,0],[0,1,2,2,2,2,2,2,2,2,2,1,0],[1,1,2,3,3,2,2,2,3,3,2,1,1],[1,4,2,3,5,2,2,2,3,5,2,4,1],[1,1,2,2,2,2,2,2,2,2,2,1,1],[0,1,2,2,1,1,1,1,1,2,2,1,0],[0,1,1,1,1,1,1,1,1,1,1,1,0],[0,0,1,2,2,2,2,2,2,2,1,0,0],[0,0,1,2,2,2,2,2,2,2,1,0,0],[0,0,1,2,1,0,0,0,1,2,1,0,0],[0,1,1,1,1,0,0,0,1,1,1,1,0]],
    palette: {1:'#1A2A3A',2:'#B0C4D8',3:'#1A2A3A',4:'#70D0F0',5:'#FFFFFF'}
  },
  frog: {
    sprite: [[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,1,1,0,0,0,1,1,1,0,0],[0,1,3,3,3,1,1,1,3,3,3,1,0],[0,1,3,5,3,2,2,2,3,5,3,1,0],[0,0,1,1,2,2,2,2,2,1,1,0,0],[0,1,2,2,2,2,2,2,2,2,2,1,0],[1,2,2,2,2,2,2,2,2,2,2,2,1],[1,2,2,2,1,1,1,1,1,2,2,2,1],[1,2,4,2,2,2,2,2,2,2,4,2,1],[0,1,2,2,2,2,2,2,2,2,2,1,0],[0,0,1,2,2,2,2,2,2,2,1,0,0],[0,1,2,1,1,0,0,0,1,1,2,1,0],[0,1,1,0,0,0,0,0,0,0,1,1,0]],
    palette: {1:'#1A3020',2:'#68C870',3:'#F0F0E0',4:'#F0C070',5:'#1A3020'}
  },
  skull: {
    sprite: [[0,0,0,1,1,1,1,1,1,1,0,0,0],[0,0,1,2,2,2,2,2,2,2,1,0,0],[0,1,2,2,2,2,2,2,2,2,2,1,0],[1,2,2,2,2,2,2,2,2,2,2,2,1],[1,2,2,3,3,2,2,2,3,3,2,2,1],[1,2,2,3,3,2,2,2,3,3,2,2,1],[1,2,2,2,2,2,5,2,2,2,2,2,1],[1,2,2,2,2,2,2,2,2,2,2,2,1],[0,1,2,2,1,2,1,2,1,2,2,1,0],[0,0,1,2,2,1,2,1,2,2,1,0,0],[0,0,0,1,2,2,2,2,2,1,0,0,0],[0,0,0,0,1,1,1,1,1,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]],
    palette: {1:'#2A1818',2:'#F0E8E0',3:'#2A1818',4:'#E86050',5:'#3A2020'}
  },
  ninja: {
    sprite: [[0,0,0,1,2,2,2,2,2,1,0,0,0],[0,0,1,2,2,2,2,2,2,2,1,0,0],[0,1,2,2,2,2,2,2,2,2,2,1,0],[0,1,4,4,4,4,4,4,4,4,4,1,4],[0,1,5,3,3,5,5,5,3,3,5,1,0],[0,1,5,3,1,5,5,5,3,1,5,1,0],[0,1,2,2,2,2,2,2,2,2,2,1,0],[0,0,1,2,2,2,2,2,2,2,1,0,0],[0,1,2,2,2,2,2,2,2,2,2,1,0],[0,1,2,2,2,4,4,4,2,2,2,1,0],[0,0,1,2,2,2,2,2,2,2,1,0,0],[0,0,1,2,2,1,0,1,2,2,1,0,0],[0,0,1,1,1,0,0,0,1,1,1,0,0]],
    palette: {1:'#1A1030',2:'#2E2048',3:'#FFFFFF',4:'#D04050',5:'#C8B8A0'}
  }
}

function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: number[][],
  palette: Record<number, string>,
  size: number,
  bounceOffset: number
) {
  const rows = sprite.length
  const cols = sprite[0].length
  const pixelSize = size / Math.max(rows, cols)
  ctx.clearRect(0, 0, size, size)
  const offsetX = (size - cols * pixelSize) / 2
  const offsetY = (size - rows * pixelSize) / 2 + bounceOffset
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const val = sprite[r][c]
      if (val === 0) continue
      const color = palette[val]
      if (!color) continue
      ctx.fillStyle = color
      ctx.fillRect(
        Math.floor(offsetX + c * pixelSize),
        Math.floor(offsetY + r * pixelSize),
        Math.ceil(pixelSize),
        Math.ceil(pixelSize)
      )
    }
  }
}

const PixelCharacter: React.FC<{
  charKey: string
  size: number
  animate?: boolean
  style?: React.CSSProperties
  className?: string
}> = ({ charKey, size, animate = true, style, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const data = SPRITE_DATA[charKey]
    if (!data) return

    if (animate) {
      const render = () => {
        const bounce = Math.sin(Date.now() / 600) * 1.5
        const blinking = Math.sin(Date.now() / 2000) > 0.92
        const palette = { ...data.palette }
        if (blinking) palette[3] = palette[2]
        drawSprite(ctx, data.sprite, palette, size, bounce)
        animRef.current = requestAnimationFrame(render)
      }
      render()
      return () => cancelAnimationFrame(animRef.current)
    } else {
      drawSprite(ctx, data.sprite, data.palette, size, 0)
    }
  }, [charKey, size, animate])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className}
      style={{ imageRendering: 'pixelated', ...style }}
    />
  )
}

const PixelGrid: React.FC<{ size?: number, style?: React.CSSProperties, className?: string }> = ({ size = 18, style, className }) => {
  const cellSize = Math.floor(size / 3)
  const pattern = [1,0,1,0,1,0,1,0,1]
  return (
    <div className={className} style={{
      display: 'grid',
      gridTemplateColumns: `repeat(3, ${cellSize}px)`,
      gridTemplateRows: `repeat(3, ${cellSize}px)`,
      gap: '1px',
      ...style,
    }}>
      {pattern.map((on, i) => (
        <div key={i} style={{
          width: cellSize,
          height: cellSize,
          borderRadius: '1px',
          background: on ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)',
        }} />
      ))}
    </div>
  )
}

const NowLandingFrontend: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeCharacter, setActiveCharacter] = useState(0)
  const [builderCharacter, setBuilderCharacter] = useState(0)
  const [builderTransparency, setBuilderTransparency] = useState(85)
  const [builderPosition, setBuilderPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right')
  const [clockTime, setClockTime] = useState(new Date())
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60)
  const [pomodoroRunning, setPomodoroRunning] = useState(false)
  const [progressDemo, setProgressDemo] = useState(0)
  const [sysInfoCpu, setSysInfoCpu] = useState(42)
  const [sysInfoRam, setSysInfoRam] = useState(67)
  const carouselRef = useRef<HTMLDivElement>(null)
  const touchXRef = useRef(0)
  const progressTriggered = useRef(false)
  const [demoNotes, setDemoNotes] = useState<string[]>(['Review PR #42', 'Ship login fix'])
  const [demoNoteInput, setDemoNoteInput] = useState('')
  const [ambientMuted, setAmbientMuted] = useState(true)
  const [trackerRunning, setTrackerRunning] = useState<Record<string, boolean>>({})
  const [builderTheme, setBuilderTheme] = useState<'dark' | 'light'>('dark')
  const [builderSize, setBuilderSize] = useState<'S' | 'M' | 'L'>('S')


  const characters = [
    { name: 'Ghost', title: 'The Chill One', desc: 'Floats gently, says "yo!" and "vibin\'". Keeps it easy, keeps it cool.', color: '#7BEAD2', bgGlow: 'rgba(123,234,210,0.12)', key: 'ghost', barColors: ['#7BEAD2','#F2A871','#C4A7F5','#F07A8B','#7BB3F5'] },
    { name: 'Cat', title: 'The Sassy One', desc: 'Says "hmph" and "pet me". Judges your milestones. Loves nap time.', color: '#F5A0C0', bgGlow: 'rgba(245,160,192,0.12)', key: 'cat', barColors: ['#F5A0C0','#A0D8F5','#F5D0A0','#C0A0F5','#A0F5C0'] },
    { name: 'Robot', title: 'The Nerdy One', desc: 'Speaks in beeps and binary. Calls your progress "optimal". Runs in batch mode.', color: '#70D0F0', bgGlow: 'rgba(112,208,240,0.12)', key: 'robot', barColors: ['#70D0F0','#F0D070','#70F0A0','#F07070','#D070F0'] },
    { name: 'Frog', title: 'The Zen One', desc: 'Says "breathe" and "om~". Calm and comfy. Celebrates when milestones hit.', color: '#90E8A0', bgGlow: 'rgba(144,232,160,0.12)', key: 'frog', barColors: ['#90E8A0','#E8D090','#90C8E8','#E890C0','#D0A0E8'] },
    { name: 'Skull', title: 'The Edgy One', desc: 'Says "grind!", "ship it", and "LGTM". No breaks. Deploy everything.', color: '#E86050', bgGlow: 'rgba(232,96,80,0.12)', key: 'skull', barColors: ['#E86050','#50B8E8','#E8D050','#B050E8','#50E8A0'] },
    { name: 'Ninja', title: 'The Silent One', desc: 'Says "..." and "*poof*". Moves in shadow. Speaks only when it matters.', color: '#A88BDB', bgGlow: 'rgba(168,139,219,0.12)', key: 'ninja', barColors: ['#A88BDB','#6BC5A0','#DB8BA8','#8BB5DB','#DBB88B'] },
  ]

  const featuresData = [
    { icon: '', title: 'Clock & Progress', desc: 'A clock that feels alive — and below it, how far through the day, the week, the month, the quarter, the year. Time in context.', type: 'clockprogress' },
    { icon: '', title: 'Custom Trackers', desc: 'Countdown to a date. A running timer. A daily goal. Your companion celebrates the milestones along the way.', type: 'trackers' },
    { icon: '', title: 'Ambient Sounds', desc: 'Rain when you need to settle in. Cafe, fire, wind. Ambient loops that just play.', type: 'waveform' },
    { icon: '', title: 'Pomodoro Timer', desc: 'When you want to focus. 25 minutes on, 5 off. Your companion reacts to each phase.', type: 'pomodoro' },
    { icon: '', title: 'Quick Notes', desc: 'A thought passes — jot it down. No app switching, no friction. Just a quick note, right there.', type: 'notes' },
    { icon: '', title: 'System Info', desc: 'CPU and RAM, quietly visible. Your companion notices when things get heavy.', type: 'sysinfo' },
    { icon: '', title: 'Idle Detection', desc: 'Step away and your companion falls asleep. Come back and it wakes up, glad you\'re here.', type: 'idle' },
    { icon: '', title: 'Click-Through', desc: 'Your mouse passes right through it. Hold Ctrl when you need it. Release and it\'s invisible again. Never in your way.', type: 'clickthrough' },
  ]

  const howItWorksSteps = [
    { num: '01', title: 'Download & Install', desc: 'Grab the lightweight app. Works on Windows, macOS, and Linux.', icon: '' },
    { num: '02', title: 'Pick Your Companion', desc: 'Choose from 6 pixel companions. Each has unique idle animations and personality.', icon: '' },
    { num: '03', title: 'Pin & Customize', desc: 'Dock it to any corner of your screen. Adjust transparency, size, and theme. Double-click your companion to minimize to a tiny floating pixel.', icon: '' },
  ]

  const faqData = [
    { q: 'What platforms does Now support?', a: 'Now supports Windows, macOS, and Linux. It runs natively on all three platforms with minimal resource usage.' },
    { q: 'How much does Now cost?', a: '$4.99 — one-time purchase. All 6 companions, all features, all platforms. No subscription.' },
    { q: 'Does it get in the way of my work?', a: 'No. The widget is click-through by default — your mouse passes right through it to the apps behind. Hold Ctrl to interact with the widget (click buttons, type notes, drag sliders). Release Ctrl and it becomes transparent to input again.' },
    { q: 'How much resources does it use?', a: 'Now is extremely lightweight. It\'s designed to be always-on without impacting your system performance.' },
    { q: 'Can I customize the widget?', a: 'Yes. You can pick your companion, adjust transparency, choose from 3 sizes (S, M, L), dock to any corner, switch between dark and light theme, and configure pomodoro presets and custom trackers.' },
    { q: 'Does it work with multiple monitors?', a: 'Yes! You can pin Now to any monitor. It stays always-on-top with a transparent background, so it sits right on your desktop.' },
    { q: 'What about privacy?', a: 'Now is 100% local. No telemetry, no analytics, no data collection. Everything runs on your machine. Your habits, notes, and data never leave your device.' },
    { q: 'Will more companions be released?', a: 'Yes! More companions are coming. New companions will be available as separate purchases.' },
    { q: 'How does the Pomodoro timer work?', a: 'Standard 25-minute focus / 5-minute break cycles with configurable presets. Your companion reacts to each phase — a message when focus starts, another when it\'s break time, and celebration when all sessions are done.' },
  ]

  const includedFeatures = [
    'All 6 companions (Ghost, Cat, Robot, Frog, Skull, Ninja)',
    'Pixel clock with retro aesthetic',
    'Pomodoro timer with companion reactions',
    'Progress bars & custom trackers',
    'Quick notes inside the widget',
    'Ambient sound player',
    'System info monitor (CPU & RAM)',
    'Idle detection with companion sleep',
    'Click-through mode (Ctrl to interact)',
    'Dark & light theme',
    '3 widget sizes (S, M, L)',
    'Multi-monitor support',
    'Windows, macOS & Linux',
    '100% local — zero telemetry',
    'All future updates',
  ]

  // Clock update
  useEffect(() => {
    const timer = setInterval(() => setClockTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Pomodoro countdown
  useEffect(() => {
    if (!pomodoroRunning) return
    const timer = setInterval(() => {
      setPomodoroSeconds(prev => {
        if (prev <= 0) { setPomodoroRunning(false); return 25 * 60 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [pomodoroRunning])

  // System info mock cycling
  useEffect(() => {
    const timer = setInterval(() => {
      setSysInfoCpu(Math.floor(Math.random() * 40) + 20)
      setSysInfoRam(Math.floor(Math.random() * 30) + 50)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0) }, [])

  // Nav scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
      setShowScrollTop(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll reveal observer
  useEffect(() => {
    const reveals = document.querySelectorAll('.now-reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('now-visible'), i * 80)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    reveals.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Progress bar trigger on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !progressTriggered.current) {
            progressTriggered.current = true
            let val = 0
            const interval = setInterval(() => {
              val += 2
              if (val >= 78) { clearInterval(interval); val = 78 }
              setProgressDemo(val)
            }, 30)
          }
        })
      },
      { threshold: 0.3 }
    )
    const el = document.getElementById('features-section')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const accentColor = characters[activeCharacter].color

  const formatTime = (date: Date) => {
    const h = (date.getHours() % 12 || 12).toString().padStart(2, '0')
    const m = date.getMinutes().toString().padStart(2, '0')
    const s = date.getSeconds().toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  const formatPomodoro = (totalSec: number) => {
    const m = Math.floor(totalSec / 60).toString().padStart(2, '0')
    const s = (totalSec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const scrollCarousel = useCallback((direction: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth * 0.72
      carouselRef.current.scrollBy({ left: direction * cardWidth, behavior: 'smooth' })
    }
  }, [])

  const featureIcons: Record<string, string> = {
    clockprogress: '\u23F0',
    pomodoro: '\u{1F345}',
    waveform: '\u{1F3B5}',
    trackers: '\u2705',
    notes: '\u{1F4DD}',
    sysinfo: '\u{1F4BB}',
    idle: '\u{1F634}',
  }

  const stepIcons = ['\u{1F4E6}', '\u{1F3AE}', '\u{1F4CC}']

  // Progress bar data — uses clockTime so it updates live
  const ct = clockTime
  const minuteOfDay = ct.getHours() * 60 + ct.getMinutes()
  const dayProgress = Math.round((minuteOfDay / 1440) * 100)
  const weekDay = ct.getDay() || 7
  const weekProgress = Math.round(((weekDay - 1 + minuteOfDay / 1440) / 7) * 100)
  const daysInMonth = new Date(ct.getFullYear(), ct.getMonth() + 1, 0).getDate()
  const monthProgress = Math.round(((ct.getDate() - 1 + minuteOfDay / 1440) / daysInMonth) * 100)
  const quarterStart = Math.floor(ct.getMonth() / 3) * 3
  const quarterProgress = Math.round(((ct.getTime() - new Date(ct.getFullYear(), quarterStart, 1).getTime()) / (new Date(ct.getFullYear(), quarterStart + 3, 1).getTime() - new Date(ct.getFullYear(), quarterStart, 1).getTime())) * 100)
  const yearProgress = Math.round(((ct.getTime() - new Date(ct.getFullYear(), 0, 1).getTime()) / (new Date(ct.getFullYear() + 1, 0, 1).getTime() - new Date(ct.getFullYear(), 0, 1).getTime())) * 100)
  const weekNum = Math.ceil((Math.floor((ct.getTime() - new Date(ct.getFullYear(), 0, 1).getTime()) / 86400000) + 1) / 7)

  return (
    <div className="now-page" style={{ '--accent': accentColor, '--accent-glow': characters[activeCharacter].bgGlow } as React.CSSProperties}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .now-page {
          --bg: #0a0a12;
          --surface: #0f0f1c;
          --surface2: #141428;
          --border: #1a1a30;
          --dim: #252545;
          --muted: #5a5a80;
          --subtle: #8888aa;
          --body: #c4c4d8;
          --bright: #eeeef8;
          --accent: #7BEAD2;
          --accent-glow: rgba(123,234,210,0.12);
          --green: #7ED321;
          --pixel-size: 4px;

          background: var(--bg);
          color: var(--body);
          font-family: 'Outfit', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          min-height: 100vh;
          position: relative;
          scroll-behavior: smooth;
          overflow-x: hidden;
          width: 100%;
          transition: --accent 0.6s ease, --accent-glow 0.6s ease;
        }

        /* Noise overlay */
        .now-page::before {
          content: '';
          position: fixed; inset: 0; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.35;
        }

        /* CRT scanline overlay */
        .now-page::after {
          content: '';
          position: fixed; inset: 0; z-index: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          );
          pointer-events: none;
        }

        .now-ambient {
          position: fixed; top: -30vh; left: 50%;
          transform: translateX(-50%);
          width: 70vw; height: 70vw; max-width: 900px;
          background: radial-gradient(ellipse, var(--accent-glow) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
          animation: now-breathe 8s ease-in-out infinite;
          transition: background 0.8s ease;
        }

        .now-container { max-width: 1200px; margin: 0 auto; padding: 0 2.5rem; position: relative; z-index: 1; box-sizing: border-box; width: 100%; }

        /* KEYFRAME ANIMATIONS */
        @keyframes now-breathe {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
          50%       { opacity: 1;   transform: translateX(-50%) scale(1.1); }
        }

        @keyframes now-fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes now-pixelPulse {
          0%, 100% { opacity: 0.15; }
          50%       { opacity: 0.35; }
        }

        @keyframes now-bob {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }

        @keyframes now-bobSlow {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
        }

        @keyframes now-blink {
          0%, 45%, 55%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @keyframes now-wave {
          0%, 100% { height: 4px; }
          50%       { height: 20px; }
        }

        @keyframes now-float {
          0%, 100% { transform: translate(0, 0); opacity: 0.6; }
          25% { transform: translate(10px, -20px); opacity: 1; }
          50% { transform: translate(-5px, -40px); opacity: 0.4; }
          75% { transform: translate(15px, -60px); opacity: 0.8; }
        }

        @keyframes now-floatUp {
          0%   { transform: translateY(0) scale(1); opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }

        @keyframes now-scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        @keyframes now-glitch {
          0%, 100% { text-shadow: 2px 0 var(--accent), -2px 0 #f87171; }
          25% { text-shadow: -2px 0 var(--accent), 2px 0 #f87171; }
          50% { text-shadow: 2px 2px var(--accent), -2px -2px #f87171; }
          75% { text-shadow: -1px 2px var(--accent), 1px -2px #f87171; }
        }

        @keyframes now-progressFill {
          from { width: 0%; }
          to { width: 78%; }
        }

        @keyframes now-checkPop {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(0deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        @keyframes now-dotTravel {
          0% { left: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }

        @keyframes now-borderMarch {
          0% { background-position: 0 0; }
          100% { background-position: 16px 0; }
        }

        @keyframes now-crtGlow {
          0%, 100% { text-shadow: 0 0 10px var(--accent), 0 0 20px var(--accent), 0 0 40px var(--accent); }
          50% { text-shadow: 0 0 5px var(--accent), 0 0 15px var(--accent), 0 0 30px var(--accent); }
        }

        @keyframes now-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }

        /* Scroll reveal */
        .now-reveal {
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .now-reveal.now-visible { opacity: 1; transform: translateY(0); }

        /* NAV */
        .now-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 101;
          padding: 1rem 2rem;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid transparent;
          transition: all 0.3s;
          backdrop-filter: blur(0px);
        }
        .now-nav.scrolled {
          background: rgba(10,10,18,0.88);
          border-bottom-color: var(--border);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .now-nav-logo {
          font-family: 'Silkscreen', cursive;
          font-weight: 700; font-size: 1.3rem;
          color: var(--bright); letter-spacing: 0.02em;
          display: flex; align-items: center; gap: 0.6rem;
          cursor: pointer; text-decoration: none;
        }
        .now-nav-logo-icon {
          display: flex; align-items: center; justify-content: center;
          animation: now-bob 3s ease-in-out infinite;
          transition: box-shadow 0.6s ease;
        }
        .now-nav a {
          color: var(--subtle); text-decoration: none; font-size: 0.875rem;
          transition: color 0.2s; font-weight: 400;
        }
        .now-nav a:hover { color: var(--bright); }
        .now-nav-links { display: flex; gap: 2rem; align-items: center; }
        .now-nav-cta {
          background: var(--accent) !important;
          color: #0a0a12 !important;
          padding: 0.5rem 1.25rem;
          border-radius: 4px;
          font-weight: 600; font-size: 0.875rem;
          font-family: 'Silkscreen', cursive;
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.3s, background 0.6s !important;
          box-shadow: 0 0 20px var(--accent-glow);
          image-rendering: pixelated;
        }
        .now-nav-cta:hover { opacity: 0.9 !important; transform: translateY(-1px); box-shadow: 0 0 30px var(--accent-glow); }

        /* Pixel border animation for nav */
        .now-nav.scrolled::after {
          content: '';
          position: absolute; bottom: -1px; left: 0; right: 0; height: 2px;
          background: repeating-linear-gradient(
            90deg,
            var(--accent) 0px,
            var(--accent) 4px,
            transparent 4px,
            transparent 8px
          );
          animation: now-borderMarch 0.5s linear infinite;
          opacity: 0.4;
          transition: opacity 0.3s;
        }

        /* HERO */
        .now-hero {
          min-height: auto;
          display: flex; flex-direction: column;
          align-items: center; justify-content: flex-start;
          text-align: center;
          padding: 8rem 2rem 4rem;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 641px) and (orientation: landscape) {
          .now-hero {
            min-height: 100vh;
            justify-content: center;
            padding: 8rem 2rem 5rem;
          }
        }

        /* Pixel grid background — CSS dot pattern with shimmer */
        .now-pixel-grid {
          position: absolute; inset: 0; z-index: 0;
          pointer-events: none;
          background-image: radial-gradient(circle, var(--accent) 1.5px, transparent 1.5px);
          background-size: 24px 24px;
          opacity: 0.08;
          animation: now-pixelPulse 4s ease-in-out infinite;
          transition: background-image 0.6s ease;
          mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%);
          -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%);
        }
        .now-pixel-grid::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, var(--accent-glow) 50%, transparent 60%);
          background-size: 200% 100%;
          animation: now-gridShimmer 6s ease-in-out infinite;
          opacity: 0.6;
        }
        @keyframes now-gridShimmer {
          0%, 100% { background-position: 200% 0; }
          50% { background-position: -200% 0; }
        }

        /* Minecraft-style twinkling pixel cells */
        .now-cell-grid {
          position: absolute; inset: 0; z-index: 0;
          pointer-events: none;
          overflow: hidden;
          mask-image: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.4) 70%, transparent 100%);
          -webkit-mask-image: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.4) 70%, transparent 100%);
        }
        .now-cell-layer {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(var(--accent) 1px, transparent 1px),
            linear-gradient(90deg, var(--accent) 1px, transparent 1px);
          background-size: 24px 24px;
          opacity: 0.04;
        }
        .now-cell-dot {
          position: absolute;
          width: 22px; height: 22px;
          background: var(--accent);
          opacity: 0;
          animation: now-pixelPulse 4s ease-in-out infinite;
          transition: background 0.6s ease;
        }

        /* Floating particles */
        .now-particle {
          position: absolute;
          width: 4px; height: 4px;
          background: var(--accent);
          border-radius: 0;
          opacity: 0;
          animation: now-floatUp linear infinite;
          pointer-events: none;
          transition: background 0.6s ease;
        }

        /* CRT scanline sweep */
        .now-scanline-sweep {
          position: absolute; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(180deg, transparent, var(--accent-glow), transparent);
          animation: now-scanline 8s linear infinite;
          pointer-events: none; z-index: 1;
          opacity: 0.5;
        }

        .now-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          border: 1px solid var(--dim);
          background: rgba(123,234,210,0.06);
          border-radius: 4px;
          padding: 0.35rem 1rem;
          font-size: 0.75rem;
          color: var(--accent);
          font-family: 'Space Mono', monospace;
          margin-bottom: 2rem;
          animation: now-fadeUp 0.6s ease both;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          position: relative; z-index: 2;
          transition: color 0.6s ease, border-color 0.6s ease;
        }
        .now-badge-dot {
          width: 6px; height: 6px; border-radius: 0;
          background: var(--accent);
          animation: now-pulse 2s ease-in-out infinite;
          transition: background 0.6s ease;
        }
        .now-hero h1 {
          font-family: 'Silkscreen', cursive;
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 700; line-height: 1.1;
          letter-spacing: 0.01em;
          color: var(--bright);
          margin: 0 0 1.5rem;
          animation: now-fadeUp 0.6s 0.1s ease both;
          position: relative; z-index: 2;
        }
        .now-crt-text {
          color: var(--accent);
          animation: now-crtGlow 3s ease-in-out infinite;
          transition: color 0.6s ease;
        }
        .now-hero-sub {
          font-size: clamp(1rem, 2.2vw, 1.2rem);
          color: var(--subtle);
          max-width: 600px;
          margin: 0 auto 1rem;
          font-weight: 300;
          animation: now-fadeUp 0.6s 0.2s ease both;
          position: relative; z-index: 2;
        }

        /* Hero widget mock — matches actual widget HTML */
        .now-hwm {
          background: rgba(22, 20, 28, 0.80);
          border: 2px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          padding: 18px;
          max-width: 310px;
          margin: 1.5rem auto 2rem;
          animation: now-fadeUp 0.6s 0.25s ease both;
          position: relative; z-index: 2;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 60px var(--accent-glow);
          backdrop-filter: blur(12px);
          font-family: 'Silkscreen', cursive;
          user-select: none;
          transition: background 0.4s, box-shadow 0.6s;
        }
        /* Sys info strip */
        .now-hwm-sys {
          display: flex; align-items: center; justify-content: flex-end; gap: 8px;
          padding: 0 0 6px; font-size: 6px;
        }
        .now-hwm-sys-label { letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.2); }
        .now-hwm-sys-val { font-weight: 700; color: rgba(255,255,255,0.4); font-size: 8px; }
        .now-hwm-sys-sep { width: 1px; height: 8px; background: rgba(255,255,255,0.06); }
        /* Top row: character + clock */
        .now-hwm-top {
          display: flex; align-items: flex-end; gap: 14px;
          margin-bottom: 14px; padding-bottom: 12px;
          border-bottom: 2px solid rgba(255,255,255,0.05);
          position: relative;
        }
        .now-hwm-clock-wrap { flex: 1; }
        .now-hwm-time {
          font-size: 24px; font-weight: 700; line-height: 1;
          color: #F0ECE4; display: flex; align-items: baseline; gap: 1px;
        }
        .now-hwm-colon { animation: blink 1s step-end infinite; color: #3E3848; }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.15; } }
        .now-hwm-sec { font-size: 11px; margin-left: 3px; color: #6A6474; }
        .now-hwm-date { font-size: 8px; margin-top: 5px; color: #6A6474; text-align: left; }
        .now-hwm-gear {
          position: absolute; top: 0; right: 0; width: 20px; height: 20px;
          display: flex; align-items: center; justify-content: center; opacity: 0.2;
        }
        .now-hwm-gear svg { width: 12px; height: 12px; fill: none; stroke: #F0ECE4; stroke-width: 1.5; }
        /* Bars */
        .now-hwm-bars { display: flex; flex-direction: column; gap: 3px; }
        .now-hwm-bar {
          display: flex; align-items: center; gap: 8px; padding: 4px 0;
        }
        .now-hwm-bar-label {
          width: 42px; min-width: 42px; font-size: 8px; color: #A8A2B0;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .now-hwm-bar-track {
          flex: 1; height: 7px; border-radius: 2px; overflow: hidden;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.04);
        }
        .now-hwm-bar-fill {
          height: 100%; border-radius: 1px; position: relative;
          background-image: repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(0,0,0,0.15) 6px, rgba(0,0,0,0.15) 8px);
        }
        .now-hwm-bar-val {
          min-width: 32px; text-align: right; font-size: 7px; color: #6A6474; white-space: nowrap;
        }
        .now-hwm-bar-sep { height: 1px; margin: 3px 0; background: rgba(255,255,255,0.04); }
        /* Pomodoro strip */
        .now-hwm-pomo {
          margin-top: 10px; padding-top: 10px; display: flex; align-items: center; gap: 10px;
          border-top: 2px solid rgba(255,255,255,0.04);
        }
        .now-hwm-pomo-ring {
          width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
          border: 3px solid rgba(255,255,255,0.06); position: relative;
          display: flex; align-items: center; justify-content: center;
        }
        .now-hwm-pomo-ring::after {
          content: ''; position: absolute; inset: -3px;
          border-radius: 50%; border: 3px solid transparent;
          transition: border-color 0.6s;
        }
        .now-hwm-pomo-center { font-size: 7px; font-weight: 700; color: #A8A2B0; }
        .now-hwm-pomo-info { flex: 1; display: flex; flex-direction: column; gap: 2px; text-align: left; }
        .now-hwm-pomo-label { font-size: 7px; letter-spacing: 0.1em; text-transform: uppercase; color: #6A6474; }
        .now-hwm-pomo-timer { font-size: 14px; font-weight: 700; color: #F0ECE4; letter-spacing: 0.04em; }
        .now-hwm-pomo-dots { display: flex; gap: 3px; margin-top: 1px; }
        .now-hwm-pomo-dot { width: 5px; height: 5px; border-radius: 2px; background: rgba(255,255,255,0.08); }
        .now-hwm-pomo-dot.done { background: var(--accent); transition: background 0.6s; }
        .now-hwm-pomo-btns { display: flex; gap: 3px; }
        .now-hwm-pomo-btn {
          width: 24px; height: 24px; border-radius: 5px; border: none;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Silkscreen', cursive; font-size: 9px;
          background: rgba(255,255,255,0.06); color: #A8A2B0; cursor: default;
        }
        /* Footer */
        .now-hwm-foot {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 10px; padding-top: 8px;
          border-top: 2px solid rgba(255,255,255,0.04);
        }
        .now-hwm-foot-left { display: flex; align-items: center; gap: 5px; }
        .now-hwm-foot-label { font-size: 7px; color: #3E3848; letter-spacing: 0.12em; }
        .now-hwm-foot-actions { display: flex; gap: 3px; }
        .now-hwm-foot-btn {
          width: 20px; height: 20px; border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.25);
        }
        .now-hwm-foot-btn svg { width: 10px; height: 10px; stroke: currentColor; fill: none; stroke-width: 1.5; }

        .now-hero-actions {
          display: flex; gap: 1rem; align-items: center; justify-content: center;
          flex-wrap: wrap;
          animation: now-fadeUp 0.6s 0.3s ease both;
          position: relative; z-index: 2;
        }
        .now-btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: var(--accent);
          color: #0a0a12; font-weight: 700;
          padding: 0.85rem 2rem; border-radius: 4px;
          text-decoration: none; font-size: 1rem;
          transition: all 0.2s;
          box-shadow: 0 0 32px var(--accent-glow);
          border: none; cursor: pointer;
          font-family: 'Silkscreen', cursive;
        }
        .now-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 48px var(--accent-glow); }
        .now-btn-secondary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          border: 2px solid var(--dim);
          color: var(--body); font-weight: 500;
          padding: 0.8rem 2rem; border-radius: 4px;
          text-decoration: none; font-size: 1rem;
          transition: all 0.2s; background: transparent;
        }
        .now-btn-secondary:hover { border-color: var(--accent); color: var(--bright); }
        .now-price-hint {
          margin-top: 1rem; font-size: 0.78rem;
          color: var(--muted); font-family: 'Space Mono', monospace;
          animation: now-fadeUp 0.6s 0.4s ease both;
          position: relative; z-index: 2;
        }
        .now-price-hint strong { color: var(--green); }

        /* CHARACTER PREVIEW ROW IN HERO */
        .now-hero-characters {
          display: flex; gap: 1.5rem; justify-content: center; align-items: center;
          margin-top: 3rem;
          animation: now-fadeUp 0.6s 0.5s ease both;
          position: relative; z-index: 2;
        }
        .now-hero-char {
          cursor: default;
          filter: grayscale(0.5);
          transition: filter 0.3s, transform 0.3s;
        }
        .now-hero-char:hover { filter: grayscale(0); transform: scale(1.2); }

        /* SECTIONS */
        .now-section-label {
          font-family: 'Space Mono', monospace; font-size: 0.72rem;
          text-transform: uppercase; letter-spacing: 0.14em;
          color: var(--accent); margin-bottom: 1rem; text-align: center;
          transition: color 0.6s ease;
        }
        .now-section-title {
          font-family: 'Silkscreen', cursive;
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: 700; color: var(--bright);
          text-align: center; letter-spacing: 0.01em;
          margin-bottom: 1rem;
        }
        .now-section-sub {
          text-align: center; color: var(--muted);
          max-width: 520px; margin: 0 auto 4rem; font-size: 1rem;
        }

        /* CHARACTERS CAROUSEL */
        .now-carousel-wrap {
          position: relative;
          max-width: 100%;
        }
        .now-carousel {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 1rem 0 2rem;
        }
        .now-carousel::-webkit-scrollbar { display: none; }
        .now-char-card {
          flex: 0 0 280px;
          scroll-snap-align: center;
          background: var(--surface);
          border: 2px solid var(--border);
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        .now-char-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle at center, var(--card-glow, transparent) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s;
        }
        .now-char-card:hover::before { opacity: 1; }
        .now-char-card.active {
          border-color: var(--accent);
          box-shadow: 0 0 40px var(--accent-glow), inset 0 0 40px var(--accent-glow);
          transform: translateY(-4px);
        }
        .now-char-card.active::before { opacity: 1; }
        .now-char-pixel {
          margin-bottom: 1rem;
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: center;
        }
        .now-char-name {
          font-family: 'Silkscreen', cursive;
          font-weight: 700; font-size: 1.1rem;
          color: var(--bright); margin-bottom: 0.25rem;
          position: relative; z-index: 1;
        }
        .now-char-title {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem; text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
          position: relative; z-index: 1;
          transition: color 0.3s;
        }
        .now-char-desc {
          font-size: 0.85rem; color: var(--muted);
          line-height: 1.5;
          position: relative; z-index: 1;
        }
        .now-carousel-arrow {
          position: absolute; top: 50%;
          transform: translateY(-50%);
          width: 36px; height: 36px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--muted);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 3;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .now-carousel-arrow:hover { border-color: var(--accent); color: var(--bright); }
        .now-carousel-arrow.left { left: -0.5rem; }
        .now-carousel-arrow.right { right: -0.5rem; }
        .now-theme-hint {
          text-align: center;
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          color: var(--muted);
          margin-top: 1rem;
        }

        /* FEATURES */
        .now-features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        .now-feature-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.75rem;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .now-feature-card:hover {
          border-color: var(--dim);
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }
        .now-feature-icon { font-size: 1.5rem; margin-bottom: 0.75rem; }
        .now-feature-title {
          font-family: 'Silkscreen', cursive; font-weight: 700;
          color: var(--bright); margin-bottom: 0.4rem; font-size: 0.95rem;
        }
        .now-feature-desc { color: var(--muted); font-size: 0.85rem; line-height: 1.55; margin-bottom: 1rem; }

        /* Feature demos */
        .now-feature-demo {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 0.75rem;
          min-height: 50px;
          display: flex; align-items: center; justify-content: center;
        }

        /* Clock demo */
        .now-demo-clock {
          font-family: 'Silkscreen', cursive;
          font-size: 1.3rem;
          color: var(--accent);
          text-shadow: 0 0 10px var(--accent-glow);
          letter-spacing: 0.1em;
          transition: color 0.6s ease;
        }

        /* Progress bar demo */
        .now-demo-progress {
          width: 100%; display: flex; flex-direction: column; gap: 0.4rem;
        }
        .now-demo-progress-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          color: var(--muted);
          display: flex; justify-content: space-between;
        }
        .now-demo-progress-bar {
          width: 100%; height: 12px;
          background: var(--border);
          border-radius: 2px;
          overflow: hidden;
        }
        .now-demo-progress-fill {
          height: 100%;
          background: var(--accent);
          border-radius: 2px;
          transition: width 0.3s ease, background 0.6s ease;
          box-shadow: 0 0 8px var(--accent-glow);
          image-rendering: pixelated;
        }

        /* Pomodoro demo */
        .now-demo-pomodoro {
          display: flex; align-items: center; gap: 10px; width: 100%;
          font-family: 'Silkscreen', cursive;
        }
        .now-demo-pomo-ring {
          width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
          border: 3px solid rgba(255,255,255,0.06); position: relative;
          display: flex; align-items: center; justify-content: center;
        }
        .now-demo-pomo-ring::after {
          content: ''; position: absolute; inset: -3px;
          border-radius: 50%; border: 3px solid transparent;
          transition: border-color 0.6s;
        }
        .now-demo-pomo-ring.running::after {
          border-top-color: var(--accent);
        }
        .now-demo-pomo-center { font-size: 8px; font-weight: 700; color: #A8A2B0; }
        .now-demo-pomo-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .now-demo-pomo-label { font-size: 7px; letter-spacing: 0.1em; text-transform: uppercase; color: #6A6474; }
        .now-demo-pomo-timer { font-size: 16px; font-weight: 700; color: #F0ECE4; letter-spacing: 0.04em; }
        .now-demo-pomo-dots { display: flex; gap: 3px; margin-top: 1px; }
        .now-demo-pomo-dot { width: 5px; height: 5px; border-radius: 2px; background: rgba(255,255,255,0.08); }
        .now-demo-pomo-dot.done { background: var(--accent); transition: background 0.6s; }
        .now-demo-pomo-btns { display: flex; gap: 3px; }
        .now-demo-pomo-btn {
          width: 26px; height: 26px; border-radius: 5px; border: none;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Silkscreen', cursive; font-size: 10px;
          background: rgba(255,255,255,0.06); color: #A8A2B0; cursor: pointer;
          transition: all 0.2s;
        }
        .now-demo-pomo-btn:hover { background: rgba(255,255,255,0.1); color: #F0ECE4; }
        .now-demo-pomo-btn.active { background: var(--accent); color: #fff; }

        /* Waveform demo */
        .now-demo-waveform {
          display: flex; align-items: center; gap: 3px; height: 32px;
        }
        .now-wave-bar {
          width: 4px;
          background: var(--accent);
          border-radius: 0;
          animation: now-wave 0.8s ease-in-out infinite;
          opacity: 0.7;
          transition: background 0.6s ease;
        }
        .now-wave-bar:nth-child(1) { animation-delay: 0s; }
        .now-wave-bar:nth-child(2) { animation-delay: 0.1s; }
        .now-wave-bar:nth-child(3) { animation-delay: 0.2s; }
        .now-wave-bar:nth-child(4) { animation-delay: 0.3s; }
        .now-wave-bar:nth-child(5) { animation-delay: 0.15s; }
        .now-wave-bar:nth-child(6) { animation-delay: 0.25s; }
        .now-wave-bar:nth-child(7) { animation-delay: 0.05s; }
        .now-wave-bar:nth-child(8) { animation-delay: 0.35s; }
        .now-wave-bar:nth-child(9) { animation-delay: 0.12s; }
        .now-wave-bar:nth-child(10) { animation-delay: 0.28s; }
        .now-wave-bar:nth-child(11) { animation-delay: 0.08s; }
        .now-wave-bar:nth-child(12) { animation-delay: 0.22s; }

        /* Sysinfo demo */
        .now-demo-sysinfo {
          display: flex; gap: 1.5rem; width: 100%;
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
        }
        .now-sysinfo-item {
          display: flex; flex-direction: column; gap: 0.25rem; flex: 1;
        }
        .now-sysinfo-label { color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.6rem; }
        .now-sysinfo-value {
          color: var(--accent);
          font-family: 'Silkscreen', cursive;
          font-size: 1rem;
          transition: color 0.3s, all 0.3s;
        }
        .now-sysinfo-bar {
          height: 8px; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 2px; overflow: hidden;
        }
        .now-sysinfo-fill {
          height: 100%;
          background-color: var(--accent);
          background-image: repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(0,0,0,0.15) 6px, rgba(0,0,0,0.15) 8px);
          border-radius: 1px;
          transition: width 0.8s ease, background-color 0.6s ease;
        }

        /* Habits demo */
        .now-demo-habits {
          display: flex; gap: 0.5rem; width: 100%; justify-content: center;
        }
        .now-habit-day {
          width: 20px; height: 20px;
          background: var(--border);
          border-radius: 2px;
          transition: background 0.3s;
        }
        .now-habit-day.done {
          background: var(--accent);
          box-shadow: 0 0 6px var(--accent-glow);
          transition: background 0.6s ease;
        }

        /* Notes demo */
        .now-demo-notes {
          width: 100%;
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          color: var(--subtle);
          line-height: 1.6;
        }
        .now-note-line { display: flex; gap: 0.5rem; }
        .now-note-bullet { color: var(--accent); transition: color 0.6s ease; }

        /* Idle demo */
        .now-demo-idle-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer;
        }
        .now-demo-idle-char { position: relative; display: flex; align-items: center; justify-content: center; }
        .now-demo-idle-zzz {
          position: absolute; top: -4px; right: -6px;
          font-family: 'Silkscreen', cursive; font-size: 9px; font-weight: 700;
          color: rgba(255,255,255,0.2);
          animation: now-float 2s ease-in-out infinite;
        }
        .now-demo-idle-status {
          font-family: 'Space Mono', monospace; font-size: 0.6rem; color: var(--dim);
        }
        .now-demo-idle-wake {
          display: none; flex-direction: column; align-items: center; gap: 4px;
        }
        .now-demo-idle-bubble {
          font-family: 'Silkscreen', cursive; font-size: 7px;
          padding: 3px 8px; border-radius: 6px 6px 6px 2px;
          color: #fff; white-space: nowrap; transition: background 0.6s;
        }
        .now-demo-idle-msg {
          font-family: 'Space Mono', monospace; font-size: 0.55rem; color: var(--muted);
        }

        /* HOW IT WORKS */
        .now-steps {
          display: flex;
          gap: 0;
          position: relative;
          justify-content: center;
          align-items: flex-start;
        }
        .now-step {
          flex: 1;
          max-width: 320px;
          text-align: center;
          padding: 0 1.5rem;
          position: relative;
        }
        .now-step-num {
          font-family: 'Silkscreen', cursive;
          font-size: 2.5rem;
          color: var(--accent);
          margin-bottom: 1rem;
          position: relative;
          display: inline-block;
          text-shadow: 0 0 20px var(--accent-glow);
          transition: color 0.6s ease, text-shadow 0.6s ease;
        }
        .now-step-icon {
          font-size: 2rem; margin-bottom: 0.75rem;
          height: 40px;
          display: flex; align-items: center; justify-content: center;
        }
        .now-step-title {
          font-family: 'Silkscreen', cursive;
          font-weight: 700; font-size: 1rem;
          color: var(--bright); margin-bottom: 0.5rem;
        }
        .now-step-desc {
          color: var(--muted); font-size: 0.88rem; line-height: 1.55;
        }
        /* Connecting line between steps */
        .now-step-connector {
          position: absolute;
          top: 2rem;
          right: -2rem;
          width: 4rem;
          height: 2px;
          overflow: hidden;
        }
        .now-step-connector::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: repeating-linear-gradient(
            90deg,
            var(--accent) 0px,
            var(--accent) 4px,
            transparent 4px,
            transparent 8px
          );
          animation: now-borderMarch 0.8s linear infinite;
          opacity: 0.5;
        }
        .now-step-connector-dot {
          position: absolute;
          top: -3px; width: 8px; height: 8px;
          background: var(--accent);
          border-radius: 0;
          animation: now-dotTravel 2s linear infinite;
          box-shadow: 0 0 6px var(--accent-glow);
        }

        /* WIDGET BUILDER */
        .now-builder {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }
        .now-builder-controls {
          display: flex; flex-direction: column; gap: 1.5rem;
        }
        .now-builder-group {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.25rem;
        }
        .now-builder-group-title {
          font-family: 'Silkscreen', cursive;
          font-size: 0.75rem;
          color: var(--bright);
          margin-bottom: 0.75rem;
          text-transform: uppercase;
        }
        .now-builder-chars {
          display: flex; gap: 0.5rem; flex-wrap: wrap;
        }
        .now-builder-char-btn {
          width: 42px; height: 42px;
          background: var(--bg);
          border: 2px solid var(--border);
          border-radius: 4px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          padding: 2px;
        }
        .now-builder-char-btn:hover { border-color: var(--dim); }
        .now-builder-char-btn.active {
          border-color: var(--accent);
          box-shadow: 0 0 12px var(--accent-glow);
          background: var(--surface2);
        }
        .now-builder-positions {
          display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;
        }
        .now-builder-pos-btn {
          padding: 0.4rem;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--muted);
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .now-builder-pos-btn:hover { border-color: var(--dim); color: var(--body); }
        .now-builder-pos-btn.active {
          border-color: var(--accent);
          color: var(--bright);
          background: var(--surface2);
        }
        .now-builder-toggle {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.35rem 0;
        }
        .now-builder-toggle-label {
          font-size: 0.85rem; color: var(--body);
        }
        .now-toggle-switch {
          width: 36px; height: 20px;
          background: var(--border);
          border-radius: 2px;
          position: relative;
          cursor: pointer;
          transition: background 0.2s;
          border: none;
        }
        .now-toggle-switch.on { background: var(--accent); }
        .now-toggle-switch::after {
          content: '';
          position: absolute;
          top: 2px; left: 2px;
          width: 16px; height: 16px;
          background: var(--bright);
          border-radius: 1px;
          transition: transform 0.2s;
        }
        .now-toggle-switch.on::after { transform: translateX(16px); }
        .now-builder-slider {
          display: flex; align-items: center; gap: 0.75rem;
        }
        .now-builder-slider input[type="range"] {
          flex: 1;
          -webkit-appearance: none;
          height: 6px;
          background: var(--border);
          border-radius: 0;
          outline: none;
        }
        .now-builder-slider input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          background: var(--accent);
          border-radius: 0;
          cursor: pointer;
        }
        .now-builder-slider-val {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          color: var(--accent);
          min-width: 2.5rem;
          text-align: right;
          transition: color 0.6s ease;
        }

        /* Widget preview */
        .now-builder-preview {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1rem;
          position: relative;
          min-height: 400px;
        }
        .now-preview-desktop {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          border-radius: 6px;
          width: 100%;
          height: 350px;
          position: relative;
          overflow: hidden;
          border: 1px solid var(--border);
        }
        .now-preview-taskbar {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 32px;
          background: rgba(0,0,0,0.6);
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center;
          padding: 0 0.75rem;
          gap: 0.5rem;
        }
        .now-preview-taskbar-dot {
          width: 8px; height: 8px;
          background: rgba(255,255,255,0.15);
          border-radius: 1px;
        }
        .now-preview-widget {
          position: absolute;
          background: rgba(10,10,18,0.85);
          border: 1px solid rgba(123,234,210,0.2);
          border-radius: 6px;
          padding: 0.75rem;
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          transition: all 0.5s ease;
          min-width: 100px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }
        .now-preview-widget-char {
          display: flex; align-items: center; justify-content: center;
        }
        .now-preview-widget-clock {
          font-family: 'Silkscreen', cursive;
          font-size: 0.7rem;
          color: var(--accent);
          transition: color 0.6s ease;
        }
        .now-preview-widget-pomodoro {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          color: var(--muted);
          display: flex; align-items: center; gap: 0.3rem;
        }
        .now-preview-widget-pomodoro-dot {
          width: 5px; height: 5px;
          background: #f87171;
          border-radius: 0;
          animation: now-pulse 1.5s ease-in-out infinite;
        }
        .now-preview-widget-habits {
          display: flex; gap: 2px;
        }
        .now-preview-habit-box {
          width: 6px; height: 6px;
          border-radius: 0;
        }
        .now-preview-label {
          position: absolute; bottom: 40px; left: 50%;
          transform: translateX(-50%);
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          color: rgba(255,255,255,0.2);
          white-space: nowrap;
        }

        /* PRICING */
        .now-pricing-card {
          background: var(--surface);
          border: 2px solid var(--accent);
          border-radius: 8px;
          overflow: hidden;
          max-width: 700px;
          margin: 0 auto;
          position: relative;
          transition: border-color 0.6s ease;
        }
        .now-pricing-card::before {
          content: '';
          position: absolute; inset: -1px;
          background: linear-gradient(135deg, var(--accent-glow), transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        .now-pricing-inner {
          display: grid;
          grid-template-columns: 240px 1fr;
          position: relative; z-index: 1;
        }
        .now-pricing-left {
          padding: 2.5rem;
          display: flex; flex-direction: column;
          border-right: 1px solid var(--border);
        }
        .now-plan-name {
          font-family: 'Silkscreen', cursive; font-weight: 700;
          color: var(--accent); font-size: 0.85rem;
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 1rem;
          transition: color 0.6s ease;
        }
        .now-plan-price {
          font-family: 'Silkscreen', cursive; font-weight: 700;
          font-size: 3rem; color: var(--bright);
          letter-spacing: -0.02em; line-height: 1;
          margin-bottom: 0.5rem;
        }
        .now-plan-note { font-size: 0.8rem; color: var(--muted); margin-bottom: 2rem; line-height: 1.5; }
        .now-plan-cta {
          display: block; text-align: center;
          padding: 0.85rem; border-radius: 4px;
          font-weight: 700; font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.3s;
          margin-top: auto;
          background: var(--accent); color: var(--bg);
          box-shadow: 0 0 24px var(--accent-glow);
          border: none; cursor: pointer;
          font-family: 'Silkscreen', cursive;
        }
        .now-plan-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 40px var(--accent-glow);
        }
        .now-plan-features {
          list-style: none;
          display: flex; flex-direction: column; gap: 0.65rem;
          padding: 2rem;
          margin: 0;
        }
        .now-plan-features li {
          display: flex; align-items: flex-start; gap: 0.6rem;
          font-size: 0.88rem; color: var(--body);
        }
        .now-plan-check {
          color: var(--accent); flex-shrink: 0; margin-top: 0.1rem;
          font-weight: 700;
          transition: color 0.6s ease;
        }
        .now-plan-check.animated {
          animation: now-checkPop 0.4s ease both;
        }

        /* Pricing hover glow */
        .now-pricing-card:hover {
          box-shadow: 0 0 60px var(--accent-glow), 0 0 120px var(--accent-glow);
        }

        /* FAQ */
        .now-faq-list { max-width: 700px; margin: 3rem auto 0; }
        .now-faq-item { border-bottom: 1px solid var(--border); }
        .now-faq-item:first-child { border-top: 1px solid var(--border); }
        .now-faq-q {
          font-family: 'Outfit', sans-serif; font-weight: 600;
          color: var(--bright); font-size: 0.95rem;
          cursor: pointer; background: none; border: none; width: 100%;
          display: flex; justify-content: space-between; align-items: center;
          gap: 1rem; text-align: left; padding: 1.25rem 0;
          transition: color 0.2s;
        }
        .now-faq-q:hover { color: var(--accent); }
        .now-faq-arrow {
          color: var(--muted);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
          font-size: 0.8rem;
        }
        .now-faq-item.open .now-faq-arrow { transform: rotate(180deg); }
        .now-faq-a {
          color: var(--muted); font-size: 0.88rem; line-height: 1.7;
          max-height: 0; overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0;
        }
        .now-faq-item.open .now-faq-a { max-height: 300px; padding-bottom: 1.25rem; }

        /* FOOTER */
        .now-footer {
          padding: 2.5rem 0 0;
          position: relative; z-index: 1;
        }
        .now-footer-border {
          height: 4px;
          background: repeating-linear-gradient(
            90deg,
            var(--accent) 0px,
            var(--accent) 8px,
            transparent 8px,
            transparent 16px
          );
          animation: now-borderMarch 1s linear infinite;
          opacity: 0.5;
          margin-bottom: 2rem;
          transition: background 0.6s ease;
        }
        .now-footer-inner {
          text-align: center; padding-bottom: 2.5rem;
        }
        .now-footer-logo {
          font-family: 'Silkscreen', cursive; font-weight: 700;
          color: var(--bright); font-size: 1.1rem; margin-bottom: 0.5rem;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
        }
        .now-footer-logo-icon {
          display: flex; align-items: center; justify-content: center;
          animation: now-bob 3s ease-in-out infinite;
        }
        .now-footer-sub { font-size: 0.78rem; color: var(--muted); }
        .now-footer-chars {
          display: flex; gap: 1rem; justify-content: center; align-items: center;
          margin-top: 1rem;
        }
        .now-footer-char {
          display: inline-flex; align-items: center; justify-content: center;
        }

        /* SCROLL TO TOP */
        .now-scroll-top {
          position: fixed;
          bottom: 2rem; right: 2rem;
          width: 40px; height: 40px;
          border-radius: 4px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--muted);
          font-size: 1rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; pointer-events: none;
          transform: translateY(12px);
          transition: opacity 0.3s, transform 0.3s, border-color 0.2s, color 0.2s;
          z-index: 100;
          font-family: 'Silkscreen', cursive;
        }
        .now-scroll-top.visible {
          opacity: 1; pointer-events: auto;
          transform: translateY(0);
        }
        .now-scroll-top:hover {
          border-color: var(--accent); color: var(--bright);
        }

        /* HAMBURGER */
        .now-hamburger {
          display: none;
          background: none; border: none; cursor: pointer;
          width: 40px; height: 40px;
          flex-direction: column; align-items: center; justify-content: center; gap: 5px;
          padding: 0; z-index: 101;
          -webkit-tap-highlight-color: transparent;
          flex-shrink: 0;
        }
        .now-hamburger span {
          display: block; width: 22px; height: 2px;
          background: var(--bright); border-radius: 1px;
          transition: transform 0.3s, opacity 0.3s;
          transform-origin: center center;
        }
        .now-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .now-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .now-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* MOBILE MENU */
        .now-mobile-menu {
          display: none;
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(10,10,18,0.97);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          z-index: 100;
          flex-direction: column; align-items: center; justify-content: center;
          gap: 2rem;
        }
        .now-mobile-menu.open { display: flex; }
        .now-mobile-menu a {
          font-family: 'Silkscreen', cursive; font-weight: 700;
          font-size: 1.2rem; color: var(--subtle);
          text-decoration: none; transition: color 0.2s;
        }
        .now-mobile-menu a:hover { color: var(--bright); }
        .now-mobile-menu .now-nav-cta {
          font-size: 1rem; margin-top: 1rem;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .now-features-grid { grid-template-columns: 1fr; }
          .now-builder { grid-template-columns: 1fr; }
          .now-steps { flex-direction: column; align-items: center; gap: 2rem; }
          .now-step-connector { display: none; }
        }

        @media (max-width: 640px) {
          .now-hamburger { display: flex; }
          .now-nav-links { display: none; }
          .now-nav { padding: 0.75rem 1rem; }
          .now-container { padding: 0 1rem; }
          .now-hero { padding: 5rem 1rem 2.5rem; min-height: auto; }
          .now-hero h1 { font-size: clamp(1.3rem, 7vw, 1.8rem); word-break: break-word; }
          .now-hero-sub { font-size: 0.88rem; }
          .now-hero-actions { flex-direction: column; width: 100%; }
          .now-btn-primary, .now-btn-secondary { width: 100%; text-align: center; justify-content: center; box-sizing: border-box; }
          .now-price-hint { font-size: 0.68rem; }
          .now-hero-characters { gap: 0.75rem; }
          .now-hwm { max-width: 280px; padding: 14px; }
          .now-char-card { flex: 0 0 240px; padding: 1.5rem; }
          .now-section-title { font-size: 1.3rem; }
          .now-section-sub { font-size: 0.88rem; margin-bottom: 2.5rem; }
          section { padding: 4rem 0 !important; overflow: hidden; max-width: 100%; }
          #pricing .now-reveal { grid-template-columns: 1fr !important; }
          .now-plan-features { padding: 1.5rem; }
          .now-carousel-arrow { display: none; }
          .now-faq-q { font-size: 0.88rem; }
          .now-faq-a { font-size: 0.82rem; }
          .now-preview-desktop { height: 280px; }
          .now-steps { gap: 2.5rem; }
        }

        @media (max-width: 400px) {
          .now-hero h1 { font-size: 1.2rem; }
          .now-badge { font-size: 0.6rem; padding: 0.25rem 0.6rem; }
          .now-hero-characters { gap: 0.5rem; }
        }

        @media (max-height: 500px) and (orientation: landscape) {
          .now-hero { min-height: auto; padding: 4rem 2rem 2rem; }
          .now-hero-actions { flex-direction: row; width: auto; }
          .now-btn-primary, .now-btn-secondary { width: auto; }
        }
      `}</style>

      <div className="now-ambient" />

      {/* NAV */}
      <nav className={`now-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="now-nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="now-nav-logo-icon"><PixelGrid size={18} /></span> Now
        </div>
        <div className="now-nav-links">
          <a href="#characters">Companions</a>
          <a href="#features-section">Features</a>
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a href="#" className="now-nav-cta">Get Now</a>
        </div>
        <button className={`now-hamburger ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span /><span /><span />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`now-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#characters" onClick={() => setMobileMenuOpen(false)}>Companions</a>
        <a href="#features-section" onClick={() => setMobileMenuOpen(false)}>Features</a>
        <a href="#how" onClick={() => setMobileMenuOpen(false)}>How it works</a>
        <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
        <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
        <a href="#" className="now-nav-cta" onClick={() => setMobileMenuOpen(false)}>Get Now</a>
      </div>

      {/* HERO */}
      <section id="hero" className="now-hero">
        {/* Pixel grid background */}
        <div className="now-pixel-grid" />

        {/* CRT scanline sweep */}
        <div className="now-scanline-sweep" />

        {/* Floating particles */}
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="now-particle"
            style={{
              left: `${5 + (i * 7) % 90}%`,
              bottom: '-10px',
              width: `${3 + (i % 3) * 2}px`,
              height: `${3 + (i % 3) * 2}px`,
              animationDuration: `${8 + (i * 3) % 12}s`,
              animationDelay: `${(i * 1.3) % 8}s`,
            }}
          />
        ))}

        <div className="now-container">
          <h1>
            Your pixel<br />
            companion,{' '}
            <span className="now-crt-text">now.</span>
          </h1>

          <p className="now-hero-sub">
            It sits in the corner of your screen &mdash; a tiny pixel companion bouncing gently, watching time move with you. Not a task manager. Not a to-do list. Just awareness.
          </p>

          {/* Hero widget mock - realistic replica */}
          {/* Widget mock — matches actual widget HTML */}
          <div className="now-hwm">
            {/* Sys info strip */}
            <div className="now-hwm-sys">
              <span className="now-hwm-sys-label">CPU</span>
              <span className="now-hwm-sys-val">{sysInfoCpu}%</span>
              <span className="now-hwm-sys-sep" />
              <span className="now-hwm-sys-label">RAM</span>
              <span className="now-hwm-sys-val">{sysInfoRam}%</span>
            </div>
            {/* Character + Clock */}
            <div className="now-hwm-top">
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <PixelCharacter charKey={characters[activeCharacter].key} size={52} animate={true} />
                <div style={{ position: 'absolute', top: '-8px', left: '46px', fontSize: '6px', fontWeight: 700, padding: '2px 6px', borderRadius: '5px 5px 5px 2px', whiteSpace: 'nowrap', color: '#FFF', background: characters[activeCharacter].color, transition: 'background 0.6s' }}>yo!</div>
              </div>
              <div className="now-hwm-clock-wrap">
                <div className="now-hwm-time">
                  <span>{String(clockTime.getHours() % 12 || 12).padStart(2, '0')}</span>
                  <span className="now-hwm-colon">:</span>
                  <span>{String(clockTime.getMinutes()).padStart(2, '0')}</span>
                  <span className="now-hwm-sec">{String(clockTime.getSeconds()).padStart(2, '0')}</span>
                </div>
                <div className="now-hwm-date">{clockTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
              </div>
              <div className="now-hwm-gear">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </div>
            </div>
            {/* Built-in progress bars */}
            <div className="now-hwm-bars">
              {[
                { label: ct.toLocaleDateString('en-US', { weekday: 'short' }), pct: dayProgress, color: characters[activeCharacter].barColors[0] },
                { label: 'Wk ' + weekNum, pct: weekProgress, color: characters[activeCharacter].barColors[1] },
                { label: ct.toLocaleDateString('en-US', { month: 'short' }), pct: monthProgress, color: characters[activeCharacter].barColors[2] },
                { label: 'Q' + (Math.floor(ct.getMonth() / 3) + 1), pct: quarterProgress, color: characters[activeCharacter].barColors[3] },
                { label: String(ct.getFullYear()), pct: yearProgress, color: characters[activeCharacter].barColors[4] },
              ].map((bar) => (
                <div className="now-hwm-bar" key={bar.label}>
                  <span className="now-hwm-bar-label">{bar.label}</span>
                  <div className="now-hwm-bar-track">
                    <div className="now-hwm-bar-fill" style={{ width: `${bar.pct}%`, backgroundColor: bar.color, boxShadow: `0 0 8px ${bar.color}33` }} />
                  </div>
                  <span className="now-hwm-bar-val">{bar.pct}%</span>
                </div>
              ))}
              {/* Separator */}
              <div className="now-hwm-bar-sep" />
              {/* Custom trackers — 3 samples */}
              {[
                { label: 'X', pct: 72, display: '8d', color: '#90E8A0' },
                { label: 'DW', pct: 45, display: '1h48/4h', color: '#70D0F0' },
                { label: 'SP', pct: 33, display: '40:00', color: '#F5A0C0' },
              ].map((t) => (
                <div className="now-hwm-bar" key={t.label}>
                  <span className="now-hwm-bar-label" style={{ color: t.color }}>{t.label}</span>
                  <div className="now-hwm-bar-track">
                    <div className="now-hwm-bar-fill" style={{ width: `${t.pct}%`, backgroundColor: t.color, boxShadow: `0 0 8px ${t.color}33` }} />
                  </div>
                  <span className="now-hwm-bar-val">{t.display}</span>
                </div>
              ))}
            </div>
            {/* Pomodoro strip */}
            <div className="now-hwm-pomo">
              <div className="now-hwm-pomo-ring">
                <span className="now-hwm-pomo-center">25</span>
              </div>
              <div className="now-hwm-pomo-info">
                <div className="now-hwm-pomo-label">Ready</div>
                <div className="now-hwm-pomo-timer">25:00</div>
                <div className="now-hwm-pomo-dots">
                  <div className="now-hwm-pomo-dot" />
                  <div className="now-hwm-pomo-dot" />
                  <div className="now-hwm-pomo-dot" />
                  <div className="now-hwm-pomo-dot" />
                </div>
              </div>
              <div className="now-hwm-pomo-btns">
                <div className="now-hwm-pomo-btn">{'\u25B6'}</div>
                <div className="now-hwm-pomo-btn">{'\u21BA'}</div>
              </div>
            </div>
            {/* Footer */}
            <div className="now-hwm-foot">
              <div className="now-hwm-foot-left">
                <PixelGrid size={12} />
                <span className="now-hwm-foot-label">Now</span>
              </div>
              <div className="now-hwm-foot-actions">
                <div className="now-hwm-foot-btn" title="Ambient Sound">
                  <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                </div>
                <div className="now-hwm-foot-btn" title="Quick Note">
                  <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </div>
                <div className="now-hwm-foot-btn" title="View Notes">
                  <svg viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="now-hero-actions">
            <a href="#" className="now-btn-primary">Get Now &mdash; $4.99</a>
            <a href="#how" className="now-btn-secondary">How it works &rarr;</a>
          </div>
          <p className="now-price-hint"><strong>$4.99</strong> &middot; All 6 companions &middot; Windows, macOS, Linux</p>

          <div className="now-hero-characters">
            {characters.map((c, i) => (
              <span key={i} className="now-hero-char" title={c.name}>
                <PixelCharacter charKey={c.key} size={40} animate={true} />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CHARACTERS CAROUSEL */}
      <section id="characters" style={{ padding: '6rem 0', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        {/* Minecraft-style twinkling pixel grid */}
        <div className="now-cell-grid">
          <div className="now-cell-layer" />
          {Array.from({ length: 80 }, (_, i) => (
            <div
              key={i}
              className="now-cell-dot"
              style={{
                left: `${((i * 173) % 97)}%`,
                top: `${((i * 71) % 93)}%`,
                animationDelay: `${(i * 137) % 4000}ms`,
                animationDuration: `${3000 + (i * 97) % 3000}ms`,
              }}
            />
          ))}
        </div>
        <div className="now-container">
          <p className="now-section-label now-reveal">Meet Your Companions</p>
          <h2 className="now-section-title now-reveal">Pick your companion.</h2>
          <p className="now-section-sub now-reveal">Each one bounces, blinks, speaks small things, and watches time with you. Pick one &mdash; the whole page follows.</p>

          <div className="now-carousel-wrap now-reveal">
            <button className="now-carousel-arrow left" onClick={() => scrollCarousel(-1)} aria-label="Previous">{'\u2190'}</button>
            <div
              className="now-carousel"
              ref={carouselRef}
              onTouchStart={(e) => { touchXRef.current = e.touches[0].clientX }}
              onTouchEnd={(e) => {
                const diff = touchXRef.current - e.changedTouches[0].clientX
                if (Math.abs(diff) > 40) scrollCarousel(diff > 0 ? 1 : -1)
              }}
            >
              {characters.map((c, i) => (
                <div
                  key={i}
                  className={`now-char-card ${i === activeCharacter ? 'active' : ''}`}
                  style={{ '--card-glow': c.bgGlow } as React.CSSProperties}
                  onClick={() => setActiveCharacter(i)}
                >
                  <div className="now-char-pixel">
                    <PixelCharacter charKey={c.key} size={72} animate={true} />
                  </div>
                  <div className="now-char-name">{c.name}</div>
                  <div className="now-char-title" style={{ color: c.color }}>{c.title}</div>
                  <div className="now-char-desc">{c.desc}</div>
                </div>
              ))}
            </div>
            <button className="now-carousel-arrow right" onClick={() => scrollCarousel(1)} aria-label="Next">{'\u2192'}</button>
          </div>
          <p className="now-theme-hint now-reveal">
            {'\u2191'} Choose a companion &mdash; the page accent color transitions to match
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features-section" style={{ padding: '6rem 0', position: 'relative', zIndex: 1 }}>
        <div className="now-container">
          <p className="now-section-label now-reveal">Features</p>
          <h2 className="now-section-title now-reveal">Always present. Never demanding.</h2>
          <p className="now-section-sub now-reveal">Everything Now can do. Go ahead, try them.</p>

          <div className="now-features-grid">
            {featuresData.map((f, i) => (
              <div key={i} className="now-feature-card now-reveal">
                <div className="now-feature-icon">{featureIcons[f.type] || '\u2728'}</div>
                <div className="now-feature-title">{f.title}</div>
                <div className="now-feature-desc">{f.desc}</div>
                <div className="now-feature-demo">
                  {f.type === 'clockprogress' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                      <div className="now-demo-clock" style={{ fontSize: '1.4rem', marginBottom: '2px' }}>{formatTime(clockTime)}</div>
                      {[
                        { label: ct.toLocaleDateString('en-US', { weekday: 'short' }), pct: dayProgress, color: characters[activeCharacter].barColors[0], tip: ct.toLocaleDateString('en-US', { weekday: 'long' }) + ' progress' },
                        { label: 'Wk ' + weekNum, pct: weekProgress, color: characters[activeCharacter].barColors[1], tip: 'Week ' + weekNum + ' of ' + ct.getFullYear() },
                        { label: ct.toLocaleDateString('en-US', { month: 'short' }), pct: monthProgress, color: characters[activeCharacter].barColors[2], tip: ct.toLocaleDateString('en-US', { month: 'long' }) + ' progress' },
                        { label: 'Q' + (Math.floor(ct.getMonth() / 3) + 1), pct: quarterProgress, color: characters[activeCharacter].barColors[3], tip: 'Quarter ' + (Math.floor(ct.getMonth() / 3) + 1) + ' of ' + ct.getFullYear() },
                        { label: String(ct.getFullYear()), pct: yearProgress, color: characters[activeCharacter].barColors[4], tip: 'Year ' + ct.getFullYear() + ' progress' },
                      ].map((bar) => (
                        <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title={bar.tip + ' — ' + bar.pct + '% complete'}>
                          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: 'var(--muted)', minWidth: '28px' }}>{bar.label}</span>
                          <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${bar.pct}%`, height: '100%', backgroundColor: bar.color, borderRadius: '1px', transition: 'width 0.8s ease', backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(0,0,0,0.15) 6px, rgba(0,0,0,0.15) 8px)' }} />
                          </div>
                          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.5rem', color: 'var(--dim)', minWidth: '24px', textAlign: 'right' }}>{bar.pct}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {f.type === 'pomodoro' && (
                    <div className="now-demo-pomodoro">
                      <div className={`now-demo-pomo-ring ${pomodoroRunning ? 'running' : ''}`}>
                        <span className="now-demo-pomo-center">{Math.floor(pomodoroSeconds / 60)}</span>
                      </div>
                      <div className="now-demo-pomo-info">
                        <div className="now-demo-pomo-label">{pomodoroRunning ? 'Focus' : 'Ready'}</div>
                        <div className="now-demo-pomo-timer">{formatPomodoro(pomodoroSeconds)}</div>
                        <div className="now-demo-pomo-dots">
                          <div className="now-demo-pomo-dot" />
                          <div className="now-demo-pomo-dot" />
                          <div className="now-demo-pomo-dot" />
                          <div className="now-demo-pomo-dot" />
                        </div>
                      </div>
                      <div className="now-demo-pomo-btns">
                        <button className={`now-demo-pomo-btn ${pomodoroRunning ? 'active' : ''}`} onClick={() => setPomodoroRunning(!pomodoroRunning)} title={pomodoroRunning ? 'Pause' : 'Start'}>{pomodoroRunning ? '\u23F8' : '\u25B6'}</button>
                        <button className="now-demo-pomo-btn" onClick={() => { setPomodoroRunning(false); setPomodoroSeconds(25 * 60) }} title="Reset">{'\u21BA'}</button>
                      </div>
                    </div>
                  )}
                  {f.type === 'waveform' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                      <button
                        onClick={() => setAmbientMuted(!ambientMuted)}
                        style={{ width: '30px', height: '30px', borderRadius: '6px', border: 'none', background: ambientMuted ? 'rgba(255,255,255,0.06)' : 'var(--accent)', color: ambientMuted ? '#A8A2B0' : '#0a0a12', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s', fontSize: '14px' }}
                        title={ambientMuted ? 'Play' : 'Mute'}
                      >
                        {ambientMuted ? '\u{1F507}' : '\u{1F50A}'}
                      </button>
                      <div className="now-demo-waveform" style={{ opacity: ambientMuted ? 0.3 : 1, transition: 'opacity 0.3s' }}>
                        {Array.from({ length: 12 }, (_, j) => (
                          <div key={j} className="now-wave-bar" style={{ animationPlayState: ambientMuted ? 'paused' : 'running' }} />
                        ))}
                      </div>
                      <span style={{ fontFamily: "'Silkscreen', cursive", fontSize: '0.55rem', color: ambientMuted ? 'var(--dim)' : 'var(--accent)', transition: 'color 0.3s' }}>{ambientMuted ? 'Off' : 'Rain'}</span>
                    </div>
                  )}
                  {f.type === 'trackers' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', fontFamily: "'Silkscreen', cursive" }}>
                      {[
                        { label: 'X', name: 'Christmas', pct: 72, display: '8d', color: '#90E8A0', type: 'Countdown', hasPlay: false },
                        { label: 'DW', name: 'Deep Work', pct: 45, display: '1h48/4h', color: '#70D0F0', type: 'Daily Goal', hasPlay: true },
                        { label: 'SP', name: 'Sprint', pct: 33, display: '40:00', color: '#F5A0C0', type: 'Timer', hasPlay: true },
                      ].map((t) => (
                        <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title={`${t.name} — ${t.display} (${t.type}) — ${t.pct}% complete`}>
                          <span style={{ fontSize: '0.55rem', color: t.color, minWidth: '20px' }}>{t.label}</span>
                          <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${t.pct}%`, height: '100%', backgroundColor: t.color, borderRadius: '1px', backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(0,0,0,0.15) 6px, rgba(0,0,0,0.15) 8px)', boxShadow: `0 0 6px ${t.color}33` }} />
                          </div>
                          <span style={{ fontSize: '0.5rem', color: 'var(--dim)', minWidth: '36px', textAlign: 'right' }}>{t.display}</span>
                          {t.hasPlay && (
                            <button
                              onClick={() => setTrackerRunning(prev => ({ ...prev, [t.label]: !prev[t.label] }))}
                              style={{ width: '16px', height: '16px', borderRadius: '3px', border: 'none', background: trackerRunning[t.label] ? t.color : 'rgba(255,255,255,0.06)', color: trackerRunning[t.label] ? '#fff' : '#A8A2B0', fontSize: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, flexShrink: 0, transition: 'all 0.2s' }}
                            >{trackerRunning[t.label] ? '\u23F8' : '\u25B6'}</button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {f.type === 'notes' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <input
                          type="text"
                          value={demoNoteInput}
                          onChange={(e) => setDemoNoteInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && demoNoteInput.trim()) {
                              setDemoNotes(prev => [demoNoteInput.trim(), ...prev].slice(0, 5))
                              setDemoNoteInput('')
                            }
                          }}
                          placeholder="Quick thought..."
                          maxLength={40}
                          style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '4px 8px', fontFamily: "'Silkscreen', cursive", fontSize: '0.6rem', color: '#F0ECE4', outline: 'none' }}
                        />
                        <button
                          onClick={() => {
                            if (demoNoteInput.trim()) {
                              setDemoNotes(prev => [demoNoteInput.trim(), ...prev].slice(0, 5))
                              setDemoNoteInput('')
                            }
                          }}
                          style={{ width: '24px', height: '24px', borderRadius: '4px', border: 'none', background: 'rgba(255,255,255,0.06)', color: '#A8A2B0', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                        >{'\u2192'}</button>
                      </div>
                      <div className="now-demo-notes">
                        {demoNotes.map((note, j) => (
                          <div key={j} className="now-note-line">
                            <span className="now-note-bullet">{'\u25A0'}</span> {note}
                            <span
                              onClick={() => setDemoNotes(prev => prev.filter((_, idx) => idx !== j))}
                              style={{ marginLeft: 'auto', cursor: 'pointer', opacity: 0.3, fontSize: '0.6rem', fontFamily: "'Silkscreen', cursive" }}
                            >{'\u00D7'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {f.type === 'sysinfo' && (
                    <div className="now-demo-sysinfo">
                      <div className="now-sysinfo-item">
                        <div className="now-sysinfo-label">CPU</div>
                        <div className="now-sysinfo-value">{sysInfoCpu}%</div>
                        <div className="now-sysinfo-bar">
                          <div className="now-sysinfo-fill" style={{ width: `${sysInfoCpu}%` }} />
                        </div>
                      </div>
                      <div className="now-sysinfo-item">
                        <div className="now-sysinfo-label">RAM</div>
                        <div className="now-sysinfo-value">{sysInfoRam}%</div>
                        <div className="now-sysinfo-bar">
                          <div className="now-sysinfo-fill" style={{ width: `${sysInfoRam}%` }} />
                        </div>
                      </div>
                    </div>
                  )}
                  {f.type === 'idle' && (
                    <div
                      className="now-demo-idle-wrap"
                      onMouseEnter={(e) => {
                        const el = e.currentTarget
                        el.querySelector('.now-demo-idle-zzz')?.setAttribute('style', 'display:none')
                        el.querySelector('.now-demo-idle-status')?.setAttribute('style', 'display:none')
                        el.querySelector('.now-demo-idle-wake')?.setAttribute('style', 'display:flex')
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget
                        el.querySelector('.now-demo-idle-zzz')?.setAttribute('style', '')
                        el.querySelector('.now-demo-idle-status')?.setAttribute('style', '')
                        el.querySelector('.now-demo-idle-wake')?.setAttribute('style', 'display:none')
                      }}
                    >
                      <div className="now-demo-idle-char">
                        <PixelCharacter charKey={characters[activeCharacter].key} size={48} animate={true} />
                        <span className="now-demo-idle-zzz">z z z</span>
                      </div>
                      <div className="now-demo-idle-status">sleeping...</div>
                      <div className="now-demo-idle-wake">
                        <div className="now-demo-idle-bubble" style={{ background: characters[activeCharacter].color }}>back!</div>
                        <div className="now-demo-idle-msg">away for 5m</div>
                      </div>
                    </div>
                  )}
                  {f.type === 'clickthrough' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <button
                        className="now-clickthrough-btn"
                        onClick={(e) => {
                          const btn = e.currentTarget
                          const status = btn.parentElement?.querySelector('.now-ct-status') as HTMLElement
                          if (e.ctrlKey || e.metaKey) {
                            btn.style.background = characters[activeCharacter].color
                            btn.style.color = '#0a0a12'
                            btn.style.borderColor = characters[activeCharacter].color
                            btn.style.boxShadow = `0 0 20px ${characters[activeCharacter].bgGlow}`
                            btn.textContent = 'Clicked!'
                            if (status) { status.textContent = 'Ctrl + click detected — widget responds'; status.style.color = characters[activeCharacter].color }
                            setTimeout(() => {
                              btn.style.background = 'rgba(255,255,255,0.04)'
                              btn.style.color = 'var(--muted)'
                              btn.style.borderColor = 'rgba(255,255,255,0.08)'
                              btn.style.boxShadow = 'none'
                              btn.textContent = 'Try clicking me'
                              if (status) { status.textContent = 'click passes through · hold Ctrl + click to interact'; status.style.color = '' }
                            }, 1200)
                          } else {
                            if (status) { status.textContent = 'click passed through — hold Ctrl and try again'; status.style.color = 'var(--muted)' }
                            setTimeout(() => { if (status) { status.textContent = 'click passes through · hold Ctrl + click to interact'; status.style.color = '' } }, 2000)
                          }
                        }}
                        style={{ padding: '8px 20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'var(--muted)', fontFamily: "'Silkscreen', cursive", fontSize: '0.7rem', cursor: 'pointer', transition: 'all 0.3s' }}
                      >
                        Try clicking me
                      </button>
                      <div className="now-ct-status" style={{ fontSize: '0.55rem', color: 'var(--dim)', fontFamily: "'Space Mono', monospace", textAlign: 'center', transition: 'color 0.3s', minHeight: '1.2em' }}>
                        click passes through · hold Ctrl + click to interact
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '6rem 0', position: 'relative', zIndex: 1, background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="now-container">
          <p className="now-section-label now-reveal">How It Works</p>
          <h2 className="now-section-title now-reveal">Three steps. That's it.</h2>
          <p className="now-section-sub now-reveal">Download, pick a companion, pin to your desktop.</p>

          <div className="now-steps now-reveal">
            {howItWorksSteps.map((step, i) => (
              <div key={i} className="now-step">
                <div className="now-step-num">{step.num}</div>
                <div className="now-step-icon">{i === 1 ? <PixelCharacter charKey="ghost" size={40} animate={true} /> : stepIcons[i]}</div>
                <div className="now-step-title">{step.title}</div>
                <div className="now-step-desc">{step.desc}</div>
                {i < howItWorksSteps.length - 1 && (
                  <div className="now-step-connector">
                    <div className="now-step-connector-dot" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WIDGET BUILDER */}
      <section id="builder" style={{ padding: '6rem 0', position: 'relative', zIndex: 1 }}>
        <div className="now-container">
          <p className="now-section-label now-reveal">Customize</p>
          <h2 className="now-section-title now-reveal">Make it yours.</h2>
          <p className="now-section-sub now-reveal">Pick a companion, find a corner, adjust the transparency.</p>

          <div className="now-builder now-reveal">
            <div className="now-builder-controls">
              {/* Character select */}
              <div className="now-builder-group">
                <div className="now-builder-group-title">Companion</div>
                <div className="now-builder-chars">
                  {characters.map((c, i) => (
                    <button
                      key={i}
                      className={`now-builder-char-btn ${i === builderCharacter ? 'active' : ''}`}
                      onClick={() => setBuilderCharacter(i)}
                      title={c.name}
                    >
                      <PixelCharacter charKey={c.key} size={28} animate={false} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Position */}
              <div className="now-builder-group">
                <div className="now-builder-group-title">Position</div>
                <div className="now-builder-positions">
                  {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((pos) => (
                    <button
                      key={pos}
                      className={`now-builder-pos-btn ${builderPosition === pos ? 'active' : ''}`}
                      onClick={() => setBuilderPosition(pos)}
                    >
                      {pos.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transparency */}
              <div className="now-builder-group">
                <div className="now-builder-group-title">Transparency</div>
                <div className="now-builder-slider">
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={builderTransparency}
                    onChange={(e) => setBuilderTransparency(Number(e.target.value))}
                  />
                  <span className="now-builder-slider-val">{builderTransparency}%</span>
                </div>
              </div>

              {/* Theme */}
              <div className="now-builder-group">
                <div className="now-builder-group-title">Theme</div>
                <div className="now-builder-positions" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  {(['dark', 'light'] as const).map((t) => (
                    <button
                      key={t}
                      className={`now-builder-pos-btn ${builderTheme === t ? 'active' : ''}`}
                      onClick={() => setBuilderTheme(t)}
                    >
                      {t === 'dark' ? '\u263E' : '\u2600'} {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="now-builder-group">
                <div className="now-builder-group-title">Size</div>
                <div className="now-builder-positions" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                  {(['S', 'M', 'L'] as const).map((s) => (
                    <button
                      key={s}
                      className={`now-builder-pos-btn ${builderSize === s ? 'active' : ''}`}
                      onClick={() => setBuilderSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Live preview */}
            <div className="now-builder-preview">
              <div className="now-preview-desktop">
                <div className="now-preview-label">Desktop Preview</div>
                <div
                  className="now-preview-widget"
                  style={{
                    opacity: builderTransparency / 100,
                    background: builderTheme === 'light' ? 'rgba(255,255,255,0.85)' : undefined,
                    borderColor: builderTheme === 'light' ? 'rgba(0,0,0,0.07)' : undefined,
                    transform: `scale(${builderSize === 'S' ? 1 : builderSize === 'M' ? 1.15 : 1.3})`,
                    transformOrigin: builderPosition.replace('-', ' '),
                    transition: 'all 0.4s ease',
                    ...(builderPosition === 'bottom-right' ? { bottom: '40px', right: '12px' } : {}),
                    ...(builderPosition === 'bottom-left' ? { bottom: '40px', left: '12px' } : {}),
                    ...(builderPosition === 'top-right' ? { top: '12px', right: '12px' } : {}),
                    ...(builderPosition === 'top-left' ? { top: '12px', left: '12px' } : {}),
                  }}
                >
                  <div className="now-preview-widget-char">
                    <PixelCharacter charKey={characters[builderCharacter].key} size={40} animate={true} />
                  </div>
                  <div className="now-preview-widget-clock" style={{ color: builderTheme === 'light' ? '#1A1520' : characters[builderCharacter].color }}>
                    {formatTime(clockTime)}
                  </div>
                  <div className="now-preview-widget-pomodoro" style={{ color: builderTheme === 'light' ? '#5A5060' : undefined }}>
                    <span className="now-preview-widget-pomodoro-dot" />
                    25:00
                  </div>
                </div>
                <div className="now-preview-taskbar">
                  <div className="now-preview-taskbar-dot" />
                  <div className="now-preview-taskbar-dot" />
                  <div className="now-preview-taskbar-dot" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '6rem 0', position: 'relative', zIndex: 1, background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="now-container">
          <p className="now-section-label now-reveal">Pricing</p>
          <h2 className="now-section-title now-reveal">Simple.</h2>
          <p className="now-section-sub now-reveal">One price. Everything included.</p>

          <div className="now-reveal" style={{ maxWidth: '480px', margin: '3rem auto 0' }}>
            <div className="now-pricing-card" style={{ borderColor: 'var(--accent)', boxShadow: '0 0 40px var(--accent-glow)' }}>
              <div className="now-pricing-inner" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <div className="now-plan-name">Now</div>
                  <div className="now-plan-price" style={{ color: 'var(--accent)', transition: 'color 0.6s ease' }}>$4.99</div>
                  <div className="now-plan-note">One-time purchase &middot; No subscription</div>
                  <a href="#" className="now-plan-cta">Get Now</a>
                </div>
                <ul className="now-plan-features">
                  {includedFeatures.map((feat, i) => (
                    <li key={i}>
                      <span className="now-plan-check">{'\u2713'}</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '5rem 0 7rem', position: 'relative', zIndex: 1 }}>
        <div className="now-container">
          <p className="now-section-label now-reveal">FAQ</p>
          <h2 className="now-section-title now-reveal">Common questions</h2>

          <div className="now-faq-list now-reveal">
            {faqData.map((item, i) => (
              <div key={i} className={`now-faq-item ${openFaq === i ? 'open' : ''}`}>
                <button className="now-faq-q" onClick={() => toggleFaq(i)}>
                  {item.q}
                  <span className="now-faq-arrow">{'\u25BE'}</span>
                </button>
                <div className="now-faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="now-footer">
        <div className="now-footer-border" />
        <div className="now-container">
          <div className="now-footer-inner">
            <div className="now-footer-logo">
              <span className="now-footer-logo-icon"><PixelGrid size={16} /></span> Now
            </div>
            <p className="now-footer-sub">Always present. Never demanding.</p>
            <div className="now-footer-chars">
              {characters.map((c, i) => (
                <span key={i} className="now-footer-char">
                  <PixelCharacter charKey={c.key} size={28} animate={true} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* SCROLL TO TOP */}
      <button
        className={`now-scroll-top ${showScrollTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        {'\u2191'}
      </button>
    </div>
  )
}

export default NowLandingFrontend
