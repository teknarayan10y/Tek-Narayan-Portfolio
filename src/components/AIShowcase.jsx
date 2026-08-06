import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Brain, Database, MessageSquare, BarChart3, Search, Zap, FileText, GitBranch, Plus, Lock, Unlock, Trash2, Edit2, X } from 'lucide-react'
import { fetchAIShowcase, createAIShowcase, updateAIShowcase, deleteAIShowcaseById } from '../api.js'
import { useAdminAuth } from '../useAdminAuth'

const iconMap = {
  Brain,
  Database,
  MessageSquare,
  FileText,
  BarChart3,
  Search,
  Zap,
  GitBranch,
}

const initialAIProjects = [
  {
    iconName: 'Brain',
    title: 'AI ERP Assistant',
    desc: 'Conversational ERP interface — ask questions in plain English, get business insights instantly.',
    color: '#4361ee',
    tags: ['LangChain', 'OpenAI', 'RAG'],
    status: 'Production',
  },
  {
    iconName: 'Database',
    title: 'NL Database Query',
    desc: 'Natural language to SQL/MongoDB queries. No SQL knowledge needed. Just ask.',
    color: '#06b6d4',
    tags: ['GPT-4', 'MongoDB', 'SQL'],
    status: 'Live',
  },
  {
    iconName: 'MessageSquare',
    title: 'RAG Chatbot',
    desc: 'Upload documents, build a knowledge base, and chat with your data using vector search.',
    color: '#a855f7',
    tags: ['Pinecone', 'LangChain', 'Embeddings'],
    status: 'Beta',
  },
  {
    iconName: 'FileText',
    title: 'OCR Intelligence',
    desc: 'Extract, structure, and analyse text from any image or PDF using AI vision models.',
    color: '#f59e0b',
    tags: ['Vision API', 'OCR', 'NLP'],
    status: 'WIP',
  },
  {
    iconName: 'BarChart3',
    title: 'AI Analytics Engine',
    desc: 'Automated insights, anomaly detection, and predictive analytics from raw business data.',
    color: '#ec4899',
    tags: ['Python', 'Pandas', 'OpenAI'],
    status: 'Research',
  },
  {
    iconName: 'Search',
    title: 'Semantic Search',
    desc: 'Beyond keyword matching — semantic similarity search across large document corpora.',
    color: '#84ce24',
    tags: ['Embeddings', 'Vector DB', 'FAISS'],
    status: 'Prototype',
  },
]

const architecture = [
  { label: 'User Input', color: '#4361ee', x: 0 },
  { label: 'AI Router', color: '#7c3aed', x: 1 },
  { label: 'LangChain', color: '#a855f7', x: 2 },
  { label: 'Vector DB', color: '#06b6d4', x: 3 },
  { label: 'LLM (GPT-4)', color: '#ec4899', x: 4 },
  { label: 'Response', color: '#84ce24', x: 5 },
]

export default function AIShowcase() {
  const { isAdmin } = useAdminAuth()
  const [aiList, setAiList] = useState(initialAIProjects)
  const [activeFlow, setActiveFlow] = useState(-1)
  const ref = useRef(null)

  // Admin state
  const [adminKey, setAdminKey] = useState('admin123')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCard, setEditingCard] = useState(null)
  const [passcodeAttempt, setPasscodeAttempt] = useState('')
  const [authError, setAuthError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // AI Project Form
  const [form, setForm] = useState({
    title: '',
    desc: '',
    color: '#a855f7',
    status: 'Production',
    iconName: 'Brain',
    tagsInput: 'LangChain, OpenAI, RAG',
  })

  useEffect(() => {
    fetchAIShowcase(initialAIProjects).then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setAiList(data)
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

  // Animate pipeline on interval
  useEffect(() => {
    let step = -1
    const id = setInterval(() => {
      step = (step + 1) % (architecture.length + 2)
      setActiveFlow(step < architecture.length ? step : -1)
    }, 600)
    return () => clearInterval(id)
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

  const openEditModal = (item) => {
    setEditingCard(item)
    setForm({
      title: item.title,
      desc: item.desc,
      color: item.color || '#a855f7',
      status: item.status || 'Production',
      iconName: item.iconName || 'Brain',
      tagsInput: (item.tags || []).join(', '),
    })
  }

  const handleSaveAIProject = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.desc.trim()) return

    setIsSubmitting(true)
    const tagsArr = form.tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    const payload = {
      title: form.title.trim(),
      desc: form.desc.trim(),
      color: form.color || '#a855f7',
      status: form.status || 'Production',
      iconName: form.iconName || 'Brain',
      tags: tagsArr,
    }

    if (editingCard && editingCard._id) {
      const res = await updateAIShowcase(editingCard._id, payload, adminKey || 'admin123')
      setIsSubmitting(false)
      if (res.success && res.aiProject) {
        setAiList(prev => prev.map(a => (a._id === editingCard._id ? res.aiProject : a)))
      } else {
        setAiList(prev => prev.map(a => (a._id === editingCard._id ? { ...payload, _id: editingCard._id } : a)))
      }
    } else if (editingCard) {
      setAiList(prev => prev.map(a => (a.title === editingCard.title ? { ...payload } : a)))
      setIsSubmitting(false)
    } else {
      const res = await createAIShowcase(payload, adminKey || 'admin123')
      setIsSubmitting(false)
      if (res.success && res.aiProject) {
        setAiList(prev => [...prev, res.aiProject])
      } else {
        setAiList(prev => [...prev, { ...payload, _id: Date.now().toString() }])
      }
    }

    setShowAddModal(false)
    setEditingCard(null)
    setForm({ title: '', desc: '', color: '#a855f7', status: 'Production', iconName: 'Brain', tagsInput: 'LangChain, OpenAI, RAG' })
  }

  const handleDeleteAIProject = async (item) => {
    if (!window.confirm(`Delete AI project "${item.title}"?`)) return
    if (item._id) {
      await deleteAIShowcaseById(item._id, adminKey || 'admin123')
    }
    setAiList(prev => prev.filter(a => (a._id ? a._id !== item._id : a.title !== item.title)))
  }

  return (
    <section id="ai" className="relative py-24 px-6">
      <div ref={ref} className="section-hidden max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-purple-400 mb-4"
            style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
            AI SHOWCASE ({aiList.length})
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            AI <span className="gradient-text-warm">Engineering</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto mb-6 text-sm">
            Building the next generation of AI-native applications — from RAG systems to autonomous agents.
          </p>

          {/* Action Header bar: Add AI Project */}
          {isAdmin && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setEditingCard(null)
                  setForm({ title: '', desc: '', color: '#a855f7', status: 'Production', iconName: 'Brain', tagsInput: 'LangChain, OpenAI, RAG' })
                  setShowAddModal(true)
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 cursor-pointer shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  boxShadow: '0 0 20px rgba(168,85,247,0.4)',
                }}
              >
                <Plus size={16} /> + Add AI Project
              </button>
            </div>
          )}
        </div>

        {/* AI Pipeline visualization */}
        <div className="glass rounded-3xl p-6 mb-10 overflow-x-auto">
          <h3 className="text-white/50 text-xs font-mono tracking-widest mb-4">RAG PIPELINE ARCHITECTURE</h3>
          <div className="flex items-center justify-between gap-2 min-w-[500px]">
            {architecture.map((node, i) => (
              <div key={node.label} className="flex items-center gap-2">
                <div
                  className="flex flex-col items-center gap-1.5 transition-all duration-300"
                  style={{ opacity: activeFlow === i ? 1 : 0.4, transform: activeFlow === i ? 'scale(1.1)' : 'scale(1)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold font-mono"
                    style={{
                      background: activeFlow === i ? `${node.color}30` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${activeFlow === i ? node.color : 'rgba(255,255,255,0.1)'}`,
                      color: node.color,
                      boxShadow: activeFlow === i ? `0 0 16px ${node.color}50` : 'none',
                    }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs text-white/60 text-center leading-tight" style={{ maxWidth: 60 }}>
                    {node.label}
                  </span>
                </div>
                {i < architecture.length - 1 && (
                  <div
                    className="h-px flex-1 transition-all duration-300"
                    style={{
                      background: activeFlow > i ? `linear-gradient(90deg, ${architecture[i].color}, ${architecture[i+1].color})` : 'rgba(255,255,255,0.1)',
                      minWidth: 20,
                      opacity: activeFlow > i ? 1 : 0.3,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI project grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {aiList.map(item => {
            const Icon = iconMap[item.iconName] || Brain
            const color = item.color || '#a855f7'
            return (
              <div
                key={item._id || item.title}
                className="glass rounded-2xl p-5 group hover:bg-white/5 transition-all duration-300 hover:scale-[1.02] cursor-default relative"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ background: `${color}15`, border: `1px solid ${color}40` }}
                  >
                    <Icon size={20} style={{ color }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: `${color}20`, color }}>
                      {item.status || 'Production'}
                    </span>
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-colors"
                          title="Edit AI Project"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteAIProject(item)}
                          className="p-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
                          title="Delete AI Project"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed mb-4">{item.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(item.tags || []).map(t => (
                    <span key={t} className="px-2 py-0.5 rounded text-xs font-mono text-white/40"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* AI Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { icon: Zap, label: 'AI APIs Used', value: '5+', color: '#f59e0b' },
            { icon: GitBranch, label: 'AI Projects', value: `${aiList.length}+`, color: '#a855f7' },
            { icon: Brain, label: 'Models Integrated', value: '4', color: '#4361ee' },
            { icon: Database, label: 'Vector Indexes', value: '3', color: '#06b6d4' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass rounded-2xl p-4 text-center">
              <Icon size={18} style={{ color }} className="mx-auto mb-2" />
              <div className="text-2xl font-black text-white mb-0.5" style={{ color }}>{value}</div>
              <div className="text-xs text-white/40">{label}</div>
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
              <Lock size={22} className="text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Portfolio Owner Auth</h3>
            <p className="text-white/45 text-xs mb-5">Enter passcode to add/edit AI Showcase projects (Hint: admin123)</p>

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
                  style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Add or Edit AI Project Modal */}
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
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  {editingCard ? <Edit2 size={16} className="text-white" /> : <Plus size={16} className="text-white" />}
                </div>
                <h3 className="text-white font-bold text-lg">{editingCard ? `Edit ${editingCard.title}` : 'Add AI Showcase Project'}</h3>
              </div>
              <button onClick={() => {
                setShowAddModal(false)
                setEditingCard(null)
              }} className="p-1.5 glass rounded-xl text-white/50 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveAIProject} className="space-y-4">
              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">PROJECT TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vision Defect Detector"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">SHORT DESCRIPTION *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your AI model, pipeline, or RAG feature..."
                  value={form.desc}
                  onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">STATUS BADGE</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none bg-slate-900 border border-white/10"
                  >
                    <option value="Production">Production</option>
                    <option value="Live">Live</option>
                    <option value="Beta">Beta</option>
                    <option value="WIP">WIP</option>
                    <option value="Research">Research</option>
                    <option value="Prototype">Prototype</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">ICON</label>
                  <select
                    value={form.iconName}
                    onChange={e => setForm(f => ({ ...f, iconName: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none bg-slate-900 border border-white/10"
                  >
                    <option value="Brain">Brain 🧠</option>
                    <option value="Database">Database 💾</option>
                    <option value="MessageSquare">MessageSquare 💬</option>
                    <option value="FileText">FileText 📄</option>
                    <option value="BarChart3">BarChart3 📊</option>
                    <option value="Search">Search 🔍</option>
                    <option value="Zap">Zap ⚡</option>
                  </select>
                </div>
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
                <label className="text-white/40 text-xs font-mono block mb-1">TECH STACK TAGS (comma separated)</label>
                <input
                  type="text"
                  placeholder="LangChain, OpenAI, Vector DB"
                  value={form.tagsInput}
                  onChange={e => setForm(f => ({ ...f, tagsInput: e.target.value }))}
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
                  style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
                  {isSubmitting ? 'Saving to MongoDB...' : (editingCard ? 'Update AI Project' : 'Save AI Project')}
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
