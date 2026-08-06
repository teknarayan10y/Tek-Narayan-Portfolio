import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Send, Mail, Code2, CheckCircle, Globe, Link, Edit2, Lock, Unlock, X } from 'lucide-react'
import { sendContactMessage, fetchContactInfo, updateContactInfo } from '../api.js'
import { useAdminAuth } from '../useAdminAuth'

const initialSocials = [
  { icon: Code2, label: 'GitHub', href: 'https://github.com/teknarayanyadav', color: '#ffffff' },
  { icon: Link, label: 'LinkedIn', href: 'https://linkedin.com/in/teknarayan', color: '#0077b5' },
  { icon: Mail, label: 'Email', href: 'mailto:teknarayan2456@gmail.com', color: '#ea4335' },
  { icon: Code2, label: 'LeetCode', href: 'https://leetcode.com', color: '#f89f1b' },
  { icon: Globe, label: 'Portfolio', href: '#', color: '#06b6d4' },
]

function RotatingEarth() {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setFrame(f => f + 1), 60)
    return () => clearInterval(id)
  }, [])

  const t = frame * 0.02
  const dots = Array.from({ length: 24 }, (_, i) => {
    const lat = (i / 24) * Math.PI - Math.PI / 2
    return Array.from({ length: 12 }, (_, j) => {
      const lon = (j / 12) * Math.PI * 2 + t
      const x = Math.cos(lat) * Math.cos(lon)
      const y = Math.sin(lat)
      const z = Math.cos(lat) * Math.sin(lon)
      if (z < -0.1) return null
      const px = 60 + x * 54
      const py = 60 - y * 54
      const scale = (z + 1) / 2
      return { px, py, scale, key: `${i}-${j}` }
    }).filter(Boolean)
  }).flat()

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg width={120} height={120} className="overflow-visible">
        <circle cx={60} cy={60} r={54} fill="none"
          stroke="rgba(67,97,238,0.3)" strokeWidth={1} />
        <ellipse cx={60} cy={60} rx={54} ry={12}
          fill="none" stroke="rgba(67,97,238,0.15)" strokeWidth={0.5} />
        {dots.map(d => d && (
          <circle key={d.key} cx={d.px} cy={d.py} r={1.5 * d.scale + 0.5}
            fill="#4361ee" opacity={0.3 + d.scale * 0.7} />
        ))}
        <circle cx={60} cy={60} r={54} fill="url(#earthGlow)" />
        <defs>
          <radialGradient id="earthGlow" cx="35%" cy="35%">
            <stop offset="0%" stopColor="rgba(6,182,212,0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}

export default function Contact() {
  const { isAdmin } = useAdminAuth()
  const [contactInfo, setContactInfo] = useState({
    name: 'Tek Narayan Yadav',
    role: 'Full Stack & AI Engineer · India',
    bio: 'Available for freelance projects, full-time roles, and collaborations. I respond within 24 hours.',
    socials: initialSocials,
  })

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [formError, setFormError] = useState('')

  // Admin state
  const [adminKey, setAdminKey] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [passcodeAttempt, setPasscodeAttempt] = useState('')
  const [authError, setAuthError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const ref = useRef(null)

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: 'Tek Narayan Yadav',
    role: 'Full Stack & AI Engineer · India',
    bio: 'Available for freelance projects, full-time roles, and collaborations. I respond within 24 hours.',
    github: 'https://github.com/teknarayanyadav',
    linkedin: 'https://linkedin.com/in/teknarayan',
    email: 'mailto:teknarayan2456@gmail.com',
    leetcode: 'https://leetcode.com',
  })

  useEffect(() => {
    fetchContactInfo(contactInfo).then(data => {
      if (data && data.name) {
        setContactInfo(prev => ({
          name: data.name || prev.name,
          role: data.role || prev.role,
          bio: data.bio || prev.bio,
          socials: (data.socials && data.socials.length > 0) ? data.socials.map(s => ({
            ...s,
            icon: s.label === 'LinkedIn' ? Link : (s.label === 'Email' ? Mail : (s.label === 'Portfolio' ? Globe : Code2))
          })) : prev.socials,
        }))
      }
    })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) ref.current?.classList.add('section-visible')
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const handleAuthSubmit = (e) => {
    e.preventDefault()
    if (passcodeAttempt === 'admin123' || passcodeAttempt.trim().length > 0) {
      setIsAdmin(true)
      setAdminKey(passcodeAttempt)
      setShowAuthModal(false)
      setEditForm({
        name: contactInfo.name,
        role: contactInfo.role,
        bio: contactInfo.bio,
        github: (contactInfo.socials.find(s => s.label === 'GitHub') || {}).href || 'https://github.com/teknarayanyadav',
        linkedin: (contactInfo.socials.find(s => s.label === 'LinkedIn') || {}).href || 'https://linkedin.com',
        email: (contactInfo.socials.find(s => s.label === 'Email') || {}).href || 'mailto:teknarayan2456@gmail.com',
        leetcode: (contactInfo.socials.find(s => s.label === 'LeetCode') || {}).href || 'https://leetcode.com',
      })
      setShowEditModal(true)
      setAuthError('')
      setPasscodeAttempt('')
    } else {
      setAuthError('Incorrect passcode. Hint: admin123')
    }
  }

  const handleSaveContactInfo = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const updatedSocials = [
      { label: 'GitHub', href: editForm.github, color: '#ffffff', icon: Code2 },
      { label: 'LinkedIn', href: editForm.linkedin, color: '#0077b5', icon: Link },
      { label: 'Email', href: editForm.email.startsWith('mailto:') ? editForm.email : `mailto:${editForm.email}`, color: '#ea4335', icon: Mail },
      { label: 'LeetCode', href: editForm.leetcode, color: '#f89f1b', icon: Code2 },
      { label: 'Portfolio', href: '#', color: '#06b6d4', icon: Globe },
    ]

    const payload = {
      name: editForm.name,
      role: editForm.role,
      bio: editForm.bio,
      socials: updatedSocials.map(({ label, href, color }) => ({ label, href, color })),
    }

    const res = await updateContactInfo(payload, adminKey || 'admin123')
    setIsSubmitting(false)

    setContactInfo({
      name: editForm.name,
      role: editForm.role,
      bio: editForm.bio,
      socials: updatedSocials,
    })
    setShowEditModal(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setFormError('')
    const res = await sendContactMessage(form)
    setSending(false)
    if (res && res.success) {
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSent(false), 5000)
    } else {
      setFormError(res?.error || 'Failed to send message. Please ensure the backend server is running.')
    }
  }

  return (
    <section id="contact" className="relative py-24 px-6">
      <div ref={ref} className="section-hidden max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-cyan-400 mb-4"
            style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
            CONTACT
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Let's <span className="gradient-text">Build Together</span>
          </h2>
          <p className="text-white/50 max-w-lg mx-auto mb-6">
            Have a project in mind? Want to hire me? Or just want to say hi? I'm always open.
          </p>

          {/* Action Header bar: Edit Contact Details */}
          {isAdmin && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setEditForm({
                    name: contactInfo.name,
                    role: contactInfo.role,
                    bio: contactInfo.bio,
                    github: (contactInfo.socials.find(s => s.label === 'GitHub') || {}).href || 'https://github.com/teknarayanyadav',
                    linkedin: (contactInfo.socials.find(s => s.label === 'LinkedIn') || {}).href || 'https://linkedin.com',
                    email: (contactInfo.socials.find(s => s.label === 'Email') || {}).href || 'mailto:teknarayan2456@gmail.com',
                    leetcode: (contactInfo.socials.find(s => s.label === 'LeetCode') || {}).href || 'https://leetcode.com',
                  })
                  setShowEditModal(true)
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105 cursor-pointer shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #4361ee, #7c3aed)',
                  boxShadow: '0 0 20px rgba(67,97,238,0.4)',
                }}
              >
                <Edit2 size={15} /> Edit Contact & Socials
              </button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left: info */}
          <div className="space-y-6">
            <RotatingEarth />

            <div className="glass rounded-2xl p-5 relative">
              <h3 className="text-white font-bold mb-1">{contactInfo.name}</h3>
              <p className="text-white/50 text-sm mb-4">{contactInfo.role}</p>
              <p className="text-white/60 text-sm leading-relaxed">
                {contactInfo.bio}
              </p>
            </div>

            <div className="glass rounded-2xl p-5">
              <h4 className="text-white/40 text-xs font-mono tracking-widest mb-3">FIND ME ON</h4>
              <div className="flex flex-wrap gap-2">
                {contactInfo.socials.map(({ icon: Icon = Code2, label, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl glass hover:bg-white/8 transition-all hover:scale-105 text-sm text-white/70 hover:text-white"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <Icon size={14} style={{ color }} />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="glass rounded-3xl p-7">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-10">
                <CheckCircle size={48} className="text-green-400" />
                <h3 className="text-white text-xl font-bold">Message Sent!</h3>
                <p className="text-white/50">Thanks for reaching out. I'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-white font-bold text-lg mb-5">Send a Message</h3>

                {[
                  { key: 'name', label: 'Your Name', type: 'text', placeholder: 'Elon Musk' },
                  { key: 'email', label: 'Email Address', type: 'email', placeholder: 'elon@x.com' },
                  { key: 'subject', label: 'Subject', type: 'text', placeholder: "Let's build something amazing" },
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-white/50 text-xs font-mono tracking-wide block mb-1.5">
                      {field.label.toUpperCase()}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/25 text-sm outline-none focus:ring-1 transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                      onFocus={e => (e.target.style.borderColor = 'rgba(67,97,238,0.5)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    />
                  </div>
                ))}

                <div>
                  <label className="text-white/50 text-xs font-mono tracking-wide block mb-1.5">MESSAGE</label>
                  <textarea
                    placeholder="Tell me about your project..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    required
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/25 text-sm outline-none resize-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(67,97,238,0.5)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>

                {formError && (
                  <p className="text-red-400 text-xs px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-center font-mono">
                    ⚠️ {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #4361ee, #7c3aed)',
                    boxShadow: '0 0 20px rgba(67,97,238,0.4)',
                  }}
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Admin Passcode Modal */}
      {showAuthModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
          onClick={() => setShowAuthModal(false)}>
          <div className="glass-strong rounded-3xl max-w-sm w-full p-6 cmd-panel text-center"
            onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Lock size={22} className="text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Portfolio Owner Auth</h3>
            <p className="text-white/45 text-xs mb-5">Enter passcode to edit contact details & social links (Hint: admin123)</p>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Enter admin passcode..."
                value={passcodeAttempt}
                onChange={e => setPasscodeAttempt(e.target.value)}
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(67,97,238,0.3)' }}
              />
              {authError && <p className="text-red-400 text-xs">{authError}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowAuthModal(false)}
                  className="flex-1 py-2.5 rounded-xl glass text-white/50 text-sm cursor-pointer">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl font-semibold text-white text-sm cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #4361ee, #7c3aed)' }}>
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Contact Details Modal */}
      {showEditModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setShowEditModal(false)}>
          <div className="glass-strong rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-7 cmd-panel"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Edit2 size={16} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">Edit Contact & Social Links</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 glass rounded-xl text-white/50 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveContactInfo} className="space-y-4">
              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">OWNER NAME *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">ROLE & LOCATION *</label>
                <input
                  type="text"
                  required
                  value={editForm.role}
                  onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">BIO / AVAILABILITY STATEMENT</label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div className="border-t border-white/10 pt-4 mt-4">
                <h4 className="text-cyan-400 text-xs font-mono tracking-widest mb-3">FIND ME ON (SOCIAL LINKS)</h4>

                <div className="space-y-3">
                  <div>
                    <label className="text-white/40 text-xs font-mono block mb-1">GITHUB URL</label>
                    <input
                      type="text"
                      value={editForm.github}
                      onChange={e => setEditForm(f => ({ ...f, github: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>

                  <div>
                    <label className="text-white/40 text-xs font-mono block mb-1">LINKEDIN URL</label>
                    <input
                      type="text"
                      value={editForm.linkedin}
                      onChange={e => setEditForm(f => ({ ...f, linkedin: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>

                  <div>
                    <label className="text-white/40 text-xs font-mono block mb-1">EMAIL MAILTO LINK</label>
                    <input
                      type="text"
                      value={editForm.email}
                      onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>

                  <div>
                    <label className="text-white/40 text-xs font-mono block mb-1">LEETCODE URL</label>
                    <input
                      type="text"
                      value={editForm.leetcode}
                      onChange={e => setEditForm(f => ({ ...f, leetcode: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 rounded-xl glass text-white/50 font-semibold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl font-semibold text-white cursor-pointer transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #4361ee, #7c3aed)' }}>
                  {isSubmitting ? 'Saving to MongoDB...' : 'Save & Update Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}
