import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Lock, Unlock, Trash2, Edit2, X, Calendar, Clock } from 'lucide-react'
import { fetchExperienceTimeline, createExperienceEntry, updateExperienceEntry, deleteExperienceEntryById } from '../api.js'
import { useAdminAuth } from '../useAdminAuth'

const initialTimeline = [
  {
    year: '2020',
    startDate: '2020',
    endDate: '2020',
    isCurrent: false,
    title: 'Started Programming',
    desc: 'Discovered the world of coding. First HTML page. Instant addiction.',
    color: '#4361ee',
    icon: '🚀',
  },
  {
    year: '2021',
    startDate: '2021',
    endDate: '2021',
    isCurrent: false,
    title: 'Frontend Fundamentals',
    desc: 'Mastered HTML, CSS, and JavaScript. Built first interactive websites. Fell in love with UI.',
    color: '#06b6d4',
    icon: '🎨',
  },
  {
    year: '2022',
    startDate: '2022',
    endDate: '2022',
    isCurrent: false,
    title: 'React & Modern JS',
    desc: 'Dove deep into React ecosystem, hooks, state management, and component architecture.',
    color: '#a855f7',
    icon: '⚛️',
  },
  {
    year: '2022 - 2023',
    startDate: '2022',
    endDate: '2023',
    isCurrent: false,
    title: 'MERN Stack Mastery',
    desc: 'Full-stack development with MongoDB, Express, React, and Node.js. First complete web apps shipped.',
    color: '#84ce24',
    icon: '🛠️',
  },
  {
    year: '2023',
    startDate: '2023',
    endDate: '2023',
    isCurrent: false,
    title: 'AI Integration',
    desc: 'OpenAI API, LangChain, RAG architectures. Building AI-powered applications became my focus.',
    color: '#f59e0b',
    icon: '🤖',
  },
  {
    year: '2023 - 2024',
    startDate: '2023',
    endDate: '2024',
    isCurrent: false,
    title: 'AI ERP Project',
    desc: 'Led development of enterprise ERP with natural language database queries and AI analytics.',
    color: '#ec4899',
    icon: '🏢',
  },
  {
    year: '2024 - Present',
    startDate: '2024',
    endDate: 'Present',
    isCurrent: true,
    title: 'Full Stack AI Engineer',
    desc: 'Combining deep frontend expertise with AI engineering to build next-gen applications.',
    color: '#4361ee',
    icon: '⚡',
  },
  {
    year: '2025+',
    startDate: '2025',
    endDate: 'Future',
    isCurrent: false,
    title: 'Future: AI-Native Products',
    desc: 'Building AI-native SaaS products from 0 to 1. Multi-agent systems. The future starts now.',
    color: '#06b6d4',
    icon: '🌟',
  },
]

export default function Experience() {
  const { isAdmin, login, logout } = useAdminAuth()
  const [list, setList] = useState(initialTimeline)
  const ref = useRef(null)

  // Admin state
  const [adminKey, setAdminKey] = useState('admin123')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCard, setEditingCard] = useState(null)
  const [passcodeAttempt, setPasscodeAttempt] = useState('')
  const [authError, setAuthError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [form, setForm] = useState({
    startDate: '2024',
    endDate: 'Present',
    isCurrent: true,
    year: '2024 - Present',
    title: '',
    desc: '',
    color: '#4361ee',
    icon: '🚀',
  })

  useEffect(() => {
    fetchExperienceTimeline(initialTimeline).then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setList(data)
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
    const success = login(passcodeAttempt)
    if (success) {
      setAdminKey(passcodeAttempt)
      setShowAuthModal(false)
      setAuthError('')
      setPasscodeAttempt('')
    } else {
      setAuthError('Incorrect passcode. Hint: admin123')
    }
  }

  const openEditModal = (item) => {
    setEditingCard(item)
    const isCurr = item.isCurrent || item.endDate === 'Present'
    setForm({
      startDate: item.startDate || item.year || '',
      endDate: isCurr ? 'Present' : (item.endDate || ''),
      isCurrent: isCurr,
      year: item.year || '',
      title: item.title || '',
      desc: item.desc || '',
      color: item.color || '#4361ee',
      icon: item.icon || '🚀',
    })
  }

  const handleSaveEntry = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.desc.trim()) return

    setIsSubmitting(true)

    // Compute formatted year tag from date range
    let formattedYear = form.year ? form.year.trim() : ''
    const start = form.startDate.trim()
    const end = form.isCurrent ? 'Present' : form.endDate.trim()

    if (start && end) {
      formattedYear = start === end ? start : `${start} - ${end}`
    } else if (start) {
      formattedYear = start
    } else if (end) {
      formattedYear = end
    }

    const payload = {
      year: formattedYear || '2024',
      startDate: start,
      endDate: end,
      isCurrent: Boolean(form.isCurrent),
      title: form.title.trim(),
      desc: form.desc.trim(),
      color: form.color || '#4361ee',
      icon: form.icon || '🚀',
    }

    if (editingCard && editingCard._id) {
      const res = await updateExperienceEntry(editingCard._id, payload, adminKey || 'admin123')
      setIsSubmitting(false)
      if (res.success && res.entry) {
        setList(prev => prev.map(item => (item._id === editingCard._id ? res.entry : item)))
      } else {
        setList(prev => prev.map(item => (item._id === editingCard._id ? { ...payload, _id: editingCard._id } : item)))
      }
    } else if (editingCard) {
      setList(prev => prev.map(item => (item.title === editingCard.title ? { ...payload } : item)))
      setIsSubmitting(false)
    } else {
      const res = await createExperienceEntry(payload, adminKey || 'admin123')
      setIsSubmitting(false)
      if (res.success && res.entry) {
        setList(prev => [...prev, res.entry])
      } else {
        setList(prev => [...prev, { ...payload, _id: Date.now().toString() }])
      }
    }

    setShowAddModal(false)
    setEditingCard(null)
    setForm({
      startDate: '2024',
      endDate: 'Present',
      isCurrent: true,
      year: '2024 - Present',
      title: '',
      desc: '',
      color: '#4361ee',
      icon: '🚀',
    })
  }

  const handleDeleteEntry = async (item) => {
    if (!window.confirm(`Delete timeline entry "${item.title}"?`)) return
    if (item._id) {
      await deleteExperienceEntryById(item._id, adminKey || 'admin123')
    }
    setList(prev => prev.filter(i => (i._id ? i._id !== item._id : i.title !== item.title)))
  }

  return (
    <section id="experience" className="relative py-24 px-6">
      <div ref={ref} className="section-hidden max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-amber-400"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
              JOURNEY TIMELINE ({list.length})
            </span>
            {isAdmin && (
              <button
                onClick={logout}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono text-emerald-400 glass cursor-pointer hover:bg-emerald-500/20 transition-all"
                title="Admin Unlocked — Click to Lock"
              >
                <Unlock size={12} /> Admin Active
              </button>
            )}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            My <span className="gradient-text">Timeline</span>
          </h2>
          <p className="text-white/50 max-w-lg mx-auto mb-6 text-sm">
            From curious beginner to AI-powered full stack engineer.
          </p>

          {/* Action Header bar: Add Entry (Admin Only) */}
          {isAdmin && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setEditingCard(null)
                  setForm({
                    startDate: new Date().getFullYear().toString(),
                    endDate: 'Present',
                    isCurrent: true,
                    year: `${new Date().getFullYear().toString()} - Present`,
                    title: '',
                    desc: '',
                    color: '#4361ee',
                    icon: '🚀',
                  })
                  setShowAddModal(true)
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 cursor-pointer shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #4361ee)',
                  boxShadow: '0 0 20px rgba(245,158,11,0.3)',
                }}
              >
                <Plus size={16} /> + Add Timeline Entry
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px hidden md:block"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(67,97,238,0.4), rgba(168,85,247,0.4), transparent)' }}
          />

          <div className="space-y-8">
            {list.map((item, i) => (
              <TimelineItem
                key={item._id || `${item.year}-${i}`}
                item={item}
                index={i}
                isAdmin={isAdmin}
                onEdit={openEditModal}
                onDelete={handleDeleteEntry}
              />
            ))}
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
              <Lock size={22} className="text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Portfolio Owner Auth</h3>
            <p className="text-white/45 text-xs mb-5">Enter passcode to edit your timeline (Hint: admin123)</p>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Enter admin passcode..."
                value={passcodeAttempt}
                onChange={e => setPasscodeAttempt(e.target.value)}
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(245,158,11,0.3)' }}
              />
              {authError && <p className="text-red-400 text-xs">{authError}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowAuthModal(false)}
                  className="flex-1 py-2.5 rounded-xl glass text-white/50 text-sm cursor-pointer">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl font-semibold text-white text-sm cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #4361ee)' }}>
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Add or Edit Timeline Entry Modal (Admin Only) */}
      {(showAddModal || editingCard) && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => {
            setShowAddModal(false)
            setEditingCard(null)
          }}>
          <div className="glass-strong rounded-3xl max-w-md w-full p-7 cmd-panel max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-blue-600 flex items-center justify-center">
                  {editingCard ? <Edit2 size={16} className="text-white" /> : <Plus size={16} className="text-white" />}
                </div>
                <h3 className="text-white font-bold text-lg">{editingCard ? `Edit ${editingCard.title}` : 'Add Timeline Entry'}</h3>
              </div>
              <button onClick={() => {
                setShowAddModal(false)
                setEditingCard(null)
              }} className="p-1.5 glass rounded-xl text-white/50 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4">
              {/* Date Range Section */}
              <div className="p-4 rounded-2xl border border-white/10" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-amber-400 text-xs font-mono font-bold flex items-center gap-1.5">
                    <Calendar size={13} /> DATE RANGE (FROM - TO) *
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-white/70 hover:text-white">
                    <input
                      type="checkbox"
                      checked={form.isCurrent}
                      onChange={e => {
                        const checked = e.target.checked
                        setForm(f => ({
                          ...f,
                          isCurrent: checked,
                          endDate: checked ? 'Present' : (f.endDate === 'Present' ? '' : f.endDate)
                        }))
                      }}
                      className="rounded accent-amber-500"
                    />
                    <span>Present (Ongoing)</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/40 text-[11px] font-mono block mb-1">START DATE (FROM)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jan 2022 or 2022"
                      value={form.startDate}
                      onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl text-white placeholder-white/20 text-xs outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-[11px] font-mono block mb-1">END DATE (TO)</label>
                    <input
                      type="text"
                      disabled={form.isCurrent}
                      placeholder={form.isCurrent ? 'Present' : 'e.g. Dec 2023 or 2024'}
                      value={form.isCurrent ? 'Present' : form.endDate}
                      onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl text-white placeholder-white/20 text-xs outline-none disabled:opacity-60"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>
                </div>

                {/* Display tag preview */}
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-white/40 font-mono text-[11px]">Badge Preview:</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded flex items-center gap-1"
                    style={{ background: `${form.color || '#4361ee'}20`, color: form.color || '#4361ee' }}>
                    <Calendar size={11} />
                    {form.startDate ? (form.isCurrent ? `${form.startDate} - Present` : (form.endDate ? `${form.startDate} - ${form.endDate}` : form.startDate)) : (form.year || '2024')}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">EMOJI ICON</label>
                <input
                  type="text"
                  placeholder="🚀"
                  value={form.icon}
                  onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none text-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">MILESTONE TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Stack AI Engineer"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">DESCRIPTION *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Summary of achievements and technologies learned..."
                  value={form.desc}
                  onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">ACCENT COLOR (HEX)</label>
                <input
                  type="text"
                  placeholder="#4361ee"
                  value={form.color}
                  onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => {
                  setShowAddModal(false)
                  setEditingCard(null)
                }}
                  className="flex-1 py-3 rounded-xl glass text-white/50 font-semibold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl font-semibold text-white cursor-pointer transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #4361ee)' }}>
                  {isSubmitting ? 'Saving to MongoDB...' : (editingCard ? 'Update Entry' : 'Save Entry')}
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

function TimelineItem({ item, index, isAdmin, onEdit, onDelete }) {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        ref.current?.classList.add('section-visible')
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const isLeft = index % 2 === 0

  // Format date range text
  const renderDateTag = () => {
    if (item.startDate && item.endDate) {
      if (item.startDate === item.endDate) return item.startDate
      return `${item.startDate} - ${item.endDate}`
    }
    if (item.startDate) return `${item.startDate}${item.isCurrent ? ' - Present' : ''}`
    return item.year || '2024'
  }

  return (
    <div
      ref={ref}
      className={`section-hidden flex items-center gap-4 md:gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Content */}
      <div className={`flex-1 md:px-8 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
        <div className={`glass rounded-2xl p-5 hover:bg-white/6 transition-all group relative ${isLeft ? 'md:ml-auto' : 'md:mr-auto'}`}
          style={{ maxWidth: '360px' }}>
          
          <div className={`flex items-center justify-between gap-2 mb-2 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{item.icon}</span>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded flex items-center gap-1 font-medium" style={{ background: `${item.color || '#4361ee'}20`, color: item.color || '#4361ee' }}>
                <Calendar size={11} />
                {renderDateTag()}
              </span>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(item)}
                  className="p-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-colors cursor-pointer"
                  title="Edit Entry"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="p-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors cursor-pointer"
                  title="Delete Entry"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>

          <h3 className="text-white font-bold mb-1">{item.title}</h3>
          <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
        </div>
      </div>

      {/* Center dot */}
      <div className="relative flex-shrink-0 hidden md:flex items-center justify-center">
        <div
          className="w-4 h-4 rounded-full z-10 relative"
          style={{
            background: item.color || '#4361ee',
            boxShadow: `0 0 12px ${item.color || '#4361ee'}80, 0 0 24px ${item.color || '#4361ee'}30`,
          }}
        >
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-40"
            style={{ background: item.color || '#4361ee', animationDuration: '2s', animationDelay: `${index * 200}ms` }}
          />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1 hidden md:block" />
    </div>
  )
}

