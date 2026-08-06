import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MapPin, GraduationCap, Code2, Sparkles, Plus, Lock, Unlock, Trash2, Edit2, X } from 'lucide-react'
import { fetchProjects, fetchAboutInfo, updateAboutInfo } from '../api.js'
import { useAdminAuth } from '../useAdminAuth'

const iconMap = {
  GraduationCap,
  Code2,
  Sparkles,
}

const initialCards = [
  {
    iconName: 'GraduationCap',
    color: '#4361ee',
    title: 'Education',
    desc: 'Bachelor of Technology in Computer Science. Passionate about algorithms, data structures, and AI fundamentals.',
  },
  {
    iconName: 'Code2',
    color: '#06b6d4',
    title: 'What I Build',
    desc: 'Full-stack web apps with React & Node.js, AI integrations with OpenAI & LangChain, scalable APIs, and real-time systems.',
  },
  {
    iconName: 'Sparkles',
    color: '#a855f7',
    title: 'Currently Exploring',
    desc: 'Multi-agent AI systems, vector databases, RAG architectures, and building AI-native products from scratch.',
  },
]

function AnimCounter({ target, suffix }) {
  const [count, setCount] = useState(target)

  useEffect(() => {
    setCount(target)
  }, [target])

  return <span>{count}{suffix}</span>
}

export default function About() {
  const { isAdmin } = useAdminAuth()
  const ref = useRef(null)
  const [projectCount, setProjectCount] = useState(6)

  // Journey state
  const [aboutData, setAboutData] = useState({
    name: 'Tek Narayan Yadav',
    role: 'Full Stack & AI Engineer',
    location: 'India',
    bio: [
      "I'm a passionate Full Stack Developer and AI Engineer with expertise in the MERN stack. I love crafting scalable web applications that combine beautiful design with powerful technology.",
      "My journey started with curiosity about how websites work, evolving into a deep passion for building AI-powered applications that solve real-world problems. I believe great software is both technically excellent and delightful to use."
    ],
    tags: ['MERN Stack', 'AI/ML', 'OpenAI', 'LangChain', 'TypeScript', 'RAG', 'Docker'],
    cards: initialCards,
  })

  // Admin state
  const [adminKey, setAdminKey] = useState('admin123')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showBioModal, setShowBioModal] = useState(false)
  const [showCardModal, setShowCardModal] = useState(false)
  const [showTagModal, setShowTagModal] = useState(false)
  const [newTagInput, setNewTagInput] = useState('')
  const [editingCard, setEditingCard] = useState(null)
  const [passcodeAttempt, setPasscodeAttempt] = useState('')
  const [authError, setAuthError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Bio Form
  const [bioForm, setBioForm] = useState({
    name: '',
    role: '',
    location: '',
    bio1: '',
    bio2: '',
    tagsInput: '',
  })

  // Journey Card Form
  const [cardForm, setCardForm] = useState({
    title: '',
    desc: '',
    color: '#4361ee',
    iconName: 'GraduationCap',
  })

  useEffect(() => {
    fetchAboutInfo(aboutData).then(data => {
      if (data && data.name) {
        setAboutData(prev => ({
          name: data.name || prev.name,
          role: data.role || prev.role,
          location: data.location || prev.location,
          bio: (data.bio && data.bio.length > 0) ? data.bio : prev.bio,
          tags: (data.tags && data.tags.length > 0) ? data.tags : prev.tags,
          cards: (data.cards && data.cards.length > 0) ? data.cards : prev.cards,
        }))
      }
    })
  }, [])

  useEffect(() => {
    const loadCount = () => {
      fetchProjects([]).then(projects => {
        if (Array.isArray(projects) && projects.length > 0) {
          setProjectCount(projects.length)
        }
      })
    }
    loadCount()
    window.addEventListener('portfolio-updated', loadCount)
    return () => window.removeEventListener('portfolio-updated', loadCount)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        ref.current?.classList.add('section-visible')
      }
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
      setAuthError('')
      setPasscodeAttempt('')
    } else {
      setAuthError('Incorrect passcode. Hint: admin123')
    }
  }

  const openBioModal = () => {
    setBioForm({
      name: aboutData.name,
      role: aboutData.role,
      location: aboutData.location,
      bio1: aboutData.bio[0] || '',
      bio2: aboutData.bio[1] || '',
      tagsInput: aboutData.tags.join(', '),
    })
    setShowBioModal(true)
  }

  const handleSaveBio = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const updatedTags = bioForm.tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    const payload = {
      ...aboutData,
      name: bioForm.name.trim(),
      role: bioForm.role.trim(),
      location: bioForm.location.trim(),
      bio: [bioForm.bio1.trim(), bioForm.bio2.trim()].filter(Boolean),
      tags: updatedTags,
    }

    const res = await updateAboutInfo(payload, adminKey || 'admin123')
    setIsSubmitting(false)

    setAboutData(payload)
    setShowBioModal(false)
  }

  const handleAddTag = async (e) => {
    e.preventDefault()
    if (!newTagInput.trim()) return
    const tagToAdd = newTagInput.trim()
    if (aboutData.tags.includes(tagToAdd)) return

    const updatedTags = [...aboutData.tags, tagToAdd]
    const payload = {
      ...aboutData,
      tags: updatedTags,
    }

    setIsSubmitting(true)
    await updateAboutInfo(payload, adminKey || 'admin123')
    setIsSubmitting(false)

    setAboutData(payload)
    setNewTagInput('')
    setShowTagModal(false)
  }

  const handleDeleteTag = async (tagToDelete) => {
    const updatedTags = aboutData.tags.filter(t => t !== tagToDelete)
    const payload = {
      ...aboutData,
      tags: updatedTags,
    }

    await updateAboutInfo(payload, adminKey || 'admin123')
    setAboutData(payload)
  }

  const openAddCardModal = () => {
    setEditingCard(null)
    setCardForm({ title: '', desc: '', color: '#4361ee', iconName: 'GraduationCap' })
    setShowCardModal(true)
  }

  const openEditCardModal = (card) => {
    setEditingCard(card)
    setCardForm({
      title: card.title,
      desc: card.desc,
      color: card.color || '#4361ee',
      iconName: card.iconName || 'GraduationCap',
    })
    setShowCardModal(true)
  }

  const handleSaveCard = async (e) => {
    e.preventDefault()
    if (!cardForm.title.trim() || !cardForm.desc.trim()) return

    setIsSubmitting(true)
    let updatedCards = []
    if (editingCard) {
      updatedCards = aboutData.cards.map(c => (c.title === editingCard.title ? { ...cardForm } : c))
    } else {
      updatedCards = [...aboutData.cards, { ...cardForm }]
    }

    const payload = {
      ...aboutData,
      cards: updatedCards,
    }

    const res = await updateAboutInfo(payload, adminKey || 'admin123')
    setIsSubmitting(false)

    setAboutData(payload)
    setShowCardModal(false)
    setEditingCard(null)
  }

  const handleDeleteCard = async (cardTitle) => {
    if (!window.confirm(`Delete journey card "${cardTitle}"?`)) return
    const updatedCards = aboutData.cards.filter(c => c.title !== cardTitle)
    const payload = {
      ...aboutData,
      cards: updatedCards,
    }

    await updateAboutInfo(payload, adminKey || 'admin123')
    setAboutData(payload)
  }

  const stats = [
    { label: 'Projects Completed', value: projectCount, suffix: '+' },
    { label: 'Technologies', value: 30, suffix: '+' },
    { label: 'GitHub Contributions', value: 500, suffix: '+' },
    { label: 'Coding Hours', value: 2000, suffix: '+' },
  ]

  return (
    <section id="about" className="relative py-24 px-6">
      <div ref={ref} className="section-hidden max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-cyan-400 mb-4"
            style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
            ABOUT ME
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            My <span className="gradient-text">Journey</span>
          </h2>

          {/* Action Header bar: Edit Journey & Admin Mode */}
          {isAdmin && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
              <button
                onClick={openBioModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 cursor-pointer shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #4361ee)',
                  boxShadow: '0 0 20px rgba(6,182,212,0.3)',
                }}
              >
                <Edit2 size={15} /> Edit Journey Bio
              </button>

              <button
                onClick={openAddCardModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 cursor-pointer shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  boxShadow: '0 0 20px rgba(168,85,247,0.3)',
                }}
              >
                <Plus size={15} /> + Add Journey Card
              </button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: avatar + bio */}
          <div>
            {/* Avatar card */}
            <div className="glass rounded-3xl p-6 mb-6 flex items-start gap-5">
              <div
                className="flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white"
                style={{
                  background: 'linear-gradient(135deg, #4361ee, #a855f7)',
                  boxShadow: '0 0 30px rgba(67,97,238,0.4)',
                }}
              >
                {aboutData.name.split(' ').map(n => n[0]).join('') || 'SY'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{aboutData.name}</h3>
                <p className="text-cyan-400 text-sm font-mono mb-2">{aboutData.role}</p>
                <div className="flex items-center gap-1.5 text-white/50 text-xs">
                  <MapPin size={11} /> {aboutData.location}
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6 mb-6">
              {(aboutData.bio || []).map((p, idx) => (
                <p key={idx} className="text-white/70 leading-relaxed mb-4 last:mb-0">
                  {p}
                </p>
              ))}
            </div>

            {/* Tags with single-click delete & + Add Tech Tag button in Admin Mode */}
            <div className="flex flex-wrap gap-2 items-center">
              {(aboutData.tags || []).map(tag => (
                <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono glass text-white/70"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span>{tag}</span>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteTag(tag)}
                      className="text-red-400 hover:text-red-300 transition-colors p-0.5 cursor-pointer ml-0.5"
                      title={`Remove ${tag}`}
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}

              {isAdmin && (
                <button
                  onClick={() => setShowTagModal(true)}
                  className="px-3 py-1 rounded-full text-xs font-mono glass text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1 cursor-pointer"
                  title="Add New Tech Tag"
                >
                  <Plus size={12} /> Add Tech
                </button>
              )}
            </div>
          </div>

          {/* Right: cards */}
          <div className="space-y-4">
            {(aboutData.cards || []).map((card) => {
              const Icon = iconMap[card.iconName] || GraduationCap
              const color = card.color || '#4361ee'
              return (
                <div key={card.title} className="glass rounded-2xl p-5 flex items-start justify-between gap-4 hover:bg-white/5 transition-colors group relative">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ background: `${color}20`, border: `1px solid ${color}40` }}
                    >
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">{card.title}</h4>
                      <p className="text-white/55 text-sm leading-relaxed">{card.desc}</p>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => openEditCardModal(card)}
                        className="p-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-colors"
                        title="Edit Journey Card"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteCard(card.title)}
                        className="p-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
                        title="Delete Journey Card"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {stats.map(s => (
            <div key={s.label} className="glass rounded-2xl p-5 text-center">
              <div className="text-3xl font-black mb-1 gradient-text">
                <AnimCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-white/50 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Passcode Modal */}
      {showAuthModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
          onClick={() => setShowAuthModal(false)}>
          <div className="glass-strong rounded-3xl max-w-sm w-full p-6 cmd-panel text-center"
            onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
              <Lock size={22} className="text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Portfolio Owner Auth</h3>
            <p className="text-white/45 text-xs mb-5">Enter passcode to edit your journey (Hint: admin123)</p>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Enter admin passcode..."
                value={passcodeAttempt}
                onChange={e => setPasscodeAttempt(e.target.value)}
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(6,182,212,0.3)' }}
              />
              {authError && <p className="text-red-400 text-xs">{authError}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowAuthModal(false)}
                  className="flex-1 py-2.5 rounded-xl glass text-white/50 text-sm cursor-pointer">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl font-semibold text-white text-sm cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #4361ee)' }}>
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Bio Modal */}
      {showBioModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setShowBioModal(false)}>
          <div className="glass-strong rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-7 cmd-panel"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Edit2 size={16} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">Edit Journey Bio</h3>
              </div>
              <button onClick={() => setShowBioModal(false)} className="p-1.5 glass rounded-xl text-white/50 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveBio} className="space-y-4">
              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">NAME *</label>
                <input
                  type="text"
                  required
                  value={bioForm.name}
                  onChange={e => setBioForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">ROLE / TITLE</label>
                  <input
                    type="text"
                    value={bioForm.role}
                    onChange={e => setBioForm(f => ({ ...f, role: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">LOCATION</label>
                  <input
                    type="text"
                    value={bioForm.location}
                    onChange={e => setBioForm(f => ({ ...f, location: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">BIO PARAGRAPH 1</label>
                <textarea
                  rows={3}
                  value={bioForm.bio1}
                  onChange={e => setBioForm(f => ({ ...f, bio1: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">BIO PARAGRAPH 2</label>
                <textarea
                  rows={3}
                  value={bioForm.bio2}
                  onChange={e => setBioForm(f => ({ ...f, bio2: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">TECH TAGS (comma separated)</label>
                <input
                  type="text"
                  value={bioForm.tagsInput}
                  onChange={e => setBioForm(f => ({ ...f, tagsInput: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowBioModal(false)}
                  className="flex-1 py-3 rounded-xl glass text-white/50 font-semibold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl font-semibold text-white cursor-pointer transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #4361ee)' }}>
                  {isSubmitting ? 'Saving to MongoDB...' : 'Save Bio'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Add Tech Tag Modal */}
      {showTagModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setShowTagModal(false)}>
          <div className="glass-strong rounded-3xl max-w-sm w-full p-6 cmd-panel"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="text-white font-bold text-lg">+ Add Tech Tag</h3>
              <button onClick={() => setShowTagModal(false)} className="p-1.5 glass rounded-xl text-white/50 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddTag} className="space-y-4">
              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">TECHNOLOGY NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PyTorch, Next.js 14, AWS"
                  value={newTagInput}
                  onChange={e => setNewTagInput(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowTagModal(false)}
                  className="flex-1 py-2.5 rounded-xl glass text-white/50 text-sm font-semibold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-white text-sm cursor-pointer transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #4361ee)' }}>
                  Add Tech
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Add or Edit Journey Card Modal */}
      {showCardModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setShowCardModal(false)}>
          <div className="glass-strong rounded-3xl max-w-md w-full p-7 cmd-panel"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  {editingCard ? <Edit2 size={16} className="text-white" /> : <Plus size={16} className="text-white" />}
                </div>
                <h3 className="text-white font-bold text-lg">{editingCard ? `Edit ${editingCard.title}` : 'Add Journey Card'}</h3>
              </div>
              <button onClick={() => setShowCardModal(false)} className="p-1.5 glass rounded-xl text-white/50 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCard} className="space-y-4">
              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">CARD TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Education or Key Focus"
                  value={cardForm.title}
                  onChange={e => setCardForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">DESCRIPTION *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Summary of this milestone or journey focus..."
                  value={cardForm.desc}
                  onChange={e => setCardForm(f => ({ ...f, desc: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">ICON</label>
                  <select
                    value={cardForm.iconName}
                    onChange={e => setCardForm(f => ({ ...f, iconName: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none bg-slate-900 border border-white/10"
                  >
                    <option value="GraduationCap">Education 🎓</option>
                    <option value="Code2">What I Build 💻</option>
                    <option value="Sparkles">Exploring ✨</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">COLOR (HEX)</label>
                  <input
                    type="text"
                    placeholder="#4361ee"
                    value={cardForm.color}
                    onChange={e => setCardForm(f => ({ ...f, color: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowCardModal(false)}
                  className="flex-1 py-3 rounded-xl glass text-white/50 font-semibold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl font-semibold text-white cursor-pointer transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
                  {isSubmitting ? 'Saving to MongoDB...' : (editingCard ? 'Update Card' : 'Save Card')}
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
