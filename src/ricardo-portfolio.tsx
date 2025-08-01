import React, { useRef, useState, useEffect, Suspense } from 'react'
import { motion, useInView } from 'motion/react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Linkedin, Mail, Github, ExternalLink, Code, Database, Cloud, Smartphone, Globe, Cpu } from 'lucide-react'

// Types
interface PortfolioProps {
  theme?: 'dark' | 'light'
  showContact?: boolean
  enableAnimations?: boolean
  mobileOptimized?: boolean
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
    </>
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
    technologies: ["C#/.NET", "Java/Spring Boot", "Python", "Node.js/NestJS", "TypeScript", "Solidity"],
    icon: <Code className="w-6 h-6" />,
    color: "text-cyan-400"
  },
  {
    category: "Frontend",
    technologies: ["React", "Angular", "Flutter", "Next.js", "Vue.js"],
    icon: <Globe className="w-6 h-6" />,
    color: "text-teal-400"
  },
  {
    category: "Cloud & DevOps",
    technologies: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Jenkins"],
    icon: <Cloud className="w-6 h-6" />,
    color: "text-purple-400"
  },
  {
    category: "Databases",
    technologies: ["SQL Server", "PostgreSQL", "Oracle", "MongoDB", "Redis", "Neo4J"],
    icon: <Database className="w-6 h-6" />,
    color: "text-orange-400"
  },
  {
    category: "Mobile & Web3",
    technologies: ["React Native", "Flutter", "Hardhat", "Ethers.js", "Web3.js"],
    icon: <Smartphone className="w-6 h-6" />,
    color: "text-green-400"
  },
  {
    category: "Emerging Tech",
    technologies: ["AI/ML", "Context Engineering", "MCP Servers", "Golang", "Rust"],
    icon: <Cpu className="w-6 h-6" />,
    color: "text-pink-400"
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
    title: "SparkWorks Platform",
    description: "Co-founded and built enterprise platform serving Fortune 500 companies including Bank Mandiri, Astra Group, and Panasonic. Led technical strategy for 100+ projects.",
    impact: "Fortune 500 Partnerships",
    technologies: ["React", "Node.js", "AWS", "Microservices", "PostgreSQL"],
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
    description: "Developed DeFi platforms and Web3 applications using Solidity smart contracts with focus on security and decentralized architecture.",
    impact: "Blockchain Innovation",
    technologies: ["Solidity", "Hardhat", "Ethers.js", "DeFi", "Smart Contracts"],
    metrics: "Multiple DeFi implementations"
  }
]

const clients = [
  "Toyota Group", "Bank Mandiri", "Astra Group", "Panasonic", "UOB Bank",
  "BCA Finance", "Boston Consulting Group", "Accenture", "AstraPay", "BUMA"
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

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
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
            className="text-5xl md:text-7xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Ricardo Alexander
            </span>
          </motion.h1>
          
          <motion.div
            className="text-xl md:text-2xl text-gray-300 mb-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <span className="text-orange-500 font-semibold">Tech Enthusiast & Software Architect</span>
            <br />
            <span className="text-purple-400">Building Tomorrow's Systems Today</span>
            <br />
            <span className="text-sm text-cyan-400">AI/ML " Web3 " Enterprise Systems " Mobile</span>
          </motion.div>

          <motion.p
            className="text-lg text-gray-400 mb-8"
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
            <div className="animate-bounce">
              <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          {...fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              About Me
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            className="text-center p-6 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-4xl font-bold text-cyan-400 mb-2">
              <AnimatedCounter end={20} suffix="+" />
            </div>
            <p className="text-gray-300">Years Experience</p>
          </motion.div>

          <motion.div
            className="text-center p-6 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="text-4xl font-bold text-teal-400 mb-2">
              <AnimatedCounter end={100} suffix="+" />
            </div>
            <p className="text-gray-300">Projects Delivered</p>
          </motion.div>

          <motion.div
            className="text-center p-6 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-4xl font-bold text-orange-400 mb-2">
              <AnimatedCounter end={99} suffix=".9%" />
            </div>
            <p className="text-gray-300">System Uptime</p>
          </motion.div>
        </div>

        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            Passionate Software Architect and Technology Entrepreneur with 20+ years of experience 
            transforming complex business challenges into scalable, high-performance solutions. 
            As Co-Founder & Managing Partner of SparkWorks, I've partnered with Fortune 500 companies 
            like Toyota, Bank Mandiri, and Astra Group to drive digital transformation.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            My expertise spans enterprise architecture, AI/ML integration, blockchain development, 
            and leading cross-functional teams. I believe in bridging cutting-edge technology 
            with practical business value, ensuring every solution delivers measurable impact.
          </p>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 md:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
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
                className="p-6 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-cyan-400/50 transition-all duration-300 group"
                variants={fadeInUp}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center mb-4">
                  <div className={`${skill.color} mr-3 group-hover:scale-110 transition-transform`}>
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{skill.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skill.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm bg-slate-700/50 text-gray-300 rounded-full border border-slate-600 hover:border-cyan-400/50 transition-colors"
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
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Featured Projects
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.title}
                className="p-6 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-orange-400/50 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                    {project.title}
                  </h3>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>

                <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>

                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 rounded-full text-sm font-semibold border border-orange-500/30">
                    {project.impact}
                  </span>
                  {project.metrics && (
                    <span className="inline-block ml-2 px-3 py-1 bg-slate-700/50 text-cyan-400 rounded-full text-sm">
                      {project.metrics}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs bg-slate-700/50 text-gray-400 rounded border border-slate-600"
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
      <section className="py-20 px-4 md:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
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
                className="text-center p-4 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-green-400/50 transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-gray-300 font-medium text-sm">{client}</p>
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
              <div className="text-3xl font-bold text-green-400 mb-2">300%</div>
              <p className="text-gray-300">Performance Improvements</p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-bold text-blue-400 mb-2">$200K+</div>
              <p className="text-gray-300">Annual Cost Savings</p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-bold text-purple-400 mb-2">99.9%</div>
              <p className="text-gray-300">System Uptime</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      {showContact && (
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="mb-16"
              {...fadeInUp}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Let's Build Something Amazing
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
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
                href="https://linkedin.com/in/ricardoalexander"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors group"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                LinkedIn
              </motion.a>

              <motion.a
                href="mailto:ricardo@sparkworks.com"
                className="flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Email
              </motion.a>

              <motion.a
                href="https://github.com/ricardoalexander"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                GitHub
              </motion.a>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-slate-700">
        <p className="text-gray-400">
          © 2025 Ricardo Alexander. Built with React, Three.js, and passion for innovation.
        </p>
      </footer>
    </div>
  )
}

export default RicardoPortfolio