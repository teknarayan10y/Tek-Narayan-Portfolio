import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Award, Trophy, Star, Zap, ExternalLink, Code2, Plus, Lock, Unlock, Trash2, Edit2, X, GitBranch } from 'lucide-react'
import { fetchAchievements, createAchievement, updateAchievement, deleteAchievementById } from '../api.js'
import { useAdminAuth } from '../useAdminAuth'

function LeetCodeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226a1.374 1.374 0 0 0-.416.947c0 .367.14.718.416.961l5.406 5.347a1.374 1.374 0 0 0 1.94 0 1.374 1.374 0 0 0 0-1.94l-4.444-4.394 4.444-4.417a1.374 1.374 0 0 0 0-1.942 1.374 1.374 0 0 0-.979-.43zm-7.79 6.84a1.374 1.374 0 0 0-.962.438L.416 11.666a1.374 1.374 0 0 0 0 1.941l4.315 4.387a1.374 1.374 0 0 0 1.94 0 1.374 1.374 0 0 0 0-1.94L2.356 12.637l4.315-4.388a1.374 1.374 0 0 0 0-1.942 1.374 1.374 0 0 0-.978-.467z" />
    </svg>
  )
}

const initialAchievements = [
  {
    platform: 'LeetCode',
    badge: 'Knight',
    color: '#f59e0b',
    stats: [
      { label: 'Problems Solved', value: 350 },
      { label: 'Contest Rating', value: 1840 },
      { label: 'Global Rank', value: 24100 },
      { label: 'Badges Earned', value: 8 },
    ],
  },
  {
    platform: 'GitHub',
    badge: 'Pro Contributor',
    color: '#a855f7',
    stats: [
      { label: 'Contributions (2024)', value: 520 },
      { label: 'Pull Requests', value: 45 },
      { label: 'Stars Earned', value: 120 },
      { label: 'Repositories', value: 24 },
    ],
  },
  {
    platform: 'HackerRank',
    color: '#06b6d4',
    stats: [
      { label: 'Problem Solving', value: 5 },
      { label: 'Python Rank', value: 5 },
      { label: 'React Gold', value: 1 },
      { label: 'Global Points', value: 2400 },
    ],
    badge: '5★ Problem Solver',
  },
  {
    icon: Star,
    platform: 'GeeksforGeeks',
    color: '#2d8651',
    stats: [
      { label: 'Problems', value: 280 },
      { label: 'Score', value: 1650 },
      { label: 'Streak', value: 47 },
    ],
    badge: 'Institute Rank 2',
    badgeColor: '#2d8651',
  },
]

const initialHighlights = [
  { label: 'Hackathons', value: 8, sub: 'participated', color: '#f59e0b', icon: Trophy },
  { label: 'Open Source', value: 12, sub: 'contributions', color: '#06b6d4', icon: GitBranch },
  { label: 'Coding Challenges', value: 835, sub: 'solved total', color: '#a855f7', icon: Code2 },
  { label: 'Projects Live', value: 6, sub: 'in production', color: '#4361ee', icon: Star },
]

const initialTrophies = [
  { label: 'Smart India Hackathon', year: '2023', color: '#f59e0b' },
  { label: 'HackIIT Delhi', year: '2023', color: '#4361ee' },
  { label: 'AI Build Challenge', year: '2024', color: '#a855f7' },
  { label: 'Open Source Sprint', year: '2024', color: '#06b6d4' },
  { label: 'LeetCode 300 Club', year: '2024', color: '#f89f1b' },
  { label: 'GFG Campus Champion', year: '2023', color: '#2d8651' },
]

function AnimCount({ to }) {
  const [v, setV] = useState(to)

  useEffect(() => {
    setV(to)
  }, [to])

  return <span>{v.toLocaleString()}</span>
}

export default function Achievements() {
  const { isAdmin } = useAdminAuth()
  const [achievementList, setAchievementList] = useState(initialAchievements)
  const [highlights, setHighlights] = useState(initialHighlights)
  const [trophies, setTrophies] = useState(initialTrophies)
  const [adminKey, setAdminKey] = useState('admin123')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCard, setEditingCard] = useState(null)
  const [showEditHighlightsModal, setShowEditHighlightsModal] = useState(false)
  const [showAddTrophyModal, setShowAddTrophyModal] = useState(false)

  const [passcodeAttempt, setPasscodeAttempt] = useState('')
  const [authError, setAuthError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const ref = useRef(null)

  // Form for Platform Card (Create or Edit)
  const [form, setForm] = useState({
    platform: '',
    badge: 'Knight',
    color: '#f59e0b',
    statsInput: 'Problems Solved: 350, Score: 1800',
  })

  // Form for Trophy
  const [trophyForm, setTrophyForm] = useState({
    label: '',
    year: '2024',
    color: '#f59e0b',
  })

  // Form for Highlights
  const [highlightForm, setHighlightForm] = useState({
    hackathons: 8,
    openSource: 12,
    challenges: 835,
    projects: 6,
  })

  useEffect(() => {
    fetchAchievements(initialAchievements).then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setAchievementList(data)
      }
    })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) ref.current?.classList.add('section-visible')
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

  const openEditCardModal = (ach) => {
    setEditingCard(ach)
    const formattedStats = (ach.stats || []).map(s => `${s.label}: ${s.value}`).join(', ')
    setForm({
      platform: ach.platform,
      badge: ach.badge || 'Milestone',
      color: ach.color || '#f59e0b',
      statsInput: formattedStats,
    })
  }

  const handleSaveAchievement = async (e) => {
    e.preventDefault()
    if (!form.platform.trim()) return

    setIsSubmitting(true)
    const parsedStats = form.statsInput.split(',').map(s => {
      const parts = s.split(':')
      return {
        label: parts[0] ? parts[0].trim() : 'Metric',
        value: parts[1] ? parseInt(parts[1].trim() || '0') : 100,
      }
    }).filter(s => s.label)

    const achievementData = {
      platform: form.platform.trim(),
      badge: form.badge || 'Coder',
      badgeColor: form.color || '#f59e0b',
      color: form.color || '#f59e0b',
      stats: parsedStats,
    }

    if (editingCard && editingCard._id) {
      const res = await updateAchievement(editingCard._id, achievementData, adminKey || 'admin123')
      setIsSubmitting(false)
      if (res.success && res.achievement) {
        setAchievementList(prev => prev.map(a => (a._id === editingCard._id ? res.achievement : a)))
      } else {
        setAchievementList(prev => prev.map(a => (a._id === editingCard._id ? { ...achievementData, _id: editingCard._id } : a)))
      }
    } else if (editingCard) {
      // Local edit
      setAchievementList(prev => prev.map(a => (a.platform === editingCard.platform ? { ...achievementData } : a)))
      setIsSubmitting(false)
    } else {
      // Create new
      const res = await createAchievement(achievementData, adminKey || 'admin123')
      setIsSubmitting(false)
      if (res.success && res.achievement) {
        setAchievementList(prev => [...prev, res.achievement])
      } else {
        setAchievementList(prev => [...prev, { ...achievementData, _id: Date.now().toString() }])
      }
    }

    setShowAddModal(false)
    setEditingCard(null)
    setForm({ platform: '', badge: 'Knight', color: '#f59e0b', statsInput: 'Problems Solved: 350, Score: 1800' })
  }

  const handleDeleteAchievement = async (ach) => {
    if (!window.confirm(`Delete milestone platform "${ach.platform}"?`)) return
    if (ach._id) {
      await deleteAchievementById(ach._id, adminKey || 'admin123')
    }
    setAchievementList(prev => prev.filter(a => (a._id ? a._id !== ach._id : a.platform !== ach.platform)))
  }

  const handleSaveHighlights = (e) => {
    e.preventDefault()
    setHighlights([
      { label: 'Hackathons', value: parseInt(highlightForm.hackathons || 0), sub: 'participated', color: '#f59e0b', icon: Trophy },
      { label: 'Open Source', value: parseInt(highlightForm.openSource || 0), sub: 'contributions', color: '#06b6d4', icon: GitBranch },
      { label: 'Coding Challenges', value: parseInt(highlightForm.challenges || 0), sub: 'solved total', color: '#a855f7', icon: Code2 },
      { label: 'Projects Live', value: parseInt(highlightForm.projects || 0), sub: 'in production', color: '#4361ee', icon: Star },
    ])
    setShowEditHighlightsModal(false)
  }

  const handleAddTrophy = (e) => {
    e.preventDefault()
    if (!trophyForm.label.trim()) return
    setTrophies(prev => [...prev, { label: trophyForm.label.trim(), year: trophyForm.year || '2024', color: trophyForm.color || '#f59e0b' }])
    setShowAddTrophyModal(false)
    setTrophyForm({ label: '', year: '2024', color: '#f59e0b' })
  }

  const handleDeleteTrophy = (trophyLabel) => {
    setTrophies(prev => prev.filter(t => t.label !== trophyLabel))
  }

  return (
    <section id="achievements" className="relative py-24 px-6">
      <div ref={ref} className="section-hidden max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-yellow-400 mb-4"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
            ACHIEVEMENTS ({achievementList.length})
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Coding <span className="gradient-text">Milestones</span>
          </h2>

          {/* Action Header bar: Add Platform & Edit Highlights */}
          {isAdmin && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setEditingCard(null)
                  setForm({
                    platform: '',
                    badge: 'Knight',
                    color: '#f59e0b',
                    statsInput: 'Problems Solved: 350, Score: 1800',
                  })
                  setShowAddModal(true)
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105 cursor-pointer shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #eab308)',
                  boxShadow: '0 0 20px rgba(245,158,11,0.3)',
                }}
              >
                <Plus size={16} /> + Add Platform
              </button>

              <button
                onClick={() => {
                  setHighlightForm({
                    hackathons: highlights[0].value,
                    openSource: highlights[1].value,
                    challenges: highlights[2].value,
                    projects: highlights[3].value,
                  })
                  setShowEditHighlightsModal(true)
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105 cursor-pointer shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #4361ee)',
                  boxShadow: '0 0 20px rgba(168,85,247,0.3)',
                }}
              >
                <Edit2 size={15} /> Edit Highlight Stats
              </button>
            </div>
          )}
        </div>

        {/* Highlight stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {highlights.map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} className="glass rounded-2xl p-5 text-center group hover:bg-white/5 transition-all">
              <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div className="text-2xl font-black mb-0.5" style={{ color }}>
                <AnimCount to={value} />+
              </div>
              <div className="text-white font-semibold text-sm">{label}</div>
              <div className="text-white/30 text-xs">{sub}</div>
            </div>
          ))}
        </div>

        {/* Platform cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {achievementList.map(ach => {
            const Icon = ach.icon || Trophy
            return (
              <div key={ach._id || ach.platform}
                className="glass rounded-2xl p-5 hover:bg-white/5 transition-all hover:scale-[1.03] group relative"
                style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: `${ach.color || '#f59e0b'}20`, border: `1px solid ${ach.color || '#f59e0b'}40` }}>
                      <Icon size={16} style={{ color: ach.color || '#f59e0b' }} />
                    </div>
                    <span className="font-bold text-white text-sm">{ach.platform}</span>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditCardModal(ach)}
                        className="p-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-colors"
                        title="Edit Milestone Platform"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteAchievement(ach)}
                        className="p-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
                        title="Delete Milestone Platform"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-4 text-xs font-semibold"
                  style={{ background: `${ach.badgeColor || ach.color || '#f59e0b'}20`, color: ach.badgeColor || ach.color || '#f59e0b', border: `1px solid ${ach.badgeColor || ach.color || '#f59e0b'}40` }}>
                  <Trophy size={10} /> {ach.badge || 'Milestone'}
                </div>

                {/* Stats */}
                <div className="space-y-2.5">
                  {(ach.stats || []).map(s => (
                    <div key={s.label} className="flex items-center justify-between">
                      <span className="text-white/45 text-xs">{s.label}</span>
                      <span className="font-mono font-semibold text-sm" style={{ color: ach.color || '#f59e0b' }}>
                        <AnimCount to={s.value || 0} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Trophy shelf */}
        <div className="mt-8 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/50 text-xs font-mono tracking-widest">TROPHY SHELF ({trophies.length})</h3>
            {isAdmin && (
              <button
                onClick={() => setShowAddTrophyModal(true)}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-mono cursor-pointer"
              >
                <Plus size={12} /> Add Trophy
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {trophies.map(t => (
              <div key={t.label}
                className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-sm hover:bg-white/6 transition-colors group relative"
                style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                <Trophy size={13} style={{ color: t.color || '#f59e0b' }} />
                <span className="text-white/70">{t.label}</span>
                <span className="text-white/25 text-xs font-mono">{t.year}</span>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteTrophy(t.label)}
                    className="ml-1 text-red-400 hover:text-red-300 p-0.5 cursor-pointer"
                    title="Delete Trophy"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center mx-auto mb-4">
              <Lock size={22} className="text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Portfolio Owner Auth</h3>
            <p className="text-white/45 text-xs mb-5">Enter passcode to edit achievements (Hint: admin123)</p>

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
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #eab308)' }}>
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Add or Edit Platform Milestone Modal */}
      {(showAddModal || editingCard) && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => {
            setShowAddModal(false)
            setEditingCard(null)
          }}>
          <div className="glass-strong rounded-3xl max-w-md w-full p-7 cmd-panel"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
                  {editingCard ? <Edit2 size={16} className="text-white" /> : <Plus size={16} className="text-white" />}
                </div>
                <h3 className="text-white font-bold text-lg">{editingCard ? `Edit ${editingCard.platform}` : 'Add Coding Milestone'}</h3>
              </div>
              <button onClick={() => {
                setShowAddModal(false)
                setEditingCard(null)
              }} className="p-1.5 glass rounded-xl text-white/50 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveAchievement} className="space-y-4">
              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">PLATFORM NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Codeforces or Kaggle"
                  value={form.platform}
                  onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">BADGE / RANK TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. Candidate Master or Grandmaster"
                  value={form.badge}
                  onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">ACCENT COLOR (HEX)</label>
                <input
                  type="text"
                  placeholder="#f59e0b"
                  value={form.color}
                  onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">STATS (format: Metric:Value, ...)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Problems Solved: 450, Rating: 1720, Global Rank: 1200"
                  value={form.statsInput}
                  onChange={e => setForm(f => ({ ...f, statsInput: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none resize-none"
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
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #eab308)' }}>
                  {isSubmitting ? 'Saving to MongoDB...' : (editingCard ? 'Update Milestone' : 'Save Milestone')}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Highlight Stats Modal */}
      {showEditHighlightsModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setShowEditHighlightsModal(false)}>
          <div className="glass-strong rounded-3xl max-w-md w-full p-7 cmd-panel"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                  <Edit2 size={16} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">Edit Highlight Stats</h3>
              </div>
              <button onClick={() => setShowEditHighlightsModal(false)} className="p-1.5 glass rounded-xl text-white/50 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveHighlights} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">HACKATHONS</label>
                  <input
                    type="number"
                    value={highlightForm.hackathons}
                    onChange={e => setHighlightForm(f => ({ ...f, hackathons: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">OPEN SOURCE</label>
                  <input
                    type="number"
                    value={highlightForm.openSource}
                    onChange={e => setHighlightForm(f => ({ ...f, openSource: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">CODING CHALLENGES</label>
                  <input
                    type="number"
                    value={highlightForm.challenges}
                    onChange={e => setHighlightForm(f => ({ ...f, challenges: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">PROJECTS LIVE</label>
                  <input
                    type="number"
                    value={highlightForm.projects}
                    onChange={e => setHighlightForm(f => ({ ...f, projects: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowEditHighlightsModal(false)}
                  className="flex-1 py-3 rounded-xl glass text-white/50 font-semibold cursor-pointer">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-3 rounded-xl font-semibold text-white cursor-pointer transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #4361ee)' }}>
                  Save Stats
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Add Trophy Modal */}
      {showAddTrophyModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setShowAddTrophyModal(false)}>
          <div className="glass-strong rounded-3xl max-w-md w-full p-7 cmd-panel"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
                  <Trophy size={16} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">Add Award / Trophy</h3>
              </div>
              <button onClick={() => setShowAddTrophyModal(false)} className="p-1.5 glass rounded-xl text-white/50 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddTrophy} className="space-y-4">
              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">AWARD / HACKATHON TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Summer of Code Winner"
                  value={trophyForm.label}
                  onChange={e => setTrophyForm(f => ({ ...f, label: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">YEAR</label>
                  <input
                    type="text"
                    placeholder="2024"
                    value={trophyForm.year}
                    onChange={e => setTrophyForm(f => ({ ...f, year: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">COLOR (HEX)</label>
                  <input
                    type="text"
                    placeholder="#f59e0b"
                    value={trophyForm.color}
                    onChange={e => setTrophyForm(f => ({ ...f, color: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowAddTrophyModal(false)}
                  className="flex-1 py-3 rounded-xl glass text-white/50 font-semibold cursor-pointer">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-3 rounded-xl font-semibold text-white cursor-pointer transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #eab308)' }}>
                  Add Trophy
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
