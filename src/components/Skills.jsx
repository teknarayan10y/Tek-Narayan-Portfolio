import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Lock, Unlock, Trash2, X } from 'lucide-react'
import { fetchSkills, createSkillCategory, deleteSkillCategoryById } from '../api.js'
import { useAdminAuth } from '../useAdminAuth'

const initialCategories = [
  {
    name: 'Frontend',
    color: '#61dafb',
    skills: [
      { name: 'React', pct: 92 },
      { name: 'TypeScript', pct: 85 },
      { name: 'Next.js', pct: 80 },
      { name: 'Tailwind CSS', pct: 90 },
      { name: 'JavaScript', pct: 93 },
    ],
  },
  {
    name: 'Backend',
    color: '#84ce24',
    skills: [
      { name: 'Node.js', pct: 88 },
      { name: 'Express.js', pct: 87 },
      { name: 'REST APIs', pct: 90 },
    ],
  },
  {
    name: 'Database',
    color: '#47a248',
    skills: [
      { name: 'MongoDB', pct: 88 },
      { name: 'SQL', pct: 75 },
      { name: 'Redis', pct: 65 },
    ],
  },
  {
    name: 'AI / ML',
    color: '#a855f7',
    skills: [
      { name: 'OpenAI API', pct: 85 },
      { name: 'LangChain', pct: 82 },
      { name: 'RAG Architecture', pct: 80 },
    ],
  },
  {
    name: 'DevOps / Cloud',
    color: '#06b6d4',
    skills: [
      { name: 'Docker', pct: 72 },
      { name: 'Vercel', pct: 88 },
      { name: 'Render', pct: 80 },
      { name: 'GitHub Actions', pct: 70 },
    ],
  },
  {
    name: 'Tools',
    color: '#f59e0b',
    skills: [
      { name: 'Git / GitHub', pct: 92 },
      { name: 'VS Code', pct: 95 },
      { name: 'Figma', pct: 70 },
      { name: 'Postman', pct: 85 },
    ],
  },
]

function ProgressRing({ pct, color, size = 64 }) {
  const [animated, setAnimated] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (animated / 100) * circ

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        let current = 0
        const timer = setInterval(() => {
          current = Math.min(current + 2, pct)
          setAnimated(current)
          if (current >= pct) clearInterval(timer)
        }, 20)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [pct])

  return (
    <svg width={size} height={size} className="flex-shrink-0">
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={6}
        fill="none"
      />
      <circle
        ref={ref}
        cx={size / 2} cy={size / 2} r={r}
        stroke={color}
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="progress-ring-circle"
        style={{
          filter: `drop-shadow(0 0 4px ${color}80)`,
        }}
      />
      <text
        x={size / 2} y={size / 2 + 4}
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fontFamily="JetBrains Mono"
        fill={color}
      >
        {animated}%
      </text>
    </svg>
  )
}

export default function Skills() {
  const { isAdmin } = useAdminAuth()
  const [skillList, setSkillList] = useState(initialCategories)
  const [activeCategory, setActiveCategory] = useState('All')
  const [adminKey, setAdminKey] = useState('admin123')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [passcodeAttempt, setPasscodeAttempt] = useState('')
  const [authError, setAuthError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const ref = useRef(null)

  // Form state
  const [form, setForm] = useState({
    name: '',
    color: '#4361ee',
    skillsInput: '',
  })

  useEffect(() => {
    fetchSkills(initialCategories).then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setSkillList(data)
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
      setShowAddModal(true)
      setAuthError('')
      setPasscodeAttempt('')
    } else {
      setAuthError('Incorrect passcode. Hint: admin123')
    }
  }

  const handleCreateSkillCategory = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.skillsInput.trim()) return

    setIsSubmitting(true)
    const newCategoryData = {
      name: form.name.trim(),
      color: form.color || '#4361ee',
      skills: form.skillsInput.split(',').map(s => {
        const parts = s.split(':')
        return { name: parts[0].trim(), pct: parseInt(parts[1] || '85') }
      }).filter(s => s.name),
    }

    const res = await createSkillCategory(newCategoryData, adminKey || 'admin123')
    setIsSubmitting(false)

    if (res.success && res.skillCategory) {
      setSkillList(prev => [...prev, res.skillCategory])
      setShowAddModal(false)
      setForm({ name: '', color: '#4361ee', skillsInput: '' })
    } else {
      // Local fallback
      const tempCategory = { ...newCategoryData, _id: Date.now().toString() }
      setSkillList(prev => [...prev, tempCategory])
      setShowAddModal(false)
    }
  }

  const handleDeleteSkillCategory = async (cat) => {
    if (!window.confirm(`Delete skill category "${cat.name}"?`)) return
    if (cat._id) {
      await deleteSkillCategoryById(cat._id, adminKey || 'admin123')
    }
    setSkillList(prev => prev.filter(c => (c._id ? c._id !== cat._id : c.name !== cat.name)))
  }

  const filtered = activeCategory === 'All'
    ? skillList
    : skillList.filter(c => c.name === activeCategory)

  return (
    <section id="skills" className="relative py-24 px-6">
      <div ref={ref} className="section-hidden max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-purple-400 mb-4"
            style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
            SKILLS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            My <span className="gradient-text">Tech Stack</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto mb-6">
            A battle-tested toolkit built through shipping real products.
          </p>

          {/* Action Header bar: Add Skill */}
          {isAdmin && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105 cursor-pointer shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #4361ee)',
                  boxShadow: '0 0 20px rgba(168,85,247,0.3)',
                }}
              >
                <Plus size={16} /> + Add Skill Category
              </button>
            </div>
          )}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {['All', ...skillList.map(c => c.name)].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer"
              style={
                activeCategory === cat
                  ? { background: 'linear-gradient(135deg, #4361ee, #7c3aed)', color: 'white' }
                  : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skill grids */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(cat => (
            <div key={cat._id || cat.name} className="glass rounded-2xl p-5 relative group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color || '#4361ee', boxShadow: `0 0 6px ${cat.color || '#4361ee'}` }} />
                  <span className="font-bold text-white text-sm">{cat.name}</span>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteSkillCategory(cat)}
                    className="p-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
                    title="Delete Skill Category"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {(cat.skills || []).map(sk => (
                  <div key={sk.name} className="flex items-center gap-3 group">
                    <ProgressRing pct={sk.pct || 85} color={cat.color || '#4361ee'} size={44} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white/80 text-sm font-medium">{sk.name}</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${sk.pct || 85}%`,
                            background: `linear-gradient(90deg, ${cat.color || '#4361ee'}80, ${cat.color || '#4361ee'})`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tech icon cloud */}
        <div className="mt-10 glass rounded-2xl p-6">
          <h3 className="text-white/60 text-xs font-mono tracking-widest text-center mb-4">ALSO FAMILIAR WITH</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {['HTML5', 'CSS3', 'Python', 'JWT', 'Socket.io', 'Prisma', 'GraphQL', 'Cloudinary', 'Firebase', 'AWS', 'Nginx', 'PM2'].map(t => (
              <span key={t}
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-white/50 hover:text-white/80 glass transition-colors cursor-default"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {t}
              </span>
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
              <Lock size={22} className="text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Portfolio Owner Auth</h3>
            <p className="text-white/45 text-xs mb-5">Enter passcode to add/delete skills (Hint: admin123)</p>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Enter admin passcode..."
                value={passcodeAttempt}
                onChange={e => setPasscodeAttempt(e.target.value)}
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.3)' }}
              />
              {authError && <p className="text-red-400 text-xs">{authError}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowAuthModal(false)}
                  className="flex-1 py-2.5 rounded-xl glass text-white/50 text-sm cursor-pointer">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl font-semibold text-white text-sm cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #4361ee)' }}>
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Add Skill Category Modal */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setShowAddModal(false)}>
          <div className="glass-strong rounded-3xl max-w-md w-full p-7 cmd-panel"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                  <Plus size={16} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">Add New Skill Category</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 glass rounded-xl text-white/50 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSkillCategory} className="space-y-4">
              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">CATEGORY NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud & AI"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">ACCENT COLOR (HEX)</label>
                <input
                  type="text"
                  placeholder="#a855f7"
                  value={form.color}
                  onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">SKILLS (format: SkillName:Pct, ...)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. PyTorch:90, TensorFlow:85, FastAPI:88"
                  value={form.skillsInput}
                  onChange={e => setForm(f => ({ ...f, skillsInput: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl glass text-white/50 font-semibold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl font-semibold text-white cursor-pointer transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #4361ee)' }}>
                  {isSubmitting ? 'Saving to MongoDB...' : 'Add Category'}
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
