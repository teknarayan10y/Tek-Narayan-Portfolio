import { useState, useEffect, useRef } from 'react'
import { Search, X, Hash, User, Code2, Briefcase, Mail, Brain, Clock, Lock } from 'lucide-react'

const commands = [
  { id: 'home', label: 'Go to Home', section: 'home', icon: Hash, desc: 'Hero section' },
  { id: 'about', label: 'Go to About', section: 'about', icon: User, desc: 'Learn about Tek Narayan' },
  { id: 'skills', label: 'Go to Skills', section: 'skills', icon: Code2, desc: 'Tech stack & expertise' },
  { id: 'projects', label: 'Go to Projects', section: 'projects', icon: Briefcase, desc: 'Featured work' },
  { id: 'experience', label: 'Go to Experience', section: 'experience', icon: Clock, desc: 'Career timeline' },
  { id: 'ai', label: 'Go to AI Showcase', section: 'ai', icon: Brain, desc: 'AI engineering projects' },
  { id: 'github', label: 'Go to GitHub Dashboard', section: 'github', icon: Code2, desc: 'Open source activity' },
  { id: 'certifications', label: 'Go to Certifications', section: 'certifications', icon: Hash, desc: 'Verified credentials' },
  { id: 'achievements', label: 'Go to Achievements', section: 'achievements', icon: Hash, desc: 'Coding milestones' },
  { id: 'blog', label: 'Go to Blog', section: 'blog', icon: Hash, desc: 'Technical writing' },
  { id: 'testimonials', label: 'Go to Testimonials', section: 'testimonials', icon: User, desc: 'What people say' },
  { id: 'contact', label: 'Contact Tek Narayan', section: 'contact', icon: Mail, desc: 'Get in touch' },
  { id: 'github-ext', label: 'Open GitHub Profile', section: null, icon: Code2, desc: 'github.com/teknarayanyadav', href: 'https://github.com/teknarayanyadav' },
  { id: 'resume', label: 'Download Resume', section: null, icon: User, desc: 'Get the PDF resume', href: '#' },
  { id: 'admin', label: 'Admin Passcode Login', section: null, icon: Lock, desc: 'Owner passcode login (passcode: admin123)', action: 'admin' },
]

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)

  const filtered = commands.filter(
    c =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.desc.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setSelected(0)
  }, [query])

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelected(s => Math.min(s + 1, filtered.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelected(s => Math.max(s - 1, 0))
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        if (filtered[selected]) execute(filtered[selected])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, selected, filtered])

  const execute = (cmd) => {
    if (cmd.action === 'admin') {
      window.dispatchEvent(new CustomEvent('open-admin-modal'))
    } else if (cmd.href) {
      window.open(cmd.href, '_blank')
    } else if (cmd.section) {
      document.getElementById(cmd.section)?.scrollIntoView({ behavior: 'smooth' })
    }
    onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 cmd-overlay"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div
        className="glass-strong rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl cmd-panel"
        style={{ border: '1px solid rgba(67,97,238,0.3)', boxShadow: '0 0 40px rgba(67,97,238,0.2)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
          <Search size={16} className="text-white/40 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none font-mono"
          />
          <button onClick={onClose} className="p-1 text-white/30 hover:text-white/60 transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Results */}
        <div className="py-2 max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-white/30 text-sm">No commands found</div>
          ) : (
            filtered.map((cmd, i) => {
              const Icon = cmd.icon
              return (
                <button
                  key={cmd.id}
                  onClick={() => execute(cmd)}
                  onMouseEnter={() => setSelected(i)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                  style={{
                    background: selected === i ? 'rgba(67,97,238,0.15)' : 'transparent',
                    borderLeft: selected === i ? '2px solid #4361ee' : '2px solid transparent',
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: selected === i ? 'rgba(67,97,238,0.2)' : 'rgba(255,255,255,0.04)' }}
                  >
                    <Icon size={14} className={selected === i ? 'text-blue-400' : 'text-white/40'} />
                  </div>
                  <div>
                    <div className="text-white/80 text-sm font-medium">{cmd.label}</div>
                    <div className="text-white/35 text-xs">{cmd.desc}</div>
                  </div>
                  {selected === i && (
                    <div className="ml-auto text-xs text-white/30 font-mono">↵</div>
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-white/6 flex items-center gap-4 text-xs text-white/25 font-mono">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  )
}
