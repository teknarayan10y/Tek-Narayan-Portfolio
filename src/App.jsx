import { useState, useEffect, useRef } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import AIShowcase from './components/AIShowcase'
import GitHubDashboard from './components/GitHubDashboard'
import Certifications from './components/Certifications'
import Achievements from './components/Achievements'
import Blog from './components/Blog'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import CommandPalette from './components/CommandPalette'
import ChatAssistant from './components/ChatAssistant'
import ParticleField from './components/ParticleField'
import LoadingScreen from './components/LoadingScreen'
import AIRecruiter from './components/AIRecruiter'
import ThemeSwitcher from './components/ThemeSwitcher'

function CursorEffects() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top = `${e.clientY}px`
      }
    }
    window.addEventListener('mousemove', onMove)

    let raf
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12
      ring.current.y += (pos.current.y - ring.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`
        ringRef.current.style.top = `${ring.current.y}px`
      }
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
    </>
  )
}

function ScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 z-[60]" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <div
        className="h-full transition-none"
        style={{
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #4361ee, #a855f7, #06b6d4)',
          boxShadow: '0 0 8px rgba(67,97,238,0.8)',
        }}
      />
    </div>
  )
}

function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!show) return null
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-[4.5rem] left-6 z-40 w-10 h-10 rounded-xl glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all hover:scale-110"
      style={{ border: '1px solid rgba(255,255,255,0.1)' }}
    >
      ↑
    </button>
  )
}

function SectionDivider({ color = '#4361ee' }) {
  return (
    <div className="flex items-center gap-4 max-w-6xl mx-auto px-6 opacity-20">
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color})` }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  )
}

function Footer() {
  return (
    <footer className="relative py-12 px-6 text-center border-t border-white/6">
      <div className="max-w-6xl mx-auto">
        {/* AI Recruiter CTA */}
        <div className="glass rounded-2xl p-6 mb-8 text-center">
          <p className="text-white/50 text-sm mb-3">Want to evaluate Tek Narayan's technical skills?</p>
          <AIRecruiter />
        </div>

        <div className="gradient-text text-2xl font-black mb-2">Tek Narayan Yadav</div>
        <p className="text-white/30 text-sm mb-1">Full Stack Developer · MERN Stack · AI Engineer</p>
        <p className="text-white/20 text-xs font-mono mb-4">teknarayan2456@gmail.com</p>

        <div className="flex flex-wrap justify-center gap-4 text-xs text-white/25 mb-6">
          {['Home', 'About', 'Skills', 'Projects', 'AI', 'GitHub', 'Blog', 'Contact'].map(s => (
            <button key={s}
              onClick={() => document.getElementById(s.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-white/50 transition-colors">
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-24" style={{ background: 'linear-gradient(90deg, transparent, rgba(67,97,238,0.4))' }} />
          <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
          <div className="h-px w-24" style={{ background: 'linear-gradient(90deg, rgba(67,97,238,0.4), transparent)' }} />
        </div>

        <p className="text-white/15 text-xs font-mono">
          Built with React · JavaScript · Tailwind CSS · ❤️ · 2027
        </p>
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Available for opportunities worldwide
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const [cmdOpen, setCmdOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen(o => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      <div
        className="relative min-h-screen"
        style={{
          background: '#050816',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        {/* Background layers */}
        <div className="aurora" />
        <div className="aurora-cyan" />
        <ParticleField />

        {/* UI chrome */}
        <ScrollProgress />
        <CursorEffects />
        <Nav onCmdOpen={() => setCmdOpen(true)} />
        <BackToTop />
        <ThemeSwitcher />

        {/* Main content */}
        <main className="relative z-10">
          <Hero />
          <SectionDivider color="#4361ee" />
          <About />
          <SectionDivider color="#06b6d4" />
          <Skills />
          <SectionDivider color="#a855f7" />
          <Projects />
          <SectionDivider color="#4361ee" />
          <Experience />
          <SectionDivider color="#a855f7" />
          <AIShowcase />
          <SectionDivider color="#06b6d4" />
          <GitHubDashboard />
          <SectionDivider color="#84ce24" />
          <Certifications />
          <SectionDivider color="#f59e0b" />
          <Achievements />
          <SectionDivider color="#ec4899" />
          <Blog />
          <SectionDivider color="#06b6d4" />
          <Testimonials />
          <SectionDivider color="#4361ee" />
          <Contact />
        </main>

        <Footer />

        {/* Overlays */}
        <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
        <ChatAssistant />
      </div>
    </>
  )
}
