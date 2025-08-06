import React, { useRef, useState, useEffect, Suspense } from 'react'
import { motion, useInView } from 'motion/react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Linkedin, Mail, Github, ExternalLink, Code, Database, Cloud, Smartphone, Globe, Cpu, Sun, Moon, Menu, X, ChevronDown, Play, Zap } from 'lucide-react'

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

// Hero subtitle lines for typing animation
const heroSubtitleLines = [
  "Tech Enthusiast & Software Architect",
  "Building Tomorrow's Systems Today", 
  "Full-stack ● Web ● Mobile ● Web3 ● AI/LLM",
  "Co-Founder & Managing Partner at SparkWorks"
]

// Hero subtitle typing animation component
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
          // Line completed, move to next line after delay
          setTimeout(() => {
            setCurrentLineIndex(prev => prev + 1)
            setCurrentCharIndex(0)
            setDisplayText(prev => prev + (currentLineIndex < heroSubtitleLines.length - 1 ? '\n' : ''))
          }, 150)
        }
      } else {
        // Animation completed, restart after delay
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
    <div className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-6 max-w-4xl mx-auto font-outfit min-h-[120px]">
      <div className="whitespace-pre-line">
        {displayText.split('\n').map((line, index) => (
          <div key={index} className="mb-1">
            {index === 0 && <span className="text-orange-500 font-semibold">{line}</span>}
            {index === 1 && <span className="text-purple-500 dark:text-purple-400">{line}</span>}
            {index === 2 && <span className="text-sm text-cyan-500 dark:text-cyan-400 font-jetbrains">{line}</span>}
            {index === 3 && <span className="text-lg text-gray-600 dark:text-gray-400 font-outfit">{line}</span>}
            {index === currentLineIndex && currentCharIndex <= heroSubtitleLines[currentLineIndex]?.length && (
              <span className="text-cyan-400 animate-pulse">|</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Solidity code snippets for technical expertise animation
const solidityCodeSnippets = [
  "// SPDX-License-Identifier: MIT",
  "pragma solidity ^0.8.19;",
  "",
  "import \"@openzeppelin/contracts/token/ERC20/ERC20.sol\";",
  "import \"@openzeppelin/contracts/access/Ownable.sol\";",
  "import \"@openzeppelin/contracts/security/ReentrancyGuard.sol\";",
  "",
  "contract DeFiYieldVault is ERC20, Ownable, ReentrancyGuard {",
  "    using SafeMath for uint256;",
  "",
  "    struct Stake {",
  "        uint256 amount;",
  "        uint256 timestamp;",
  "        uint256 rewardDebt;",
  "    }",
  "",
  "    mapping(address => Stake) public stakes;",
  "    uint256 public totalStaked;",
  "    uint256 public rewardRate = 100; // 1% per day",
  "    uint256 public constant PRECISION = 1e18;",
  "",
  "    event Staked(address indexed user, uint256 amount);",
  "    event Withdrawn(address indexed user, uint256 amount);",
  "    event RewardClaimed(address indexed user, uint256 reward);",
  "",
  "    modifier validAmount(uint256 _amount) {",
  "        require(_amount > 0, \"Amount must be greater than 0\");",
  "        _;",
  "    }",
  "",
  "    constructor() ERC20(\"YieldToken\", \"YIELD\") {}",
  "",
  "    function stake(uint256 _amount) external payable validAmount(_amount) nonReentrant {",
  "        require(msg.value == _amount, \"ETH amount mismatch\");",
  "        ",
  "        Stake storage userStake = stakes[msg.sender];",
  "        ",
  "        if (userStake.amount > 0) {",
  "            uint256 pendingReward = calculateReward(msg.sender);",
  "            if (pendingReward > 0) {",
  "                _mint(msg.sender, pendingReward);",
  "                emit RewardClaimed(msg.sender, pendingReward);",
  "            }",
  "        }",
  "",
  "        userStake.amount = userStake.amount.add(_amount);",
  "        userStake.timestamp = block.timestamp;",
  "        userStake.rewardDebt = userStake.amount.mul(getRewardPerToken());",
  "        ",
  "        totalStaked = totalStaked.add(_amount);",
  "        emit Staked(msg.sender, _amount);",
  "    }",
  "",
  "    function withdraw(uint256 _amount) external validAmount(_amount) nonReentrant {",
  "        Stake storage userStake = stakes[msg.sender];",
  "        require(userStake.amount >= _amount, \"Insufficient staked amount\");",
  "        ",
  "        uint256 pendingReward = calculateReward(msg.sender);",
  "        if (pendingReward > 0) {",
  "            _mint(msg.sender, pendingReward);",
  "            emit RewardClaimed(msg.sender, pendingReward);",
  "        }",
  "",
  "        userStake.amount = userStake.amount.sub(_amount);",
  "        userStake.rewardDebt = userStake.amount.mul(getRewardPerToken());",
  "        totalStaked = totalStaked.sub(_amount);",
  "",
  "        payable(msg.sender).transfer(_amount);",
  "        emit Withdrawn(msg.sender, _amount);",
  "    }",
  "",
  "    function calculateReward(address _user) public view returns (uint256) {",
  "        Stake memory userStake = stakes[_user];",
  "        if (userStake.amount == 0) return 0;",
  "",
  "        uint256 timeElapsed = block.timestamp.sub(userStake.timestamp);",
  "        uint256 reward = userStake.amount",
  "            .mul(rewardRate)",
  "            .mul(timeElapsed)",
  "            .div(86400) // seconds in a day",
  "            .div(10000); // basis points",
  "",
  "        return reward;",
  "    }",
  "",
  "    function getRewardPerToken() public view returns (uint256) {",
  "        if (totalStaked == 0) return 0;",
  "        return rewardRate.mul(PRECISION).div(totalStaked);",
  "    }",
  "",
  "    function emergencyWithdraw() external onlyOwner {",
  "        payable(owner()).transfer(address(this).balance);",
  "    }",
  "}",
]

// Solidity Math Animation Component for Technical Expertise
const SolidityMathAnimation: React.FC = () => {
  const [code, setCode] = useState('')
  const [currentLine, setCurrentLine] = useState(0)
  
  useEffect(() => {
    let lineIndex = 0
    let charIndex = 0
    let currentCodeLine = ''
    
    const typeWriter = () => {
      if (lineIndex < solidityCodeSnippets.length) {
        const currentSnippet = solidityCodeSnippets[lineIndex]
        
        if (charIndex < currentSnippet.length) {
          currentCodeLine += currentSnippet[charIndex]
          setCode(prev => {
            const lines = prev.split('\n')
            lines[lineIndex] = currentCodeLine
            return lines.join('\n')
          })
          charIndex++
          setTimeout(typeWriter, Math.random() * 40 + 20) // Faster typing for Solidity
        } else {
          // Line completed, move to next line
          setCode(prev => prev + (lineIndex < solidityCodeSnippets.length - 1 ? '\n' : ''))
          lineIndex++
          charIndex = 0
          currentCodeLine = ''
          setCurrentLine(lineIndex)
          setTimeout(typeWriter, Math.random() * 150 + 50) // Shorter pause between lines
        }
      } else {
        // Animation completed, restart after delay
        setTimeout(() => {
          setCode('')
          setCurrentLine(0)
          lineIndex = 0
          charIndex = 0
          currentCodeLine = ''
          typeWriter()
        }, 4000)
      }
    }

    const timer = setTimeout(typeWriter, 500) // Initial delay
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden opacity-8 dark:opacity-15 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
      <pre className="absolute top-0 left-0 w-full h-full text-xs leading-relaxed font-mono text-purple-600 dark:text-purple-400 p-6 overflow-hidden">
        <div className="animate-pulse text-blue-500 mb-2">
          // Smart Contract Development - Solidity DeFi Vault
        </div>
        <div className="relative">
          {code.split('\n').map((line, index) => (
            <div 
              key={index} 
              className={`${
                index === currentLine ? 'text-yellow-500 animate-pulse' : ''
              } ${
                line.includes('//') || line.includes('SPDX') ? 'text-gray-500' : 
                line.includes('contract') || line.includes('function') || line.includes('modifier') ? 'text-blue-500' :
                line.includes('mapping') || line.includes('struct') || line.includes('uint256') || line.includes('address') ? 'text-green-500' :
                line.includes('require') || line.includes('emit') || line.includes('if') || line.includes('return') ? 'text-orange-500' :
                line.includes('public') || line.includes('external') || line.includes('private') || line.includes('view') ? 'text-cyan-500' :
                line.includes('import') || line.includes('pragma') ? 'text-pink-500' :
                'text-purple-500'
              }`}
            >
              {line}
              {index === currentLine && (
                <span className="animate-blink text-purple-400">|</span>
              )}
            </div>
          ))}
        </div>
        
        {/* Floating blockchain symbols */}
        <div className="absolute top-4 right-4 space-y-2 text-right">
          <div className="animate-bounce delay-0 text-purple-500">⬣</div>
          <div className="animate-bounce delay-200 text-blue-500">◈</div>
          <div className="animate-bounce delay-400 text-green-500">⟐</div>
          <div className="animate-bounce delay-600 text-cyan-500">◊</div>
        </div>
        
        {/* Smart contract metrics */}
        <div className="absolute bottom-4 right-4 text-right text-gray-600 dark:text-gray-500 space-y-1">
          <div className="animate-pulse delay-100">Gas: ~50,000</div>
          <div className="animate-pulse delay-300">APY: 12.5%</div>
          <div className="animate-pulse delay-500">TVL: $2.3M</div>
        </div>
      </pre>
      
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  )
}

// Crypto code snippets for animation
const cryptoCodeSnippets = [
  "// Calculate SHA-256 hash for blockchain",
  "const hash = await crypto.subtle.digest('SHA-256', data);",
  "const hashArray = Array.from(new Uint8Array(hash));",
  "const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');",
  "",
  "// Generate Ethereum address from public key",
  "const publicKey = secp256k1.publicKeyCreate(privateKey);",
  "const address = '0x' + keccak256(publicKey.slice(1)).slice(-20).toString('hex');",
  "",
  "// Elliptic Curve Digital Signature Algorithm (ECDSA)",
  "interface ECDSASignature {",
  "  r: bigint;",
  "  s: bigint;",
  "  recovery?: number;",
  "}",
  "",
  "// Merkle Tree calculation for block verification",
  "function calculateMerkleRoot(transactions: string[]): string {",
  "  if (transactions.length === 0) return '';",
  "  if (transactions.length === 1) return transactions[0];",
  "",
  "  const level: string[] = [];",
  "  for (let i = 0; i < transactions.length; i += 2) {",
  "    const left = transactions[i];",
  "    const right = transactions[i + 1] || left;",
  "    const combined = left + right;",
  "    level.push(sha256(combined));",
  "  }",
  "  return calculateMerkleRoot(level);",
  "}",
  "",
  "// Smart contract gas estimation",
  "const gasPrice = await web3.eth.getGasPrice();",
  "const gasEstimate = await contract.methods.transfer(to, amount).estimateGas();",
  "const transactionCost = gasPrice * gasEstimate;",
  "",
  "// DeFi yield calculation with compound interest",
  "const calculateAPY = (principal: number, rate: number, periods: number): number => {",
  "  return principal * Math.pow(1 + rate / periods, periods) - principal;",
  "};",
  "",
  "// Zero-knowledge proof verification",
  "const zkProof = {",
  "  pi_a: [BigInt('0x...'), BigInt('0x...')],",
  "  pi_b: [[BigInt('0x...'), BigInt('0x...')], [BigInt('0x...'), BigInt('0x...')]],",
  "  pi_c: [BigInt('0x...'), BigInt('0x...')],",
  "  protocol: 'groth16',",
  "  curve: 'bn128'",
  "};",
  "",
  "// Layer 2 state channel implementation",
  "class PaymentChannel {",
  "  private nonce: number = 0;",
  "  private balance: Map<string, bigint> = new Map();",
  "",
  "  updateState(from: string, to: string, amount: bigint): void {",
  "    this.nonce++;",
  "    const fromBalance = this.balance.get(from) || 0n;",
  "    const toBalance = this.balance.get(to) || 0n;",
  "    this.balance.set(from, fromBalance - amount);",
  "    this.balance.set(to, toBalance + amount);",
  "  }",
  "}",
]

// Crypto Math Animation Component
const CryptoMathAnimation: React.FC = () => {
  const [code, setCode] = useState('')
  const [currentLine, setCurrentLine] = useState(0)

  useEffect(() => {
    let lineIndex = 0
    let charIndex = 0
    let currentCodeLine = ''
    
    const typeWriter = () => {
      if (lineIndex < cryptoCodeSnippets.length) {
        const currentSnippet = cryptoCodeSnippets[lineIndex]
        
        if (charIndex < currentSnippet.length) {
          currentCodeLine += currentSnippet[charIndex]
          setCode(prev => {
            const lines = prev.split('\n')
            lines[lineIndex] = currentCodeLine
            return lines.join('\n')
          })
          charIndex++
          setTimeout(typeWriter, Math.random() * 50 + 30) // Variable typing speed
        } else {
          // Line completed, move to next line
          setCode(prev => prev + (lineIndex < cryptoCodeSnippets.length - 1 ? '\n' : ''))
          lineIndex++
          charIndex = 0
          currentCodeLine = ''
          setCurrentLine(lineIndex)
          setTimeout(typeWriter, Math.random() * 200 + 100) // Pause between lines
        }
      } else {
        // Animation completed, restart after delay
        setTimeout(() => {
          setCode('')
          setCurrentLine(0)
          lineIndex = 0
          charIndex = 0
          currentCodeLine = ''
          typeWriter()
        }, 5000)
      }
    }

    const timer = setTimeout(typeWriter, 1000) // Initial delay
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden opacity-10 dark:opacity-20 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
      <pre className="absolute top-0 left-0 w-full h-full text-xs leading-relaxed font-mono text-cyan-600 dark:text-cyan-400 p-8 overflow-hidden">
        <div className="animate-pulse text-green-500 mb-2">
          // Blockchain & Crypto
        </div>
        <div className="relative">
          {code.split('\n').map((line, index) => (
            <div 
              key={index} 
              className={`${
                index === currentLine ? 'text-yellow-500 animate-pulse' : ''
              } ${
                line.includes('//') ? 'text-gray-500' : 
                line.includes('const') || line.includes('function') || line.includes('class') ? 'text-purple-500' :
                line.includes('interface') || line.includes('type') ? 'text-blue-500' :
                line.includes('await') || line.includes('async') ? 'text-orange-500' :
                'text-cyan-500'
              }`}
            >
              {line}
              {index === currentLine && (
                <span className="animate-blink text-cyan-400">|</span>
              )}
            </div>
          ))}
        </div>
        
        {/* Floating crypto symbols */}
        <div className="absolute top-4 right-4 space-y-2 text-right">
          <div className="animate-bounce delay-0 text-yellow-500">₿</div>
          <div className="animate-bounce delay-200 text-purple-500">Ξ</div>
          <div className="animate-bounce delay-400 text-green-500">◊</div>
          <div className="animate-bounce delay-600 text-blue-500">₳</div>
        </div>
        
        {/* Mathematical formulas */}
        <div className="absolute bottom-4 right-4 text-right text-gray-600 dark:text-gray-500 space-y-1">
          <div className="animate-pulse delay-100">Hash = SHA256(block + nonce)</div>
          <div className="animate-pulse delay-300">APY = (1 + r/n)ⁿ - 1</div>
          <div className="animate-pulse delay-500">Gas = gasPrice × gasLimit</div>
        </div>
      </pre>
      
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
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
    category: "Middleware & Integration",
    technologies: ["Apache Airflow", "Kafka", "RabbitMQ", "Apache NiFi", "CQRS", "Event-Driven Architecture"],
    icon: <Zap className="w-6 h-6" />,
    color: "text-yellow-400"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <HeroTypingAnimation />
          </motion.div>

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
      <section id="about" className="relative py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
        {/* Crypto Math Animation Background */}
        <CryptoMathAnimation />
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
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative py-20 px-4 md:px-8 bg-gray-50 dark:bg-slate-800/30">
        {/* Solidity Animation Background */}
        <SolidityMathAnimation />
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