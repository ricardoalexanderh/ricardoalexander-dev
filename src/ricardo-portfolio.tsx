import React, { useRef, useState, useEffect, Suspense } from 'react'
import { motion, useInView } from 'motion/react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Linkedin, Mail, Github, ExternalLink, Code, Database, Cloud, Smartphone, Globe, Cpu, Sun, Moon, Menu, X, ChevronDown, Play } from 'lucide-react'

// Types
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

interface Skill {
  category: string
  technologies: string[]
  icon: React.ReactNode
  color: string
}

// Theme context
const useTheme = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark'
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

// Video Modal Component
const VideoModal: React.FC<{ isOpen: boolean; onClose: () => void; videoId: string }> = ({ isOpen, onClose, videoId }) => {
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
        className="relative w-full max-w-4xl bg-slate-900 rounded-lg overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Video container with responsive aspect ratio */}
        <div className="relative w-full pb-[56.25%] h-0"> {/* 16:9 aspect ratio */}
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

// 3D Components
const FloatingGeometry: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <octahedronGeometry args={[0.5]} />
        <meshStandardMaterial
          color={hovered ? '#00D4FF' : '#4ECDC4'}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  )
}

const Scene3D: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <FloatingGeometry position={[-2, 0, 0]} />
      <FloatingGeometry position={[2, 1, -1]} />
      <FloatingGeometry position={[0, -1, -2]} />
      <FloatingGeometry position={[-1, 2, -1]} />
      <FloatingGeometry position={[3, -0.5, 0]} />
      <FloatingGeometry position={[-3, -1, 1]} />
      <FloatingGeometry position={[1, 2.5, -2]} />
      <FloatingGeometry position={[-2.5, -2, -1]} />
      <FloatingGeometry position={[4, 1, -3]} />
      <FloatingGeometry position={[-4, 0.5, 0]} />
      <FloatingGeometry position={[0, -2.5, 1]} />
      <FloatingGeometry position={[2.5, -1.5, -2]} />
    </>
  )
}

// Navigation Component
const Navigation: React.FC<{ theme: 'dark' | 'light'; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Ricardo Alexander" className="w-10 h-10 rounded-full" />
            <span className="font-space-grotesk font-bold text-xl text-white">Ricardo Alexander</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('about')} className="text-gray-300 hover:text-cyan-400 transition-colors font-outfit">About</button>
            <button onClick={() => scrollToSection('skills')} className="text-gray-300 hover:text-cyan-400 transition-colors font-outfit">Skills</button>
            <button onClick={() => scrollToSection('projects')} className="text-gray-300 hover:text-cyan-400 transition-colors font-outfit">Projects</button>
            <button onClick={() => scrollToSection('clients')} className="text-gray-300 hover:text-cyan-400 transition-colors font-outfit">Clients</button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-cyan-400 transition-colors font-outfit">Contact</button>
            
            {/* Social Links */}
            <a
              href="https://linkedin.com/in/ricardoalexanderh"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors group"
            >
              <Linkedin className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
            </a>
            <a
              href="https://github.com/ricardoalexanderh"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors group"
            >
              <Github className="w-5 h-5 text-gray-300 group-hover:text-white" />
            </a>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-400" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <a
              href="https://linkedin.com/in/ricardoalexanderh"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors group"
            >
              <Linkedin className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
            </a>
            <a
              href="https://github.com/ricardoalexanderh"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors group"
            >
              <Github className="w-5 h-5 text-gray-300 group-hover:text-white" />
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-400" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-slate-800/95 backdrop-blur-lg rounded-lg mt-2 p-4 space-y-3"
          >
            <button onClick={() => scrollToSection('about')} className="block w-full text-left text-gray-300 hover:text-cyan-400 transition-colors font-outfit py-2">About</button>
            <button onClick={() => scrollToSection('skills')} className="block w-full text-left text-gray-300 hover:text-cyan-400 transition-colors font-outfit py-2">Skills</button>
            <button onClick={() => scrollToSection('projects')} className="block w-full text-left text-gray-300 hover:text-cyan-400 transition-colors font-outfit py-2">Projects</button>
            <button onClick={() => scrollToSection('clients')} className="block w-full text-left text-gray-300 hover:text-cyan-400 transition-colors font-outfit py-2">Clients</button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-gray-300 hover:text-cyan-400 transition-colors font-outfit py-2">Contact</button>
          </motion.div>
        )}
      </div>
    </nav>
  )
}

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Data
const skills: Skill[] = [
  {
    category: "Languages & Frameworks",
    technologies: ["C#/.NET", "Java/Spring Boot", "Python", "Node.js/NestJS", "TypeScript"],
    icon: <Code className="w-6 h-6" />,
    color: "text-cyan-400"
  },
  {
    category: "Frontend",
    technologies: ["React", "Angular", "Next.js", "Vue.js", "TypeScript"],
    icon: <Globe className="w-6 h-6" />,
    color: "text-teal-400"
  },
  {
    category: "Mobile Development",
    technologies: ["React Native", "Flutter", "iOS", "Android"],
    icon: <Smartphone className="w-6 h-6" />,
    color: "text-green-400"
  },
  {
    category: "Web3 & Blockchain",
    technologies: ["Solidity", "Foundry", "Hardhat", "Ethers.js", "Web3.js"],
    icon: <Cpu className="w-6 h-6" />,
    color: "text-purple-400"
  },
  {
    category: "Cloud & DevOps",
    technologies: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Jenkins"],
    icon: <Cloud className="w-6 h-6" />,
    color: "text-orange-400"
  },
  {
    category: "Databases",
    technologies: ["SQL Server", "PostgreSQL", "Oracle", "MongoDB", "Redis", "Neo4J"],
    icon: <Database className="w-6 h-6" />,
    color: "text-pink-400"
  },
  {
    category: "Emerging Tech",
    technologies: ["AI/LLM", "Context Engineering", "MCP Servers", "Golang", "Rust"],
    icon: <Cpu className="w-6 h-6" />,
    color: "text-indigo-400"
  }
]

const projects: Project[] = [
  {
    title: "Toyota Performance Optimization",
    description: "Re-engineered costing system for Toyota Astra Motor, transforming a system that took 3+ hours and frequently failed into one that processes in 10-15 minutes with 99.9% reliability.",
    impact: "90% Performance Improvement",
    technologies: ["SQL Server", "Microservices", ".NET", "Performance Tuning"],
    metrics: "1-2M daily transactions"
  },
  {
    title: "SparkWorks",
    description: "Co-founded and built enterprise platform serving Fortune 500 companies including Bank Mandiri, Astra Group, and Panasonic. Led technical strategy for 100+ projects.",
    impact: "Fortune 500 Partnerships",
    technologies: ["React", "Angular", "Mobile", "Node.js", ".NET", "Microservices", "Java"],
    metrics: "20+ enterprise clients"
  },
  {
    title: "Semakin Pintar Educational Platform",
    description: "Created gamified educational website for children's mathematics learning with interactive games and tools. Publicly available educational resource.",
    impact: "Educational Innovation",
    technologies: ["React", "Node.js", "Gamification", "Educational Design"],
    link: "https://www.semakinpintar.com"
  },
  {
    title: "Web3 & Blockchain Development",
    description: "Developed blockchain platforms and Web3 applications using Solidity smart contracts with focus on security and decentralized architecture.",
    impact: "Blockchain Innovation",
    technologies: ["Solidity", "Foundry", "Hardhat", "Ethers.js", "Smart Contracts"],
    metrics: "Multiple blockchain implementations"
  }
]

const clients = [
  "Toyota Group",
  "Bank Mandiri", 
  "Astra Group",
  "Panasonic",
  "UOB Bank",
  "BCA Finance",
  "Boston Consulting Group",
  "Accenture",
  "AstraPay",
  "BUMA"
]

// Components
const AnimatedCounter: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ 
  end, 
  duration = 2, 
  suffix = "" 
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
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [inView, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

const RicardoPortfolio: React.FC<PortfolioProps> = ({
  showContact = true
}) => {
  const { theme, toggleTheme } = useTheme()
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  
  // YouTube video ID for professional overview
  const youtubeVideoId = "GHC_3oE1i6g"

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white overflow-x-hidden transition-colors duration-300">
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
      {/* Video Modal */}
      <VideoModal 
        isOpen={isVideoOpen} 
        onClose={() => setIsVideoOpen(false)} 
        videoId={youtubeVideoId} 
      />
      
      {/* Navigation */}
      <Navigation theme={theme} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center pt-16">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
            <Suspense fallback={null}>
              <Scene3D />
              <OrbitControls enableZoom={false} enablePan={false} />
            </Suspense>
          </Canvas>
        </div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-space-grotesk font-bold mb-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-teal-400 bg-clip-text text-transparent animate-pulse bg-[length:200%_100%]" style={{animation: 'gradient-shift 3s ease-in-out infinite'}}>
              Ricardo Alexander
            </span>
          </motion.h1>
          
          <motion.div
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-6 max-w-4xl mx-auto font-outfit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <span className="text-orange-500 font-semibold">Tech Enthusiast & Software Architect</span>
            <br />
            <span className="text-purple-500 dark:text-purple-400">Building Tomorrow's Systems Today</span>
            <br />
            <span className="text-sm text-cyan-500 dark:text-cyan-400 font-jetbrains">Full-stack ● Web ● Mobile ● Web3 ● AI/LLM</span>
          </motion.div>

          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 mb-8 font-outfit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Co-Founder & Managing Partner at SparkWorks
          </motion.p>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="animate-bounce"
            >
              <ChevronDown className="w-8 h-8 text-cyan-400" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          {...fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-space-grotesk font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              About Me
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            className="text-center p-6 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-4xl font-bold text-cyan-500 mb-2 font-space-grotesk">
              <AnimatedCounter end={20} suffix="+" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-outfit">Years Experience</p>
          </motion.div>

          <motion.div
            className="text-center p-6 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="text-4xl font-bold text-teal-500 mb-2 font-space-grotesk">
              <AnimatedCounter end={100} suffix="+" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-outfit">Projects Delivered</p>
          </motion.div>

          <motion.div
            className="text-center p-6 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-4xl font-bold text-orange-500 mb-2 font-space-grotesk">
              <AnimatedCounter end={99} suffix=".9%" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-outfit">System Uptime</p>
          </motion.div>
        </div>

        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6 font-outfit">
            Passionate Software Architect and Technology Entrepreneur with 20+ years of experience 
            transforming complex business challenges into scalable, high-performance solutions. 
            As Co-Founder & Managing Partner of SparkWorks, I've partnered with Fortune 500 companies 
            like Toyota, Bank Mandiri, and Astra Group to drive digital transformation.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8 font-outfit">
            My expertise spans enterprise architecture, AI/LLM integration, blockchain development, 
            and leading cross-functional teams. I believe in bridging cutting-edge technology 
            with practical business value, ensuring every solution delivers measurable impact.
          </p>

          {/* Video Overview & PDF Portfolio */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <motion.div
              className="p-6 rounded-lg bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 font-space-grotesk">
                🎥 Professional Overview
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 font-outfit">
                Watch an AI-generated overview of my professional journey and expertise
              </p>
              <motion.button
                onClick={() => setIsVideoOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300 font-outfit font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Video Overview
              </motion.button>
            </motion.div>

            <motion.div
              className="p-6 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 font-space-grotesk">
                📄 Complete Portfolio
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 font-outfit">
                Download my comprehensive portfolio with detailed project experiences and client work
              </p>
              <motion.a
                href="/Ricardo Alexander - Portfolio 2025.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all duration-300 font-outfit font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download PDF Portfolio
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 md:px-8 bg-gray-50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-space-grotesk font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Technical Expertise
              </span>
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {skills.map((skill) => (
              <motion.div
                key={skill.category}
                className="p-6 rounded-lg bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 hover:border-cyan-400/50 transition-all duration-300 group"
                variants={fadeInUp}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center mb-4">
                  <div className={`${skill.color} mr-3 group-hover:scale-110 transition-transform`}>
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white font-space-grotesk">{skill.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skill.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-slate-700/50 text-gray-800 dark:text-gray-300 rounded-full border border-gray-200 dark:border-slate-600 hover:border-cyan-400/50 transition-colors font-jetbrains"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-space-grotesk font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.title}
                className="p-6 rounded-lg bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 hover:border-orange-400/50 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-orange-500 transition-colors font-space-grotesk">
                    {project.title}
                  </h3>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-500 hover:text-cyan-400 transition-colors shrink-0"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed font-outfit">{project.description}</p>

                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-500 dark:text-orange-400 rounded-full text-sm font-semibold border border-orange-500/30">
                    {project.impact}
                  </span>
                  {project.metrics && (
                    <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-slate-700/50 text-cyan-700 dark:text-cyan-400 rounded-full text-sm font-jetbrains">
                      {project.metrics}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700/50 text-gray-700 dark:text-gray-400 rounded border border-gray-200 dark:border-slate-600 font-jetbrains"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section id="clients" className="py-20 px-4 md:px-8 bg-gray-50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-space-grotesk font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Trusted by Industry Leaders
              </span>
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {clients.map((client) => (
              <motion.div
                key={client}
                className="text-center p-4 rounded-lg bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200 dark:border-slate-700 hover:border-green-400/50 transition-all duration-300 group"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-gray-700 dark:text-gray-300 font-medium text-sm font-outfit group-hover:text-green-500 transition-colors">
                  {client}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-6 rounded-lg bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-bold text-green-500 mb-2 font-space-grotesk">300%</div>
              <p className="text-gray-700 dark:text-gray-300 font-outfit">Performance Improvements</p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-bold text-blue-500 mb-2 font-space-grotesk">$200K+</div>
              <p className="text-gray-700 dark:text-gray-300 font-outfit">Annual Cost Savings</p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-bold text-purple-500 mb-2 font-space-grotesk">99.9%</div>
              <p className="text-gray-700 dark:text-gray-300 font-outfit">System Uptime</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      {showContact && (
        <section id="contact" className="py-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="mb-16"
              {...fadeInUp}
            >
              <h2 className="text-4xl md:text-5xl font-space-grotesk font-bold mb-6">
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Let's Build Something Amazing
                </span>
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 font-outfit">
                Ready to transform your challenges into scalable solutions?
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.a
                href="mailto:ricardoalexanderh@gmail.com"
                className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors group font-outfit"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Email
              </motion.a>

              <motion.a
                href="mailto:ricardo.alexanderh@sparkworks.co.id"
                className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors group font-outfit"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Company Email
              </motion.a>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-gray-200 dark:border-slate-700">
        <p className="text-gray-500 dark:text-gray-400 font-outfit">
          © 2025 Ricardo Alexander. Built with passion for innovation.
        </p>
      </footer>
    </div>
  )
}

export default RicardoPortfolio