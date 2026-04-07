import React, { useRef, useState, useEffect, useCallback, Suspense } from 'react'
import { motion, useMotionValue, useSpring, useInView } from 'motion/react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { LinkedinLogo, GithubLogo, Sun, Moon, List, X, DownloadSimple, EnvelopeSimple, Code, Globe, DeviceMobile, Cube, Cloud, Database, Lightning, Cpu } from '@phosphor-icons/react'

// ─── Constants ───────────────────────────────────────────────────────────────

const SPRING = { type: 'spring' as const, stiffness: 100, damping: 20 }

// ─── Types ───────────────────────────────────────────────────────────────────

interface PortfolioProps {
  showContact?: boolean
}

interface Project {
  title: string
  description: string
  impact: string
  technologies: string[]
  link?: string
  metrics?: string
}

interface SkillRow {
  category: string
  technologies: string[]
  icon: React.ReactNode
}

// ─── Theme Hook ──────────────────────────────────────────────────────────────

const useTheme = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'dark' | 'light') || 'dark'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return { theme, toggleTheme }
}

// ─── Utility Hooks ───────────────────────────────────────────────────────────

const useTextScramble = (text: string, trigger: boolean) => {
  const [display, setDisplay] = useState('')
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*'

  useEffect(() => {
    if (!trigger) return

    let frame = 0
    const totalFrames = text.length * 2

    const interval = setInterval(() => {
      const resolved = Math.floor(frame / 2)
      let result = ''

      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          result += ' '
        } else if (i < resolved) {
          result += text[i]
        } else {
          result += chars[Math.floor(Math.random() * chars.length)]
        }
      }

      setDisplay(result)
      frame++

      if (frame > totalFrames) {
        setDisplay(text)
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [text, trigger])

  return display
}

const useMagneticHover = (strength: number = 0.3) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * strength)
    y.set((e.clientY - centerY) * strength)
  }, [x, y, strength])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return { springX, springY, handleMouseMove, handleMouseLeave }
}

const useSpotlightCard = () => {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }, [])

  return { handleMouseMove }
}

// ─── ScrollReveal Component ─────────────────────────────────────────────────

const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className = '',
  delay = 0,
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 64, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ ...SPRING, delay }}
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  )
}

// ─── 3D Scene ────────────────────────────────────────────────────────────────

const StellatedStar: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const scaleTarget = useRef(1)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.08
    groupRef.current.rotation.x = state.clock.elapsedTime * 0.05
    scaleTarget.current = hovered ? 1.08 : 1
    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, scaleTarget.current, 0.05)
    groupRef.current.scale.setScalar(s)
  })

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <tetrahedronGeometry args={[1.6, 0]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={hovered ? 0.8 : 0.5}
          transparent
          opacity={0.45}
          wireframe
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.6, 20, 20]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={hovered ? 0.5 : 0.3}
          transparent
          opacity={0.25}
          wireframe
        />
      </mesh>
    </group>
  )
}

const HeroScene: React.FC = () => (
  <>
    <ambientLight intensity={0.4} />
    <directionalLight position={[5, 5, 5]} intensity={0.6} />
    <StellatedStar />
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
  </>
)

// ─── Code Rain Background ────────────────────────────────────────────────────

type TokenType = 'keyword' | 'decorator' | 'function' | 'string' | 'comment' | 'plain' | 'indent'

interface CodeToken {
  type: TokenType
  text: string
}

interface CodeLine {
  tokens: CodeToken[]
}

const CODE_BLOCKS: CodeLine[][] = [
  [
    { tokens: [{ type: 'keyword', text: 'from' }, { type: 'plain', text: ' langgraph ' }, { type: 'keyword', text: 'import' }, { type: 'plain', text: ' StateGraph' }] },
    { tokens: [{ type: 'keyword', text: 'from' }, { type: 'plain', text: ' langchain_core ' }, { type: 'keyword', text: 'import' }, { type: 'plain', text: ' messages' }] },
    { tokens: [{ type: 'plain', text: '' }] },
    { tokens: [{ type: 'keyword', text: 'class' }, { type: 'function', text: ' AgentState' }, { type: 'plain', text: '(TypedDict):' }] },
    { tokens: [{ type: 'indent', text: '    ' }, { type: 'plain', text: 'messages: list[BaseMessage]' }] },
    { tokens: [{ type: 'indent', text: '    ' }, { type: 'plain', text: 'next_step: ' }, { type: 'string', text: 'str' }] },
  ],
  [
    { tokens: [{ type: 'decorator', text: '@tool' }] },
    { tokens: [{ type: 'keyword', text: 'def' }, { type: 'function', text: ' retrieve_context' }, { type: 'plain', text: '(query: str):' }] },
    { tokens: [{ type: 'indent', text: '    ' }, { type: 'string', text: '"""Retrieve relevant docs."""' }] },
    { tokens: [{ type: 'indent', text: '    ' }, { type: 'plain', text: 'docs = vectorstore.' }, { type: 'function', text: 'similarity_search' }, { type: 'plain', text: '(query)' }] },
    { tokens: [{ type: 'indent', text: '    ' }, { type: 'keyword', text: 'return' }, { type: 'plain', text: ' docs' }] },
  ],
  [
    { tokens: [{ type: 'keyword', text: 'def' }, { type: 'function', text: ' agent_node' }, { type: 'plain', text: '(state: AgentState):' }] },
    { tokens: [{ type: 'indent', text: '    ' }, { type: 'plain', text: 'llm = ' }, { type: 'function', text: 'ChatAnthropic' }, { type: 'plain', text: '()' }] },
    { tokens: [{ type: 'indent', text: '    ' }, { type: 'plain', text: 'resp = llm.' }, { type: 'function', text: 'invoke' }, { type: 'plain', text: '(state[' }, { type: 'string', text: '"messages"' }, { type: 'plain', text: '])' }] },
    { tokens: [{ type: 'indent', text: '    ' }, { type: 'keyword', text: 'return' }, { type: 'plain', text: ' {' }, { type: 'string', text: '"messages"' }, { type: 'plain', text: ': [resp]}' }] },
  ],
  [
    { tokens: [{ type: 'comment', text: '# Build the graph' }] },
    { tokens: [{ type: 'plain', text: 'graph = ' }, { type: 'function', text: 'StateGraph' }, { type: 'plain', text: '(AgentState)' }] },
    { tokens: [{ type: 'plain', text: 'graph.' }, { type: 'function', text: 'add_node' }, { type: 'plain', text: '(' }, { type: 'string', text: '"agent"' }, { type: 'plain', text: ', agent_node)' }] },
    { tokens: [{ type: 'plain', text: 'graph.' }, { type: 'function', text: 'add_node' }, { type: 'plain', text: '(' }, { type: 'string', text: '"tools"' }, { type: 'plain', text: ', tool_executor)' }] },
    { tokens: [{ type: 'plain', text: 'graph.' }, { type: 'function', text: 'add_edge' }, { type: 'plain', text: '(' }, { type: 'string', text: '"agent"' }, { type: 'plain', text: ', ' }, { type: 'string', text: '"tools"' }, { type: 'plain', text: ')' }] },
    { tokens: [{ type: 'plain', text: 'graph.' }, { type: 'function', text: 'set_entry_point' }, { type: 'plain', text: '(' }, { type: 'string', text: '"agent"' }, { type: 'plain', text: ')' }] },
  ],
  [
    { tokens: [{ type: 'keyword', text: 'def' }, { type: 'function', text: ' should_continue' }, { type: 'plain', text: '(state):' }] },
    { tokens: [{ type: 'indent', text: '    ' }, { type: 'keyword', text: 'if' }, { type: 'plain', text: ' state[' }, { type: 'string', text: '"next_step"' }, { type: 'plain', text: '] == ' }, { type: 'string', text: '"end"' }, { type: 'plain', text: ':' }] },
    { tokens: [{ type: 'indent', text: '        ' }, { type: 'keyword', text: 'return' }, { type: 'plain', text: ' END' }] },
    { tokens: [{ type: 'indent', text: '    ' }, { type: 'keyword', text: 'return' }, { type: 'plain', text: ' ' }, { type: 'string', text: '"tools"' }] },
  ],
  [
    { tokens: [{ type: 'keyword', text: 'async def' }, { type: 'function', text: ' run_agent' }, { type: 'plain', text: '(query: str):' }] },
    { tokens: [{ type: 'indent', text: '    ' }, { type: 'plain', text: 'checkpoint = ' }, { type: 'function', text: 'MemorySaver' }, { type: 'plain', text: '()' }] },
    { tokens: [{ type: 'indent', text: '    ' }, { type: 'plain', text: 'app = graph.' }, { type: 'function', text: 'compile' }, { type: 'plain', text: '(checkpointer=checkpoint)' }] },
    { tokens: [{ type: 'indent', text: '    ' }, { type: 'plain', text: 'result = ' }, { type: 'keyword', text: 'await' }, { type: 'plain', text: ' app.' }, { type: 'function', text: 'ainvoke' }, { type: 'plain', text: '(state)' }] },
    { tokens: [{ type: 'indent', text: '    ' }, { type: 'keyword', text: 'return' }, { type: 'plain', text: ' result' }] },
  ],
]

const TOKEN_STYLES: Record<TokenType, string> = {
  keyword: 'text-purple-400',
  decorator: 'text-yellow-400',
  function: 'text-blue-400',
  string: 'text-emerald-400',
  comment: 'text-zinc-500 italic',
  plain: 'text-zinc-400',
  indent: '',
}

const CodeRain: React.FC = () => {
  const allBlocks = [...CODE_BLOCKS, ...CODE_BLOCKS]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.12] dark:opacity-[0.10]">
      <div className="flex justify-around h-full">
        {Array.from({ length: 6 }).map((_, col) => (
          <div
            key={col}
            className="flex flex-col gap-6 text-[10px] font-jetbrains whitespace-pre animate-scroll-code"
            style={{ animationDuration: `${25 + col * 4}s`, animationDelay: `${-col * 3}s` }}
          >
            {allBlocks.map((block, bi) => (
              <div key={bi} className="flex flex-col gap-0.5 mb-4">
                {block.map((line, li) => (
                  <div key={li}>
                    {line.tokens.map((token, ti) => (
                      <span key={ti} className={TOKEN_STYLES[token.type]}>{token.text}</span>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Hero Typing Animation ───────────────────────────────────────────────────

const heroSubtitleLines = [
  'Technology Entrepreneur & Software Architect',
  "Building Tomorrow's Systems Today",
  'Full-stack · Web · Mobile · Web3 · AI/LLM',
  'Co-Founder & Managing Partner at SparkWorks',
]

const HeroTypingAnimation: React.FC = () => {
  const [displayText, setDisplayText] = useState('')
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)

  useEffect(() => {
    const typeText = () => {
      if (currentLineIndex < heroSubtitleLines.length) {
        const currentLine = heroSubtitleLines[currentLineIndex]

        if (currentCharIndex < currentLine.length) {
          setDisplayText(prev => {
            const lines = prev.split('\n')
            lines[currentLineIndex] = (lines[currentLineIndex] || '') + currentLine[currentCharIndex]
            return lines.join('\n')
          })
          setCurrentCharIndex(prev => prev + 1)
        } else {
          setTimeout(() => {
            setCurrentLineIndex(prev => prev + 1)
            setCurrentCharIndex(0)
            setDisplayText(prev => prev + (currentLineIndex < heroSubtitleLines.length - 1 ? '\n' : ''))
          }, 150)
        }
      } else {
        setTimeout(() => {
          setDisplayText('')
          setCurrentLineIndex(0)
          setCurrentCharIndex(0)
        }, 3000)
      }
    }

    const timer = setTimeout(typeText, Math.random() * 25 + 40)
    return () => clearTimeout(timer)
  }, [currentLineIndex, currentCharIndex])

  return (
    <div className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-lg font-outfit min-h-[120px]">
      <div className="whitespace-pre-line">
        {displayText.split('\n').map((line, index) => (
          <div key={index} className="mb-1">
            {index === 0 && <span className="text-emerald-500 font-semibold">{line}</span>}
            {index === 1 && <span className="text-zinc-600 dark:text-zinc-300">{line}</span>}
            {index === 2 && <span className="text-sm text-emerald-500/70 font-jetbrains">{line}</span>}
            {index === 3 && <span className="text-lg text-zinc-500 dark:text-zinc-400 font-outfit">{line}</span>}
            {index === currentLineIndex && currentCharIndex <= (heroSubtitleLines[currentLineIndex]?.length ?? 0) && (
              <span className="text-emerald-400 animate-pulse">|</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Video Modal ─────────────────────────────────────────────────────────────

const VideoModal: React.FC<{ isOpen: boolean; onClose: () => void; videoId: string }> = ({
  isOpen,
  onClose,
  videoId,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-4xl bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
        >
          <X size={20} weight="bold" />
        </button>
        <div className="relative w-full pb-[56.25%] h-0">
          <iframe
            className="absolute top-0 left-0 w-full h-full border-0"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title="Professional Overview Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Navigation ──────────────────────────────────────────────────────────────

const Navigation: React.FC<{ theme: 'dark' | 'light'; toggleTheme: () => void }> = ({
  theme,
  toggleTheme,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const productsRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  const navLinks = ['About', 'Skills', 'Products', 'Projects', 'Clients', 'Contact']

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl">
      <div className="rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/60 dark:border-white/[0.06] px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2.5">
            <img src="/logo.png" alt="XANDR" className="w-8 h-8 rounded-full" />
            <span className="font-space-grotesk font-bold text-lg text-zinc-900 dark:text-zinc-100">
              XANDR
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) =>
              link === 'Products' ? (
                <div
                  key={link}
                  ref={productsRef}
                  className="relative"
                  onMouseEnter={() => setProductsOpen(true)}
                  onMouseLeave={() => setProductsOpen(false)}
                >
                  <button
                    className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-outfit py-4 -my-4"
                  >
                    Products
                    <svg className={`w-3 h-3 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {productsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-72 rounded-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/60 dark:border-white/[0.06] shadow-2xl overflow-hidden"
                    >
                      {/* <a
                        href="/products/auris"
                        className="flex items-center gap-4 w-full px-5 py-4 text-left text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-all font-outfit group"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform" style={{ color: '#7b6cff' }}>&#x25C8;</span>
                        <div>
                          <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Auris</div>
                          <div className="text-xs text-zinc-500 mt-0.5">AI voice assistant for <span style={{ color: '#D97757', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}><img src="/claude-ai-icon.svg" alt="Claude" width="14" height="14" />Claude Code</span></div>
                        </div>
                      </a> */}
                      <a
                        href="/products/now"
                        className="flex items-center gap-4 w-full px-5 py-4 text-left text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-all font-outfit group"
                      >
                        <span className="group-hover:scale-110 transition-transform" style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(3, 5px)', gap: '2px' }}>{[1,0,1,0,1,0,1,0,1].map((on, idx) => <span key={idx} className={on ? 'bg-zinc-400 dark:bg-white/30' : 'bg-zinc-200 dark:bg-white/[0.08]'} style={{ width: 5, height: 5, borderRadius: 1 }} />)}</span>
                        <div>
                          <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Now</div>
                          <div className="text-xs text-zinc-500 mt-0.5">Pixel companion for your desktop</div>
                        </div>
                      </a>
                      <a
                        href="https://www.semakinpintar.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 w-full px-5 py-4 text-left text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-all font-outfit group"
                      >
                        <img src="/semakin-pintar-logo.png" alt="Semakin Pintar" width={20} height={20} className="rounded group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Semakin Pintar</div>
                          <div className="text-xs text-zinc-500 mt-0.5">Educational games for kids &amp; family</div>
                        </div>
                      </a>
                    </motion.div>
                  )}
                </div>
              ) : (
                <button
                  key={link}
                  onClick={() => scrollToSection(link.toLowerCase())}
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-outfit"
                >
                  {link}
                </button>
              )
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-1">
            <a
              href="https://linkedin.com/in/ricardoalexanderh"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex p-2 rounded-full hover:bg-zinc-800/50 dark:hover:bg-zinc-800/50 hover:bg-zinc-100 transition-colors"
            >
              <LinkedinLogo size={18} className="text-zinc-600 dark:text-zinc-400" weight="bold" />
            </a>
            <a
              href="https://github.com/ricardoalexanderh"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex p-2 rounded-full hover:bg-zinc-800/50 dark:hover:bg-zinc-800/50 hover:bg-zinc-100 transition-colors"
            >
              <GithubLogo size={18} className="text-zinc-600 dark:text-zinc-400" weight="bold" />
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-zinc-800/50 dark:hover:bg-zinc-800/50 hover:bg-zinc-100 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-zinc-400" weight="bold" />
              ) : (
                <Moon size={18} className="text-zinc-600" weight="bold" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full hover:bg-zinc-800/50 dark:hover:bg-zinc-800/50 hover:bg-zinc-100 transition-colors"
            >
              {isOpen ? (
                <X size={18} className="text-zinc-900 dark:text-zinc-100" weight="bold" />
              ) : (
                <List size={18} className="text-zinc-900 dark:text-zinc-100" weight="bold" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-2 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/60 dark:border-white/[0.06] p-4 space-y-1"
        >
          {navLinks.map((link) =>
            link === 'Products' ? (
              <div key={link}>
                <button
                  onClick={() => setProductsOpen(!productsOpen)}
                  className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors font-outfit"
                >
                  Products
                  <svg className={`w-3 h-3 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {productsOpen && (
                  <>
                    {/* <a
                      href="/products/auris"
                      className="flex items-center gap-3 w-full px-8 py-2.5 text-left text-zinc-600 dark:text-zinc-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors font-outfit"
                    >
                      <span className="text-lg" style={{ color: '#7b6cff' }}>&#x25C8;</span>
                      <span className="text-sm">Auris</span>
                    </a> */}
                    <a
                      href="/products/now"
                      className="flex items-center gap-3 w-full px-8 py-2.5 text-left text-zinc-600 dark:text-zinc-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors font-outfit"
                    >
                      <span style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(3, 4px)', gap: '1.5px' }}>{[1,0,1,0,1,0,1,0,1].map((on, idx) => <span key={idx} className={on ? 'bg-zinc-400 dark:bg-white/30' : 'bg-zinc-200 dark:bg-white/[0.08]'} style={{ width: 4, height: 4, borderRadius: 1 }} />)}</span>
                      <span className="text-sm">Now</span>
                    </a>
                    <a
                      href="https://www.semakinpintar.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 w-full px-8 py-2.5 text-left text-zinc-600 dark:text-zinc-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors font-outfit"
                    >
                      <img src="/semakin-pintar-logo.png" alt="Semakin Pintar" width={16} height={16} className="rounded" />
                      <span className="text-sm">Semakin Pintar</span>
                    </a>
                  </>
                )}
              </div>
            ) : (
              <button
                key={link}
                onClick={() => scrollToSection(link.toLowerCase())}
                className="block w-full text-left px-4 py-2.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors font-outfit"
              >
                {link}
              </button>
          ))}
          <div className="flex items-center space-x-2 px-4 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50 mt-2">
            <a
              href="https://linkedin.com/in/ricardoalexanderh"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <LinkedinLogo size={18} className="text-zinc-600 dark:text-zinc-400" weight="bold" />
            </a>
            <a
              href="https://github.com/ricardoalexanderh"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <GithubLogo size={18} className="text-zinc-600 dark:text-zinc-400" weight="bold" />
            </a>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

// ─── Data ────────────────────────────────────────────────────────────────────

const skills: SkillRow[] = [
  {
    category: 'Languages & Frameworks',
    technologies: ['C#/.NET', 'Java/Spring Boot', 'Python', 'Node.js/NestJS', 'TypeScript'],
    icon: <Code size={20} weight="bold" />,
  },
  {
    category: 'Frontend',
    technologies: ['React', 'Angular', 'Next.js', 'Vue.js', 'TypeScript'],
    icon: <Globe size={20} weight="bold" />,
  },
  {
    category: 'Mobile Development',
    technologies: ['React Native', 'Flutter', 'iOS', 'Android'],
    icon: <DeviceMobile size={20} weight="bold" />,
  },
  {
    category: 'Web3 & Blockchain',
    technologies: ['Solidity', 'Foundry', 'Hardhat', 'Ethers.js', 'Web3.js'],
    icon: <Cube size={20} weight="bold" />,
  },
  {
    category: 'Cloud & DevOps',
    technologies: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins'],
    icon: <Cloud size={20} weight="bold" />,
  },
  {
    category: 'Databases',
    technologies: ['SQL Server', 'PostgreSQL', 'Oracle', 'MongoDB', 'Redis', 'Neo4J'],
    icon: <Database size={20} weight="bold" />,
  },
  {
    category: 'Middleware & Integration',
    technologies: ['Apache Airflow', 'Kafka', 'RabbitMQ', 'Apache NiFi', 'CQRS', 'Event-Driven Architecture'],
    icon: <Lightning size={20} weight="bold" />,
  },
  {
    category: 'Emerging Tech',
    technologies: ['AI/LLM', 'Agentic AI', 'Context Engineering', 'MCP Servers', 'Golang', 'Rust'],
    icon: <Cpu size={20} weight="bold" />,
  },
]

const projects: Project[] = [
  {
    title: 'Toyota Performance Optimization',
    description:
      'Re-engineered costing system for Toyota Astra Motor, transforming a system that took 3+ hours and frequently failed into one that processes in 10-15 minutes with 99.9% reliability.',
    impact: '90% Performance Improvement',
    technologies: ['SQL Server', 'Microservices', '.NET', 'Performance Tuning'],
    metrics: '1-2M daily transactions',
  },
  {
    title: 'SparkWorks',
    description:
      'Co-founded and built enterprise platform serving Fortune 500 companies including Bank Mandiri, Astra Group, and Panasonic. Led technical strategy for 100+ projects.',
    impact: 'Fortune 500 Partnerships',
    technologies: ['React', 'Angular', 'Mobile', 'Node.js', '.NET', 'Microservices', 'Java'],
    metrics: '20+ enterprise clients',
  },
  {
    title: 'Semakin Pintar Educational Platform',
    description:
      'Created gamified educational website for children\'s mathematics learning with interactive games and tools. Publicly available educational resource.',
    impact: 'Educational Innovation',
    technologies: ['React', 'Node.js', 'Gamification', 'Educational Design'],
    link: 'https://www.semakinpintar.com',
  },
  {
    title: 'Agentic AI & Intelligent Systems',
    description:
      'Architecting multi-agent workflows with LangGraph and Claude Agent SDK, building RAG pipelines, MCP server integrations, and AI-powered enterprise automation with context engineering for reliable decision-making.',
    impact: 'Next-Gen AI Architecture',
    technologies: ['LangGraph', 'Claude Agent SDK', 'MCP Servers', 'RAG', 'Context Engineering', 'Python'],
    metrics: 'Multi-agent orchestration',
  },
  {
    title: 'Web3 & Blockchain Development',
    description:
      'Learned blockchain platforms and Web3 applications using Solidity smart contracts with focus on security and decentralized architecture.',
    impact: 'Web3 Learning Path',
    technologies: ['Solidity', 'Foundry', 'Hardhat', 'Ethers.js', 'Smart Contracts'],
    metrics: '',
  },
]

const clients = [
  'Toyota Group',
  'Bank Mandiri',
  'Astra Group',
  'Panasonic',
  'UOB Bank',
  'BCA Finance',
  'Boston Consulting Group',
  'Accenture',
  'AstraPay',
  'BUMA',
]

// ─── AnimatedCounter ─────────────────────────────────────────────────────────

const AnimatedCounter: React.FC<{ end: number; duration?: number; suffix?: string }> = ({
  end,
  duration = 2,
  suffix = '',
}) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }
  }, [inView, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

// ─── SectionLabel ────────────────────────────────────────────────────────────

const SectionLabel: React.FC<{ children: string }> = ({ children }) => (
  <div className="font-jetbrains text-xs tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-500 text-zinc-400 mb-6">
    {children}
  </div>
)

// ─── DoubleBezel Card ────────────────────────────────────────────────────────

const DoubleBezelCard: React.FC<{
  children: React.ReactNode
  className?: string
  spotlight?: boolean
}> = ({ children, className = '', spotlight = false }) => {
  const { handleMouseMove } = useSpotlightCard()

  return (
    <div
      className={`rounded-2xl p-[1px] border border-white/[0.06] dark:border-white/[0.06] border-zinc-200/60 h-full ${spotlight ? 'spotlight-card' : ''}`}
      onMouseMove={spotlight ? handleMouseMove : undefined}
    >
      <div
        className={`bg-zinc-50 dark:bg-zinc-950 rounded-[15px] p-8 h-full flex flex-col ${className}`}
      >
        {children}
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

const RicardoPortfolio: React.FC<PortfolioProps> = ({ showContact = true }) => {
  const { theme, toggleTheme } = useTheme()
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [heroReady, setHeroReady] = useState(false)

  const heroName = useTextScramble('Ricardo Alexander', heroReady)

  useEffect(() => {
    const timer = setTimeout(() => setHeroReady(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const magnetic = useMagneticHover(0.3)

  const youtubeVideoId = 'GHC_3oE1i6g'

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-x-hidden transition-colors duration-300">
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} videoId={youtubeVideoId} />
      <Navigation theme={theme} toggleTheme={toggleTheme} />

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section id="hero" className="relative min-h-[100dvh] grid grid-cols-1 lg:grid-cols-2 items-center px-6 md:px-12 lg:px-20 pt-24">
        {/* Code Rain background */}
        <CodeRain />

        {/* Mobile 3D background */}
        <div className="absolute inset-0 z-[1] lg:hidden opacity-40 flex items-center justify-center pointer-events-none">
          <div className="w-[85vw] h-[85vw] max-w-[480px] max-h-[480px] pointer-events-auto">
            <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }}>
              <Suspense fallback={null}>
                <HeroScene />
              </Suspense>
            </Canvas>
          </div>
        </div>

        {/* Left content */}
        <motion.div
          className="relative z-10 pointer-events-none"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
        >
          <div className="flex flex-wrap gap-2 mb-6 pointer-events-auto">
            <div className="inline-block px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10">
              <span className="text-xs font-jetbrains text-emerald-500 tracking-wider uppercase">
                Software Architect
              </span>
            </div>
            <div className="inline-block px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10">
              <span className="text-xs font-jetbrains text-emerald-500 tracking-wider uppercase">
                Tech Entrepreneur
              </span>
            </div>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-space-grotesk font-bold leading-[0.9] mb-6 text-zinc-900 dark:text-zinc-100">
            {heroName || '\u00A0'}
          </h1>

          <HeroTypingAnimation />

          <div className="flex flex-wrap gap-4 pointer-events-auto">
            <motion.a
              href="#contact"
              className="inline-flex items-center px-7 py-3.5 rounded-full bg-emerald-500 text-white font-outfit font-semibold text-sm hover:bg-emerald-400 transition-colors"
              style={{ x: magnetic.springX, y: magnetic.springY }}
              onMouseMove={magnetic.handleMouseMove}
              onMouseLeave={magnetic.handleMouseLeave}
            >
              Get in touch
            </motion.a>
          </div>
        </motion.div>

        {/* Right: 3D canvas + gradient (desktop) */}
        <div className="hidden lg:block relative h-full min-h-[500px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
          </div>
          <div className="absolute inset-0">
            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
              <Suspense fallback={null}>
                <HeroScene />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </section>

      {/* ─── About ────────────────────────────────────────────────────── */}
      <section id="about" className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel>01 / About</SectionLabel>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 lg:gap-20 mb-16">
            <ScrollReveal>
              <p className="text-2xl md:text-3xl font-light leading-relaxed text-zinc-700 dark:text-zinc-300 font-outfit">
                Passionate Software Architect and Technology Entrepreneur with 20+ years of experience
                transforming complex business challenges into scalable, high-performance solutions.
                As Co-Founder & Managing Partner of SparkWorks, I've partnered with Fortune 500 companies
                like Toyota, Bank Mandiri, and Astra Group to drive digital transformation.
              </p>
              <p className="text-lg md:text-xl font-light leading-relaxed text-zinc-600 dark:text-zinc-400 font-outfit mt-6">
                My expertise spans enterprise architecture, AI/LLM integration, blockchain development,
                and leading cross-functional teams. I believe in bridging cutting-edge technology with
                practical business value, ensuring every solution delivers measurable impact.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="space-y-0">
                <div className="border-t border-zinc-200 dark:border-zinc-800 py-6">
                  <div className="text-3xl font-space-grotesk font-bold text-zinc-900 dark:text-zinc-100">
                    <AnimatedCounter end={20} suffix="+" />
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-500 font-outfit mt-1">Years Experience</div>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-800 py-6">
                  <div className="text-3xl font-space-grotesk font-bold text-zinc-900 dark:text-zinc-100">
                    <AnimatedCounter end={100} suffix="+" />
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-500 font-outfit mt-1">Projects Delivered</div>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-800 py-6">
                  <div className="text-3xl font-space-grotesk font-bold text-zinc-900 dark:text-zinc-100">
                    <AnimatedCounter end={99} suffix=".9%" />
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-500 font-outfit mt-1">System Uptime</div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Video + PDF in Double-Bezel cards */}
          <div className="grid gap-6">
            {/* <ScrollReveal delay={0.15}>
              <DoubleBezelCard spotlight>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3 font-space-grotesk">
                  Professional Overview
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6 font-outfit text-sm leading-relaxed">
                  Watch an AI-generated overview of my professional journey and expertise.
                </p>
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="mt-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 text-white font-outfit font-medium text-sm hover:bg-emerald-400 transition-colors"
                >
                  <Play size={16} weight="fill" />
                  Watch Video
                </button>
              </DoubleBezelCard>
            </ScrollReveal> */}

            <ScrollReveal delay={0.2}>
              <DoubleBezelCard spotlight>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3 font-space-grotesk">
                  Complete Portfolio
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6 font-outfit text-sm leading-relaxed">
                  Download my comprehensive portfolio with detailed project experiences and client work.
                </p>
                <a
                  href="/Ricardo Alexander - Portfolio 2025.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-outfit font-medium text-sm hover:border-zinc-500 dark:hover:border-zinc-500 transition-colors"
                >
                  <DownloadSimple size={16} weight="bold" />
                  Download PDF
                </a>
              </DoubleBezelCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── Skills ───────────────────────────────────────────────────── */}
      <section id="skills" className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel>02 / Expertise</SectionLabel>
          </ScrollReveal>

          <div className="space-y-0">
            {skills.map((skill, i) => (
              <ScrollReveal key={skill.category} delay={i * 0.05}>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8 border-t border-zinc-200 dark:border-zinc-800 py-6 md:py-8 items-start">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 dark:text-zinc-500">{skill.icon}</span>
                    <span className="font-space-grotesk font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                      {skill.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-xs font-jetbrains rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-emerald-500/40 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Products ────────────────────────────────────────────────── */}
      <section id="products" className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel>03 / Products</SectionLabel>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 font-outfit max-w-2xl mb-12">
              Tools and products I&apos;ve built to solve real problems.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
            {/* <ScrollReveal delay={0.15}>
              <DoubleBezelCard spotlight>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl" style={{ color: '#7b6cff' }}>&#x25C8;</span>
                  <h3 className="text-2xl font-space-grotesk font-bold text-zinc-900 dark:text-zinc-100">
                    Auris
                  </h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 font-outfit mb-6 leading-relaxed flex-1">
                  AI voice assistant for <span style={{ color: '#D97757', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><img src="/claude-ai-icon.svg" alt="Claude" width="18" height="18" />Claude Code</span> &mdash; Web, VS Code, Terminal &amp; Desktop.
                  Hands-free vibe coding with intelligent voice commands.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Voice AI', 'Claude Code', 'VS Code', 'Desktop', 'Multi-platform'].map(tag => (
                    <span key={tag} className="px-2.5 py-1 text-xs font-jetbrains rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href="/products/auris"
                  className="inline-flex items-center gap-2 text-sm text-emerald-500 font-outfit font-semibold hover:text-emerald-400 transition-colors mt-auto"
                >
                  Coming Soon &middot; Learn more &rarr;
                </a>
              </DoubleBezelCard>
            </ScrollReveal> */}
            <ScrollReveal delay={0.2}>
              <DoubleBezelCard spotlight>
                <div className="flex items-center gap-4 mb-4">
                  <span style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(3, 6px)', gap: '2px' }}>{[1,0,1,0,1,0,1,0,1].map((on, idx) => <span key={idx} className={on ? 'bg-zinc-400 dark:bg-white/30' : 'bg-zinc-200 dark:bg-white/[0.08]'} style={{ width: 6, height: 6, borderRadius: 1 }} />)}</span>
                  <h3 className="text-2xl font-space-grotesk font-bold text-zinc-900 dark:text-zinc-100">
                    Now
                  </h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 font-outfit mb-6 leading-relaxed flex-1">
                  A tiny pixel companion that sits on your screen &mdash; always present, never demanding. Clock, progress bars, pomodoro, notes, and ambient sounds. 6 companions, each with personality.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Multiplatform', 'Pixel Art', 'Desktop', 'Companion', 'Productivity'].map(tag => (
                    <span key={tag} className="px-2.5 py-1 text-xs font-jetbrains rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href="/products/now"
                  className="inline-flex items-center gap-2 text-sm text-emerald-500 font-outfit font-semibold hover:text-emerald-400 transition-colors mt-auto"
                >
                  Coming Soon &middot; Learn more &rarr;
                </a>
              </DoubleBezelCard>
            </ScrollReveal>
            <ScrollReveal delay={0.25}>
              <DoubleBezelCard spotlight>
                <div className="flex items-center gap-4 mb-4">
                  <img src="/semakin-pintar-logo.png" alt="Semakin Pintar" width={32} height={32} className="rounded" />
                  <h3 className="text-2xl font-space-grotesk font-bold text-zinc-900 dark:text-zinc-100">
                    Semakin Pintar
                  </h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 font-outfit mb-6 leading-relaxed flex-1">
                  Free educational games platform for kids &amp; family learning &mdash; mental arithmetic, multiplication tables, and brain training games.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Education', 'Games', 'Kids', 'Brain Training', 'Free'].map(tag => (
                    <span key={tag} className="px-2.5 py-1 text-xs font-jetbrains rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href="https://www.semakinpintar.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-emerald-500 font-outfit font-semibold hover:text-emerald-400 transition-colors mt-auto"
                >
                  Visit website &rarr;
                </a>
              </DoubleBezelCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── Projects ─────────────────────────────────────────────────── */}
      <section id="projects" className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel>04 / Work</SectionLabel>
          </ScrollReveal>

          <div className="space-y-24 md:space-y-32">
            {projects.map((project, i) => {
              const isEven = i % 2 === 0
              return (
                <ScrollReveal key={project.title} delay={0.1}>
                  <div
                    className={`grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 ${
                      !isEven ? 'md:[direction:rtl]' : ''
                    }`}
                  >
                    <div className={!isEven ? 'md:[direction:ltr]' : ''}>
                      <DoubleBezelCard spotlight>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-space-grotesk">
                            {project.title}
                          </h3>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-500 hover:text-emerald-400 transition-colors shrink-0 text-sm font-outfit"
                            >
                              Visit site &rarr;
                            </a>
                          )}
                        </div>

                        <p className="text-zinc-600 dark:text-zinc-400 mb-5 leading-relaxed font-outfit text-sm">
                          {project.description}
                        </p>

                        <div className="mb-5 flex flex-wrap gap-2">
                          <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/20">
                            {project.impact}
                          </span>
                          {project.metrics && (
                            <span className="inline-block px-3 py-1 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 rounded-full text-xs font-jetbrains">
                              {project.metrics}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 text-[10px] bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-500 rounded font-jetbrains"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </DoubleBezelCard>
                    </div>

                    <div className={`hidden md:block ${!isEven ? 'md:[direction:ltr]' : ''}`} />
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Clients ──────────────────────────────────────────────────── */}
      <section id="clients" className="py-24 md:py-32 px-6 md:px-12 lg:px-20 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel>05 / Clients</SectionLabel>
          </ScrollReveal>
        </div>

        {/* Marquee row 1 */}
        <div className="relative mb-4">
          <div
            className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused]"
            style={{ width: 'max-content' }}
          >
            {[...clients, ...clients].map((client, i) => (
              <span
                key={`r1-${i}`}
                className="inline-block px-8 md:px-12 text-2xl md:text-4xl font-bold text-zinc-300 dark:text-zinc-700 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors duration-300 font-space-grotesk select-none cursor-default"
              >
                {client}
              </span>
            ))}
          </div>
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-zinc-50 dark:from-zinc-950 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-zinc-50 dark:from-zinc-950 to-transparent pointer-events-none" />
        </div>

        {/* Marquee row 2 (reversed) */}
        <div className="relative mb-16">
          <div
            className="flex whitespace-nowrap animate-marquee [animation-direction:reverse] hover:[animation-play-state:paused]"
            style={{ width: 'max-content' }}
          >
            {[...clients.slice().reverse(), ...clients.slice().reverse()].map((client, i) => (
              <span
                key={`r2-${i}`}
                className="inline-block px-8 md:px-12 text-2xl md:text-4xl font-bold text-zinc-300 dark:text-zinc-700 hover:text-zinc-800 dark:hover:text-zinc-100 transition-colors duration-300 font-space-grotesk select-none cursor-default"
              >
                {client}
              </span>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-zinc-50 dark:from-zinc-950 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-zinc-50 dark:from-zinc-950 to-transparent pointer-events-none" />
        </div>

        {/* Metrics */}
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="border-t border-zinc-200 dark:border-zinc-800 py-6 md:pr-8">
                <div className="text-2xl font-space-grotesk font-bold text-zinc-900 dark:text-zinc-100">300%</div>
                <div className="text-sm text-zinc-500 font-outfit mt-1">Performance Improvements</div>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-800 py-6 md:px-8">
                <div className="text-2xl font-space-grotesk font-bold text-zinc-900 dark:text-zinc-100">$200K+</div>
                <div className="text-sm text-zinc-500 font-outfit mt-1">Annual Cost Savings</div>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-800 py-6 md:pl-8">
                <div className="text-2xl font-space-grotesk font-bold text-zinc-900 dark:text-zinc-100">99.9%</div>
                <div className="text-sm text-zinc-500 font-outfit mt-1">System Uptime</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Contact ──────────────────────────────────────────────────── */}
      {showContact && (
        <section id="contact" className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <SectionLabel>06 / Contact</SectionLabel>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h2 className="text-5xl md:text-7xl font-bold font-space-grotesk text-zinc-900 dark:text-zinc-100 mb-10">
                Let's talk.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="mailto:ricardoalexanderh@gmail.com"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-emerald-500 text-white font-outfit font-semibold text-sm hover:bg-emerald-400 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <EnvelopeSimple size={18} weight="bold" />
                  Email
                </motion.a>
                <motion.a
                  href="mailto:ricardo.alexanderh@sparkworks.co.id"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-outfit font-semibold text-sm hover:border-zinc-500 dark:hover:border-zinc-500 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <EnvelopeSimple size={18} weight="bold" />
                  Company Email
                </motion.a>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-sm text-zinc-500 font-outfit">
            &copy; 2026 Ricardo Alexander
          </span>
          <div className="flex items-center space-x-3">
            <a
              href="https://linkedin.com/in/ricardoalexanderh"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <LinkedinLogo size={18} className="text-zinc-500" weight="bold" />
            </a>
            <a
              href="https://github.com/ricardoalexanderh"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <GithubLogo size={18} className="text-zinc-500" weight="bold" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default RicardoPortfolio
