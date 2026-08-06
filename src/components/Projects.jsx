import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  ExternalLink, Layers, Check, ChevronRight, X, Sparkles, Star, Plus, Lock, Unlock, Trash2, Edit2
} from 'lucide-react'
import { fetchProjects, createProject, updateProject, deleteProjectById } from '../api.js'
import { useAdminAuth } from '../useAdminAuth'

function GithubIconIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

const initialProjects = [
  {
    title: 'Enterprise AI ERP System',
    subtitle: 'AI-Native Business OS',
    description: 'Full-suite ERP featuring natural language database queries, automated invoice OCR, predictive inventory analytics, and multi-tenant RBAC.',
    category: 'AI',
    tech: ['Next.js 14', 'Python FastApi', 'LangChain', 'OpenAI', 'PostgreSQL', 'TailwindCSS'],
    features: ['Natural language to SQL converter', 'OCR invoice processing engine', 'Real-time WebSocket notifications', 'Multi-tenant database schema'],
    color: '#4361ee',
    gradient: 'from-blue-600 to-purple-700',
    status: 'Production',
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    title: 'PharmaCare Medical Store Platform',
    subtitle: 'Healthcare E-Commerce & Inventory',
    description: 'B2B/B2C pharmacy management system with prescription scanner, real-time inventory tracking, batch expiry alerts, and GST billing.',
    category: 'Full Stack',
    tech: ['React 18', 'Node.js', 'Express', 'MongoDB', 'Redis', 'Razorpay'],
    features: ['AI Prescription Reader', 'Automated GST Invoicing', 'Low-stock SMS alerts', 'Cold-chain tracking dashboard'],
    color: '#06b6d4',
    gradient: 'from-cyan-500 to-blue-600',
    status: 'Live',
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    title: 'CraveExpress Food Delivery',
    subtitle: 'Hyperlocal Delivery Ecosystem',
    description: 'Multi-app food delivery suite featuring customer ordering web app, restaurant management portal, and live driver tracking.',
    category: 'Full Stack',
    tech: ['React', 'Node.js', 'Socket.io', 'Google Maps API', 'TailwindCSS'],
    features: ['Sub-second live map tracking', 'Dynamic surge pricing engine', 'One-click menu manager', 'Driver route optimizer'],
    color: '#a855f7',
    gradient: 'from-purple-600 to-pink-600',
    status: 'Live',
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    title: 'RAG DocuChat AI',
    subtitle: 'Vector-Search Knowledge Base',
    description: 'Upload PDFs, docs, or web URLs and chat with your data using semantic search, hybrid retrieval, and source citation.',
    category: 'AI',
    tech: ['Python', 'LangChain', 'Pinecone', 'OpenAI', 'Streamlit'],
    features: ['Chunk-level citation mapping', 'Hybrid BM25 + Vector Search', 'Multi-document QA', 'Export to PDF summaries'],
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-600',
    status: 'Beta',
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    title: 'DevPulse Developer Analytics',
    subtitle: 'Engineering Metric Dashboard',
    description: 'Track GitHub velocity, PR review times, code churn, and deployment frequency across engineering teams.',
    category: 'Frontend',
    tech: ['React 18', 'Recharts', 'GitHub API', 'TailwindCSS', 'Vite'],
    features: ['Custom D3.js chart engine', 'PR review bottleneck alert', 'Sprint velocity predictor', 'Automated Slack digest'],
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    status: 'Production',
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    title: '3D Cyberpunk Portfolio',
    subtitle: 'Interactive Three.js Experience',
    description: 'This exact portfolio! Features real 3D particle Canvas, custom GLSL shaders, glassmorphic UI, and command palette.',
    category: 'Frontend',
    tech: ['Three.js', 'React', 'Tailwind v4', 'Vite', 'Lucide Icons'],
    features: ['Interactive 3D Particles', 'Command Palette (Ctrl+K)', 'Dynamic theme switcher', 'Passcode protected Admin Mode'],
    color: '#84ce24',
    gradient: 'from-lime-500 to-emerald-600',
    status: 'Live',
    liveUrl: '#',
    githubUrl: '#',
  },
]

function ProjectCard({ project, onClick, onDelete, onEdit, isAdmin }) {
  return (
    <div
      onClick={onClick}
      className="glass rounded-3xl overflow-hidden cursor-pointer group hover:bg-white/6 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between"
      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Header gradient banner */}
      <div className={`h-2.5 bg-gradient-to-r ${project.gradient || 'from-blue-600 to-purple-700'}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{ background: `${project.color || '#4361ee'}20`, color: project.color || '#4361ee' }}
              >
                {project.category || 'Full Stack'}
              </span>
              <span className="text-xs text-white/30">{project.status || 'Live'}</span>
            </div>
            <h3 className="text-white font-bold text-lg leading-tight">{project.title}</h3>
            <p className="text-white/40 text-xs mt-0.5">{project.subtitle || 'Featured Work'}</p>
          </div>
          <div className="flex items-center gap-1">
            {isAdmin && (
              <div className="flex items-center gap-1">
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(project)
                    }}
                    className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-colors"
                    title="Edit Project"
                  >
                    <Edit2 size={13} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(project)
                    }}
                    className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            )}
            <Layers size={16} style={{ color: project.color || '#4361ee' }} className="flex-shrink-0 mt-1 opacity-60 ml-1" />
          </div>
        </div>

        <p className="text-white/55 text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(project.tech || []).slice(0, 4).map(t => (
            <span key={t} className="px-2 py-0.5 rounded text-xs font-mono text-white/50"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              {t}
            </span>
          ))}
          {(project.tech || []).length > 4 && (
            <span className="px-2 py-0.5 rounded text-xs font-mono text-white/30"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              +{(project.tech || []).length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button className="flex items-center gap-1 text-xs font-medium transition-colors"
            style={{ color: project.color || '#4361ee' }}>
            View Details <ChevronRight size={12} />
          </button>
          <div className="flex gap-2">
            <button className="p-1.5 glass rounded-lg text-white/40 hover:text-white transition-colors">
              <GithubIconIcon size={13} />
            </button>
            <button className="p-1.5 glass rounded-lg text-white/40 hover:text-white transition-colors">
              <ExternalLink size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const { isAdmin } = useAdminAuth()
  const [projectList, setProjectList] = useState(initialProjects)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('All')
  const [adminKey, setAdminKey] = useState('admin123')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCard, setEditingCard] = useState(null)

  const [passcodeAttempt, setPasscodeAttempt] = useState('')
  const [authError, setAuthError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const ref = useRef(null)

  // Form state
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'Full Stack',
    tech: '',
    features: '',
    color: '#4361ee',
    gradient: 'from-blue-600 to-purple-700',
    status: 'Live',
    liveUrl: '#',
    githubUrl: '#',
  })

  useEffect(() => {
    fetchProjects(initialProjects).then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setProjectList(data)
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
      setAuthError('')
      setPasscodeAttempt('')
    } else {
      setAuthError('Incorrect passcode. Hint: admin123')
    }
  }

  const openEditProjectModal = (proj) => {
    setEditingCard(proj)
    setForm({
      title: proj.title,
      subtitle: proj.subtitle || '',
      description: proj.description,
      category: proj.category || 'Full Stack',
      tech: (proj.tech || []).join(', '),
      features: (proj.features || []).join(', '),
      color: proj.color || '#4361ee',
      gradient: proj.gradient || 'from-blue-600 to-purple-700',
      status: proj.status || 'Live',
      liveUrl: proj.liveUrl || '#',
      githubUrl: proj.githubUrl || '#',
    })
  }

  const handleSaveProject = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) return

    setIsSubmitting(true)
    const payload = {
      ...form,
      tech: form.tech.split(',').map(t => t.trim()).filter(Boolean),
      features: form.features.split(',').map(f => f.trim()).filter(Boolean),
    }

    if (editingCard && editingCard._id) {
      const res = await updateProject(editingCard._id, payload, adminKey || 'admin123')
      setIsSubmitting(false)
      if (res.success && res.project) {
        setProjectList(prev => prev.map(p => (p._id === editingCard._id ? res.project : p)))
      } else {
        setProjectList(prev => prev.map(p => (p._id === editingCard._id ? { ...payload, _id: editingCard._id } : p)))
      }
    } else if (editingCard) {
      setProjectList(prev => prev.map(p => (p.title === editingCard.title ? { ...payload } : p)))
      setIsSubmitting(false)
    } else {
      const res = await createProject(payload, adminKey || 'admin123')
      setIsSubmitting(false)
      if (res.success && res.project) {
        setProjectList(prev => [res.project, ...prev])
      } else {
        const tempProject = { ...payload, _id: Date.now().toString() }
        setProjectList(prev => [tempProject, ...prev])
      }
    }

    setShowAddModal(false)
    setEditingCard(null)
    setForm({
      title: '',
      subtitle: '',
      description: '',
      category: 'Full Stack',
      tech: '',
      features: '',
      color: '#4361ee',
      gradient: 'from-blue-600 to-purple-700',
      status: 'Live',
      liveUrl: '#',
      githubUrl: '#',
    })
    window.dispatchEvent(new CustomEvent('portfolio-updated'))
  }

  const handleDeleteProject = async (project) => {
    if (!window.confirm(`Delete "${project.title}" from portfolio?`)) return
    if (project._id) {
      await deleteProjectById(project._id, adminKey || 'admin123')
    }
    setProjectList(prev => prev.filter(p => (p._id ? p._id !== project._id : p.title !== project.title)))
    window.dispatchEvent(new CustomEvent('portfolio-updated'))
  }

  const cats = ['All', 'AI', 'Full Stack', 'Frontend', 'Backend', 'Mobile']
  const filtered = filter === 'All' ? projectList : projectList.filter(p => p.category === filter)

  return (
    <section id="projects" className="relative py-24 px-6">
      <div ref={ref} className="section-hidden max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-blue-400"
              style={{ background: 'rgba(67,97,238,0.1)', border: '1px solid rgba(67,97,238,0.2)' }}>
              PROJECTS ({projectList.length})
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Featured <span className="gradient-text">Work</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto mb-6">
            Real products built to solve real problems — from AI-powered ERPs to medical platforms.
          </p>

          {/* Action Header bar: Add Project */}
          {isAdmin && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setEditingCard(null)
                  setForm({
                    title: '',
                    subtitle: '',
                    description: '',
                    category: 'Full Stack',
                    tech: '',
                    features: '',
                    color: '#4361ee',
                    gradient: 'from-blue-600 to-purple-700',
                    status: 'Live',
                    liveUrl: '#',
                    githubUrl: '#',
                  })
                  setShowAddModal(true)
                }}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105 cursor-pointer shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #4361ee, #7c3aed)',
                  boxShadow: '0 0 20px rgba(67,97,238,0.3)',
                }}
              >
                <Plus size={16} /> + Add Project
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer"
              style={
                filter === c
                  ? { background: 'linear-gradient(135deg, #4361ee, #7c3aed)', color: 'white' }
                  : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }
              }>
              {c}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(p => (
            <ProjectCard
              key={p._id || p.title}
              project={p}
              onClick={() => setSelected(p)}
              onDelete={handleDeleteProject}
              onEdit={openEditProjectModal}
              isAdmin={isAdmin}
            />
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Lock size={22} className="text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Portfolio Owner Auth</h3>
            <p className="text-white/45 text-xs mb-5">Enter passcode to add/edit projects (Hint: admin123)</p>

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

      {/* Add or Edit Project Modal */}
      {(showAddModal || editingCard) && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => {
            setShowAddModal(false)
            setEditingCard(null)
          }}>
          <div className="glass-strong rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-7 cmd-panel"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  {editingCard ? <Edit2 size={16} className="text-white" /> : <Plus size={16} className="text-white" />}
                </div>
                <h3 className="text-white font-bold text-lg">{editingCard ? `Edit ${editingCard.title}` : 'Add New Project'}</h3>
              </div>
              <button onClick={() => {
                setShowAddModal(false)
                setEditingCard(null)
              }} className="p-1.5 glass rounded-xl text-white/50 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">PROJECT TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Financial Dashboard"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">SUBTITLE / TAGLINE</label>
                <input
                  type="text"
                  placeholder="e.g. Automated Insights Engine"
                  value={form.subtitle}
                  onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">CATEGORY</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none bg-slate-900 border border-white/10"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="AI">AI</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Mobile">Mobile</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">STATUS</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none bg-slate-900 border border-white/10"
                  >
                    <option value="Live">Live</option>
                    <option value="Production">Production</option>
                    <option value="Beta">Beta</option>
                    <option value="WIP">WIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">DESCRIPTION *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Comprehensive summary of project goals and achievements..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">TECH STACK TAGS (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, Node.js, MongoDB, TailwindCSS"
                  value={form.tech}
                  onChange={e => setForm(f => ({ ...f, tech: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">KEY FEATURES (comma separated)</label>
                <input
                  type="text"
                  placeholder="Feature 1, Feature 2, Feature 3"
                  value={form.features}
                  onChange={e => setForm(f => ({ ...f, features: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">LIVE DEMO URL</label>
                  <input
                    type="text"
                    placeholder="https://myproject.com"
                    value={form.liveUrl}
                    onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">GITHUB REPO URL</label>
                  <input
                    type="text"
                    placeholder="https://github.com/myrepo"
                    value={form.githubUrl}
                    onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
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
                  style={{ background: 'linear-gradient(135deg, #4361ee, #7c3aed)' }}>
                  {isSubmitting ? 'Saving to MongoDB...' : (editingCard ? 'Update Project' : 'Save Project')}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Project Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setSelected(null)}>
          <div
            className="glass-strong rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 cmd-panel relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-5 right-5 p-2 rounded-xl glass text-white/50 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono px-3 py-1 rounded-full"
                style={{ background: `${selected.color || '#4361ee'}20`, color: selected.color || '#4361ee', border: `1px solid ${selected.color || '#4361ee'}40` }}>
                {selected.category || 'Full Stack'}
              </span>
              <span className="text-xs text-white/40">{selected.status || 'Live'}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white mb-1">{selected.title}</h2>
            <p className="text-white/40 text-sm mb-6">{selected.subtitle}</p>

            <div className="space-y-6">
              <div>
                <h4 className="text-white/40 text-xs font-mono tracking-widest mb-2">OVERVIEW</h4>
                <p className="text-white/70 text-base leading-relaxed">{selected.description}</p>
              </div>

              <div>
                <h4 className="text-white/40 text-xs font-mono tracking-widest mb-3">KEY FEATURES</h4>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {(selected.features || []).map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-white/70">
                      <Check size={14} className="text-green-400 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white/40 text-xs font-mono tracking-widest mb-3">TECH STACK</h4>
                <div className="flex flex-wrap gap-2">
                  {(selected.tech || []).map(t => (
                    <span key={t} className="px-3 py-1 rounded-lg text-xs font-mono text-white/70 glass"
                      style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                {selected.liveUrl && (
                  <a
                    href={selected.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #4361ee, #7c3aed)' }}
                  >
                    <ExternalLink size={15} /> Live Demo
                  </a>
                )}
                {selected.githubUrl && (
                  <a
                    href={selected.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm glass hover:bg-white/10 transition-all"
                  >
                    <GithubIconIcon size={15} /> View Source Code
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
