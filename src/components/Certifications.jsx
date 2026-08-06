import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Award, X, Download, ExternalLink, Plus, Lock, Unlock, Trash2, Image, Upload } from 'lucide-react'
import { fetchCertifications, createCertification, deleteCertificationById } from '../api.js'
import { useAdminAuth } from '../useAdminAuth.js'

const initialCerts = [
  {
    title: 'Full Stack Web Development',
    issuer: 'Coursera · Meta',
    date: 'Dec 2023',
    category: 'Full Stack',
    color: '#4361ee',
    gradient: 'from-blue-600 to-blue-800',
    credentialId: 'META-FS-2023-7821',
    imageUrl: '',
    skills: ['React', 'Node.js', 'MongoDB', 'Express'],
    verified: true,
  },
  {
    title: 'AI & Machine Learning Fundamentals',
    issuer: 'DeepLearning.AI',
    date: 'Mar 2024',
    category: 'AI / ML',
    color: '#a855f7',
    gradient: 'from-purple-600 to-purple-800',
    credentialId: 'DL-AI-2024-1193',
    imageUrl: '',
    skills: ['Neural Networks', 'NLP', 'LLMs', 'RAG'],
    verified: true,
  },
  {
    title: 'LangChain & LLM Development',
    issuer: 'Udemy · Verified',
    date: 'May 2024',
    category: 'AI / ML',
    color: '#06b6d4',
    gradient: 'from-cyan-600 to-blue-700',
    credentialId: 'UDM-LC-2024-5542',
    imageUrl: '',
    skills: ['LangChain', 'Agents', 'Vector DB', 'RAG'],
    verified: true,
  },
  {
    title: 'MongoDB Developer Associate',
    issuer: 'MongoDB University',
    date: 'Aug 2023',
    category: 'Database',
    color: '#47a248',
    gradient: 'from-green-600 to-emerald-800',
    credentialId: 'MGDB-DEV-2023-0884',
    imageUrl: '',
    skills: ['Aggregation', 'Indexing', 'Schema Design'],
    verified: true,
  },
  {
    title: 'React & Advanced Patterns',
    issuer: 'Frontend Masters',
    date: 'Jan 2024',
    category: 'Frontend',
    color: '#61dafb',
    gradient: 'from-cyan-500 to-blue-600',
    credentialId: 'FEM-RCT-2024-3301',
    imageUrl: '',
    skills: ['Hooks', 'Context', 'Performance', 'Testing'],
    verified: true,
  },
  {
    title: 'Docker & Kubernetes Essentials',
    issuer: 'Linux Foundation',
    date: 'Oct 2023',
    category: 'DevOps',
    color: '#2496ed',
    gradient: 'from-blue-500 to-blue-700',
    credentialId: 'LF-DK-2023-6617',
    imageUrl: '',
    skills: ['Containers', 'Orchestration', 'CI/CD'],
    verified: true,
  },
]

export default function Certifications() {
  const { isAdmin } = useAdminAuth()
  const [certList, setCertList] = useState(initialCerts)
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [adminKey, setAdminKey] = useState('admin123')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [passcodeAttempt, setPasscodeAttempt] = useState('')
  const [authError, setAuthError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const ref = useRef(null)

  // Form state
  const [form, setForm] = useState({
    title: '',
    issuer: '',
    date: '',
    category: 'Full Stack',
    color: '#4361ee',
    gradient: 'from-blue-600 to-blue-800',
    credentialId: '',
    imageUrl: '',
    skills: '',
    verified: true,
  })

  useEffect(() => {
    fetchCertifications(initialCerts).then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setCertList(data)
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

  const handleImageFileUpload = (e) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm(f => ({ ...f, imageUrl: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateCert = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.issuer.trim()) return

    setIsSubmitting(true)
    const newCertData = {
      ...form,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      credentialId: form.credentialId || `CERT-${Date.now().toString().slice(-6)}`,
      date: form.date || '2024',
    }

    const res = await createCertification(newCertData, adminKey || 'admin123')
    setIsSubmitting(false)

    if (res.success && res.cert) {
      setCertList(prev => [res.cert, ...prev])
      setShowAddModal(false)
      setForm({
        title: '',
        issuer: '',
        date: '',
        category: 'Full Stack',
        color: '#4361ee',
        gradient: 'from-blue-600 to-blue-800',
        credentialId: '',
        imageUrl: '',
        skills: '',
        verified: true,
      })
    } else {
      // Local fallback
      const tempCert = { ...newCertData, _id: Date.now().toString() }
      setCertList(prev => [tempCert, ...prev])
      setShowAddModal(false)
    }
  }

  const handleDeleteCert = async (cert) => {
    if (!window.confirm(`Delete certificate "${cert.title}"?`)) return
    if (cert._id) {
      await deleteCertificationById(cert._id, adminKey || 'admin123')
    }
    setCertList(prev => prev.filter(c => (c._id ? c._id !== cert._id : c.title !== cert.title)))
  }

  const categories = ['All', 'Full Stack', 'AI / ML', 'Frontend', 'Database', 'DevOps']
  const filtered = filter === 'All' ? certList : certList.filter(c => c.category === filter)

  return (
    <section id="certifications" className="relative py-24 px-6">
      <div ref={ref} className="section-hidden max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-amber-400 mb-4"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
            CERTIFICATIONS ({certList.length})
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Verified <span className="gradient-text">Credentials</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto mb-6">
            Industry-recognized certifications validating expertise in full-stack development, AI, and cloud.
          </p>

          {/* Action Header bar: Add Certification */}
          {isAdmin && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105 cursor-pointer shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #4361ee)',
                  boxShadow: '0 0 20px rgba(245,158,11,0.3)',
                }}
              >
                <Plus size={16} /> + Add Certification
              </button>
            </div>
          )}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer"
              style={filter === c
                ? { background: 'linear-gradient(135deg, #4361ee, #7c3aed)', color: 'white' }
                : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }
              }>
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(cert => (
            <div
              key={cert._id || cert.title}
              onClick={() => setSelected(cert)}
              className="glass rounded-2xl overflow-hidden cursor-pointer group hover:scale-[1.03] transition-all duration-300 relative"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {/* Certificate graphic / Image */}
              <div
                className={`relative h-32 ${cert.imageUrl ? 'bg-slate-950' : `bg-gradient-to-br ${cert.gradient || 'from-blue-600 to-blue-800'}`} flex items-center justify-center overflow-hidden`}
                style={{ boxShadow: `inset 0 -20px 40px rgba(0,0,0,0.4)` }}
              >
                {cert.imageUrl ? (
                  <img
                    src={cert.imageUrl}
                    alt={cert.title}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ) : (
                  <>
                    <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border border-white/10" />
                    <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full border border-white/15" />
                    <Award size={42} className="text-white/80 group-hover:scale-110 transition-transform" />
                  </>
                )}

                {cert.verified && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-mono border border-white/10 z-10">
                    ✓ Verified
                  </div>
                )}
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteCert(cert)
                    }}
                    className="absolute top-3 left-3 p-1.5 rounded-lg bg-red-500/40 text-white hover:bg-red-500/70 transition-colors z-10"
                    title="Delete Certification"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: `${cert.color || '#4361ee'}20`, color: cert.color || '#4361ee' }}>
                    {cert.category}
                  </span>
                  <span className="text-white/30 text-xs font-mono">{cert.date}</span>
                </div>
                <h3 className="text-white font-bold mt-2 leading-tight">{cert.title}</h3>
                <p className="text-white/45 text-xs mt-1">{cert.issuer}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {(cert.skills || []).slice(0, 3).map(s => (
                    <span key={s} className="px-2 py-0.5 rounded text-xs text-white/35 font-mono"
                      style={{ background: 'rgba(255,255,255,0.04)' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
              <Lock size={22} className="text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Portfolio Owner Auth</h3>
            <p className="text-white/45 text-xs mb-5">Enter passcode to add/delete certifications (Hint: admin123)</p>

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

      {/* Add Certification Modal */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setShowAddModal(false)}>
          <div className="glass-strong rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-7 cmd-panel"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-blue-600 flex items-center justify-center">
                  <Plus size={16} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">Add Verified Certification</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 glass rounded-xl text-white/50 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCert} className="space-y-4">
              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">CERTIFICATE TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">ISSUER *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon Web Services · Verified"
                  value={form.issuer}
                  onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">ISSUE DATE</label>
                  <input
                    type="text"
                    placeholder="e.g. Nov 2024"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">CATEGORY</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none bg-slate-900 border border-white/10"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">CREDENTIAL ID</label>
                <input
                  type="text"
                  placeholder="e.g. AWS-SOL-2024-8841"
                  value={form.credentialId}
                  onChange={e => setForm(f => ({ ...f, credentialId: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              {/* CERTIFICATE IMAGE FILE UPLOAD OR URL */}
              <div>
                <label className="text-white/40 text-xs font-mono flex items-center justify-between block mb-1">
                  <span className="flex items-center gap-1"><Image size={12} /> CERTIFICATE IMAGE (FILE OR URL)</span>
                  {form.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, imageUrl: '' }))}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      Clear Image
                    </button>
                  )}
                </label>

                {/* Upload File Box */}
                <div className="mb-2">
                  <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/20 hover:border-amber-400/60 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-xs text-white/70">
                    <Upload size={14} className="text-amber-400" />
                    <span>Upload Certificate Image File (.png, .jpg, .webp)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Image URL text fallback */}
                <input
                  type="text"
                  placeholder="Or paste Image URL (https://...)"
                  value={form.imageUrl}
                  onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl text-white placeholder-white/20 text-xs outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />

                {/* Instant Image Preview Thumbnail */}
                {form.imageUrl && (
                  <div className="mt-3 relative rounded-xl overflow-hidden h-28 border border-amber-400/40 bg-slate-950">
                    <img src={form.imageUrl} alt="Certificate preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-2 px-2 py-0.5 rounded bg-black/70 text-white/80 text-[10px] font-mono">
                      Image Loaded Preview
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">VALIDATED SKILLS (comma separated)</label>
                <input
                  type="text"
                  placeholder="Cloud Architecture, EC2, S3, IAM, Serverless"
                  value={form.skills}
                  onChange={e => setForm(f => ({ ...f, skills: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
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
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #4361ee)' }}>
                  {isSubmitting ? 'Saving to MongoDB...' : 'Save Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Detail modal via portal */}
      {selected && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
          onClick={() => setSelected(null)}>
          <div className="glass-strong rounded-3xl max-w-lg w-full overflow-hidden cmd-panel"
            onClick={e => e.stopPropagation()}>
            <div className={`relative ${selected.imageUrl ? 'h-52 bg-slate-950' : `h-36 bg-gradient-to-br ${selected.gradient || 'from-blue-600 to-blue-800'}`} flex items-center justify-center overflow-hidden`}>
              {selected.imageUrl ? (
                <img src={selected.imageUrl} alt={selected.title} className="w-full h-full object-cover" />
              ) : (
                <Award size={52} className="text-white/80" />
              )}
              {selected.verified && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-mono border border-white/10 z-10">
                  ✓ Verified
                </div>
              )}
              <button onClick={() => setSelected(null)}
                className="absolute top-3 left-3 p-1.5 rounded-xl bg-black/40 text-white/70 hover:text-white cursor-pointer z-10">
                <X size={14} />
              </button>
            </div>
            <div className="p-6">
              <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: `${selected.color || '#4361ee'}20`, color: selected.color || '#4361ee' }}>
                {selected.category}
              </span>
              <h3 className="text-xl font-bold text-white mt-2 mb-0.5">{selected.title}</h3>
              <p className="text-white/50 text-sm mb-1">{selected.issuer}</p>
              <p className="text-white/30 text-xs font-mono mb-4">Issued: {selected.date}</p>

              <div className="p-3 rounded-xl mb-4 font-mono text-xs text-white/50"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                Credential ID: {selected.credentialId}
              </div>

              <h4 className="text-white/40 text-xs font-mono tracking-widest mb-2">SKILLS VALIDATED</h4>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {(selected.skills || []).map(s => (
                  <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-mono glass"
                    style={{ color: selected.color || '#4361ee', border: `1px solid ${(selected.color || '#4361ee')}30` }}>
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 text-sm cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${selected.color || '#4361ee'}, ${(selected.color || '#4361ee')}99)` }}>
                  <ExternalLink size={14} /> Verify
                </button>
                <button className="flex-1 py-2.5 rounded-xl font-semibold glass text-white/60 hover:text-white flex items-center justify-center gap-2 text-sm cursor-pointer">
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}
