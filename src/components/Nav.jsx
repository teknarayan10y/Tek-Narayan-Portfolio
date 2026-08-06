import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Menu, X, Terminal, Lock, Unlock, LogOut, CheckCircle } from 'lucide-react'
import { useAdminAuth } from '../useAdminAuth'

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'ai', label: 'AI' },
  { id: 'github', label: 'GitHub' },
  { id: 'certifications', label: 'Certs' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav({ onCmdOpen }) {
  const { isAdmin, login, logout } = useAdminAuth()
  const [active, setActive] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [passcodeAttempt, setPasscodeAttempt] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginSuccess, setLoginSuccess] = useState(false)
  const logoClickRef = useRef({ count: 0, timer: null })

  // Secret keyboard shortcut (Ctrl + Shift + A) to open Admin Auth modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault()
        if (!isAdmin) {
          setShowLoginModal(true)
        } else {
          logout()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAdmin, logout])

  const handleLogoClick = () => {
    scrollTo('home')
    logoClickRef.current.count += 1
    if (logoClickRef.current.timer) clearTimeout(logoClickRef.current.timer)
    if (logoClickRef.current.count >= 3) {
      logoClickRef.current.count = 0
      if (!isAdmin) setShowLoginModal(true)
    } else {
      logoClickRef.current.timer = setTimeout(() => {
        logoClickRef.current.count = 0
      }, 600)
    }
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const secEls = sections.map(s => document.getElementById(s.id))
      for (let i = secEls.length - 1; i >= 0; i--) {
        const el = secEls[i]
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(sections[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    if (passcodeAttempt === 'admin123' || passcodeAttempt.trim().length > 0) {
      const ok = login(passcodeAttempt)
      if (ok) {
        setLoginSuccess(true)
        setLoginError('')
        setTimeout(() => {
          setLoginSuccess(false)
          setShowLoginModal(false)
          setPasscodeAttempt('')
        }, 1200)
      } else {
        setLoginError('Invalid passcode. Hint: admin123')
      }
    } else {
      setLoginError('Please enter admin passcode.')
    }
  }

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-2xl px-6 py-3 flex items-center gap-2 ${scrolled ? 'glass-strong shadow-xl shadow-black/40' : 'glass'
          }`}
        style={{ maxWidth: '1280px', width: 'calc(100vw - 32px)' }}
      >
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 mr-3 group cursor-pointer"
          title="Tek Narayan Yadav"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg group-hover:scale-110 transition-transform">
            T
          </div>
          <span className="font-bold text-white hidden sm:block text-sm">Tek Narayan</span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`relative px-3 py-1.5 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${active === s.id
                ? 'text-white'
                : 'text-white/50 hover:text-white/80'
                }`}
            >
              {active === s.id && (
                <span
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(67,97,238,0.3), rgba(168,85,247,0.2))',
                    border: '1px solid rgba(67,97,238,0.3)',
                  }}
                />
              )}
              <span className="relative">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Cmd palette hint */}
          <button
            onClick={onCmdOpen}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/60 border border-white/8 hover:border-white/15 transition-all cursor-pointer"
          >
            <Terminal size={11} />
            <span>⌘K</span>
          </button>

          {/* Admin Login / Logout Button */}
          {isAdmin ? (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300"
              title="Click to Logout from Admin Mode"
            >
              <Unlock size={12} />
              <span className="hidden sm:inline"></span>
              <LogOut size={12} className="ml-0.5 opacity-70" />
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer glass border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/50 shadow-sm"
              title="Click to Login as Admin"
            >
              <Lock size={12} />
              <span className="hidden sm:inline"></span>
            </button>
          )}

          {/* Hire me button */}
          <button
            onClick={() => scrollTo('contact')}
            className="hidden sm:block px-4 py-1.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #4361ee, #7c3aed)',
              boxShadow: '0 0 16px rgba(67,97,238,0.4)',
            }}
          >
            Hire Me
          </button>

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-white/60 hover:text-white cursor-pointer"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-24 px-6 glass-strong"
          style={{ backdropFilter: 'blur(24px)' }}
        >
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="py-4 text-left text-lg font-medium text-white/80 hover:text-white border-b border-white/8 last:border-0 transition-colors"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {s.label}
            </button>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            {isAdmin ? (
              <button
                onClick={() => { logout(); setMenuOpen(false) }}
                className="py-3 rounded-xl font-semibold text-white bg-red-500/20 border border-red-500/40 text-red-300"
              >
                Logout Admin Mode
              </button>
            ) : (
              <button
                onClick={() => { setShowLoginModal(true); setMenuOpen(false) }}
                className="py-3 rounded-xl font-semibold text-white bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
              >
                Admin Login
              </button>
            )}
            <button
              onClick={() => { scrollTo('contact'); setMenuOpen(false) }}
              className="py-3 rounded-xl font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #4361ee, #7c3aed)' }}
            >
              Hire Me
            </button>
          </div>
        </div>
      )}

      {/* Central Admin Login Modal */}
      {showLoginModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setShowLoginModal(false)}>
          <div className="glass-strong rounded-3xl max-w-sm w-full p-7 cmd-panel text-center"
            onClick={e => e.stopPropagation()}>
            {loginSuccess ? (
              <div className="py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto border border-green-500/30">
                  <CheckCircle size={26} />
                </div>
                <h4 className="text-white font-bold text-lg">Logged In as Admin!</h4>
                <p className="text-white/50 text-xs">All portfolio management options (Add, Edit ✏️, Delete 🗑️) are now unlocked.</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg"
                  style={{ boxShadow: '0 0 24px rgba(6,182,212,0.4)' }}>
                  <Lock size={22} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-xl mb-1">Portfolio Admin Login</h3>
                <p className="text-white/50 text-xs mb-6">Enter admin passcode to unlock Add, Edit, and Delete options across your portfolio.</p>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <input
                      type="password"
                      placeholder="Enter admin passcode (admin123)..."
                      value={passcodeAttempt}
                      onChange={e => setPasscodeAttempt(e.target.value)}
                      autoFocus
                      className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 text-sm outline-none text-center"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(6,182,212,0.3)' }}
                    />
                    {loginError && <p className="text-red-400 text-xs mt-2">{loginError}</p>}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setShowLoginModal(false)}
                      className="flex-1 py-3 rounded-xl glass text-white/50 text-sm font-semibold cursor-pointer">
                      Cancel
                    </button>
                    <button type="submit"
                      className="flex-1 py-3 rounded-xl font-semibold text-white text-sm cursor-pointer transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #06b6d4, #4361ee)' }}>
                      Log In
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
