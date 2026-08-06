import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ArrowDown, Download, Mail, ExternalLink, Code2, Upload, Lock, Unlock, FileText, CheckCircle, Edit2, Trash2, Plus, X } from 'lucide-react'
import { fetchHeroData, updateHeroData } from '../api.js'
import { useAdminAuth } from '../useAdminAuth'

const initialRoles = [
  'Full Stack Developer',
  'MERN Stack Developer',
  'AI Engineer',
  'Software Developer',
  'Problem Solver',
]

const initialTechOrbs = [
  { label: 'React', color: '#61dafb', angle: 0, radius: 120 },
  { label: 'Node.js', color: '#84ce24', angle: 72, radius: 120 },
  { label: 'MongoDB', color: '#47a248', angle: 144, radius: 120 },
  { label: 'AI', color: '#a855f7', angle: 216, radius: 120 },
  { label: 'TS', color: '#3178c6', angle: 288, radius: 120 },
]

export default function Hero() {
  const { isAdmin, login, logout } = useAdminAuth()
  const [roleIdx, setRoleIdx] = useState(0)
  const [typed, setTyped] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)
  const [animFrame, setAnimFrame] = useState(0)

  // Hero customizable data state
  const [heroName, setHeroName] = useState('Tek Narayan Yadav')
  const [heroTagline, setHeroTagline] = useState('I build scalable AI-powered web applications with modern user experiences that solve real-world problems.')
  const [resumeUrl, setResumeUrl] = useState('')
  const [resumeName, setResumeName] = useState('Tek Narayan Yadav.pdf')
  const [rolesList, setRolesList] = useState(initialRoles)
  const [techOrbsList, setTechOrbsList] = useState(initialTechOrbs)

  // Admin state
  const [adminKey, setAdminKey] = useState('admin123')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [showHeroEditModal, setShowHeroEditModal] = useState(false)
  const [passcodeAttempt, setPasscodeAttempt] = useState('')
  const [authError, setAuthError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreviewName, setFilePreviewName] = useState('')

  // Form state for Hero content editing
  const [heroForm, setHeroForm] = useState({
    name: 'Tek Narayan Yadav',
    tagline: 'I build scalable AI-powered web applications with modern user experiences that solve real-world problems.',
    rolesInput: 'Full Stack Developer, MERN Stack Developer, AI Engineer, Software Developer, Problem Solver',
  })
  const [editableOrbs, setEditableOrbs] = useState([])

  useEffect(() => {
    fetchHeroData({
      name: 'Tek Narayan Yadav',
      tagline: 'I build scalable AI-powered web applications with modern user experiences that solve real-world problems.',
      roles: initialRoles,
      techOrbs: initialTechOrbs,
      resumeUrl: '',
      resumeName: 'Tek Narayan Yadav.pdf',
    }).then(data => {
      if (data) {
        if (data.name) setHeroName(data.name)
        if (data.tagline) setHeroTagline(data.tagline)
        if (Array.isArray(data.roles) && data.roles.length > 0) setRolesList(data.roles)
        if (Array.isArray(data.techOrbs) && data.techOrbs.length > 0) setTechOrbsList(data.techOrbs)
        if (data.resumeUrl) setResumeUrl(data.resumeUrl)
        if (data.resumeName) setResumeName(data.resumeName || 'Tek Narayan Yadav.pdf')
      }
    })
  }, [])

  // Typewriter effect
  useEffect(() => {
    const target = rolesList[roleIdx] || rolesList[0] || 'Full Stack Developer'
    let timeout

    if (!deleting && typed.length < target.length) {
      timeout = setTimeout(() => setTyped(target.slice(0, typed.length + 1)), 70)
    } else if (!deleting && typed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && typed.length > 0) {
      timeout = setTimeout(() => setTyped(typed.slice(0, -1)), 35)
    } else if (deleting && typed.length === 0) {
      setDeleting(false)
      setRoleIdx((i) => (i + 1) % rolesList.length)
    }

    return () => clearTimeout(timeout)
  }, [typed, deleting, roleIdx, rolesList])

  // Event listener for opening admin auth modal secretly (via Ctrl+Shift+A or Command Palette)
  useEffect(() => {
    const handleOpenAuth = () => {
      if (!isAdmin) setShowAuthModal(true)
    }
    window.addEventListener('open-admin-modal', handleOpenAuth)
    return () => window.removeEventListener('open-admin-modal', handleOpenAuth)
  }, [isAdmin])

  // Mouse parallax
  useEffect(() => {
    const onMouse = (e) => {
      const { innerWidth, innerHeight } = window
      setMousePos({
        x: (e.clientX - innerWidth / 2) / innerWidth,
        y: (e.clientY - innerHeight / 2) / innerHeight,
      })
    }
    window.addEventListener('mousemove', onMouse)
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  // Orbit animation frame
  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => f + 1), 50)
    return () => clearInterval(id)
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

  const openHeroEditModal = () => {
    setHeroForm({
      name: heroName,
      tagline: heroTagline,
      rolesInput: rolesList.join(', '),
    })
    setEditableOrbs(techOrbsList.map(o => ({ label: o.label, color: o.color || '#4361ee' })))
    setShowHeroEditModal(true)
  }

  const handleAddOrb = () => {
    setEditableOrbs(prev => [...prev, { label: 'New Letter', color: '#06b6d4' }])
  }

  const handleOrbChange = (idx, field, value) => {
    setEditableOrbs(prev => prev.map((o, i) => i === idx ? { ...o, [field]: value } : o))
  }

  const handleDeleteOrb = (idx) => {
    setEditableOrbs(prev => prev.filter((_, i) => i !== idx))
  }

  const handleQuickDeleteOrb = async (idx) => {
    const updated = techOrbsList.filter((_, i) => i !== idx)
    const parsedOrbs = updated.map((o, i, arr) => ({
      ...o,
      angle: Math.round(i * (360 / Math.max(1, arr.length))),
    }))
    setTechOrbsList(parsedOrbs)

    const payload = {
      name: heroName,
      tagline: heroTagline,
      roles: rolesList,
      techOrbs: parsedOrbs,
      resumeUrl,
      resumeName,
    }
    await updateHeroData(payload, adminKey || 'admin123')
  }

  const handleSaveHeroContent = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const parsedRoles = heroForm.rolesInput.split(',').map(r => r.trim()).filter(Boolean)
    const parsedOrbs = editableOrbs
      .filter(o => o.label.trim().length > 0)
      .map((o, idx, arr) => ({
        label: o.label.trim(),
        color: o.color || '#4361ee',
        angle: Math.round(idx * (360 / Math.max(1, arr.length))),
        radius: 120,
      }))

    const payload = {
      name: heroForm.name.trim(),
      tagline: heroForm.tagline.trim(),
      roles: parsedRoles.length > 0 ? parsedRoles : rolesList,
      techOrbs: parsedOrbs.length > 0 ? parsedOrbs : techOrbsList,
      resumeUrl,
      resumeName,
    }

    await updateHeroData(payload, adminKey || 'admin123')
    setIsSubmitting(false)

    setHeroName(heroForm.name.trim())
    setHeroTagline(heroForm.tagline.trim())
    if (parsedRoles.length > 0) setRolesList(parsedRoles)
    setTechOrbsList(parsedOrbs)

    setShowHeroEditModal(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setSelectedFile(file)
    setFilePreviewName(file.name)
  }

  const handleUploadResumeSubmit = (e) => {
    e.preventDefault()
    if (!selectedFile) return

    setIsSubmitting(true)
    const reader = new FileReader()
    reader.onload = async () => {
      const base64Url = reader.result
      const ext = selectedFile.name ? selectedFile.name.split('.').pop() : 'pdf'
      const fileName = `Tek Narayan Yadav.${ext}`

      const payload = {
        name: heroName,
        tagline: heroTagline,
        roles: rolesList,
        techOrbs: techOrbsList,
        resumeUrl: base64Url,
        resumeName: fileName,
      }

      await updateHeroData(payload, adminKey || 'admin123')
      setIsSubmitting(false)

      setResumeUrl(base64Url)
      setResumeName(fileName)
      setUploadSuccess(true)

      setTimeout(() => {
        setUploadSuccess(false)
        setShowResumeModal(false)
        setSelectedFile(null)
        setFilePreviewName('')
      }, 1500)
    }
    reader.readAsDataURL(selectedFile)
  }

  const generateFallbackResumeBlob = () => {
    const content = `===================================================================
                       TEK NARAYAN YADAV
           Full Stack Developer & AI Engineer
           Email: teknarayan2456@gmail.com | Location: India
           GitHub: https://github.com/teknarayanyadav
===================================================================

SUMMARY:
Passionate Full Stack Developer and AI Engineer specializing in modern MERN stack web applications and AI integrations (OpenAI API, LangChain, Pinecone, RAG architectures). Proven track record of delivering high-performance, scalable web systems.

CORE TECHNICAL SKILLS:
- Frontend: React, TypeScript, Next.js, HTML5, CSS3, Tailwind CSS, Vite, Canvas/Three.js
- Backend: Node.js, Express.js, RESTful APIs, GraphQL, Microservices
- Databases: MongoDB, Redis, PostgreSQL
- AI / ML: OpenAI GPT-4, LangChain, Pinecone Vector DB, RAG Systems, Prompt Engineering
- DevOps & Tools: Docker, Git, GitHub Actions, CI/CD, Render, Vercel

KEY PROJECTS:
1. Production AI ERP System:
   - Built an AI-powered Enterprise Resource Planning suite featuring natural language database queries via LangChain + GPT-4.
   - Reduced query resolution time by over 70%.

2. MERN E-Commerce & Healthcare Platforms:
   - Developed scalable web services handling 500+ concurrent real-time transactions with Redis caching & MongoDB indexing.

3. Interactive 3D Portfolio & Developer Suite:
   - Engineered modern web application with real-time AI recruiter evaluation, live code runner, and glassmorphic UI.

EDUCATION & CERTIFICATIONS:
- Bachelor of Technology in Computer Science
- Certified MERN Stack & AI Application Developer

===================================================================
`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    return URL.createObjectURL(blob)
  }

  const handleDownloadResume = (e) => {
    if (!resumeUrl) {
      e.preventDefault()
      const tempUrl = generateFallbackResumeBlob()
      const a = document.createElement('a')
      a.href = tempUrl
      a.download = 'Tek Narayan Yadav.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(tempUrl), 2000)
    }
  }

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const t = animFrame * 0.015

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg"
    >
      {/* Glowing orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(67,97,238,0.15) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) translate(${mousePos.x * -30}px, ${mousePos.y * -20}px)`,
          transition: 'transform 0.5s ease',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
          top: '30%',
          right: '15%',
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 15}px)`,
          transition: 'transform 0.6s ease',
          filter: 'blur(60px)',
        }}
      />

      {/* Stars */}
      <Stars />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 pt-20">
        {/* Left: Text */}
        <div className="flex-1 text-center lg:text-left">
          {/* Badge & Owner Auth toggle */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: 'rgba(67,97,238,0.15)',
                border: '1px solid rgba(67,97,238,0.3)',
                color: '#93c5fd',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-glow" />
              Available for opportunities
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start">
                <button
                  onClick={openHeroEditModal}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono border transition-all cursor-pointer bg-blue-500/15 border-blue-500/30 text-blue-300 hover:bg-blue-500/30 shadow-lg"
                >
                  <Edit2 size={13} /> Edit Home & Floating Badges
                </button>
                <button
                  onClick={() => setShowResumeModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono border transition-all cursor-pointer bg-cyan-500/15 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30"
                >
                  <Upload size={13} /> Upload Resume
                </button>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono text-emerald-400 glass cursor-pointer hover:bg-emerald-500/20 transition-all"
                  title="Admin Unlocked — Click to Lock"
                >
                  <Unlock size={12} /> Admin Active
                </button>
              </div>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-4 tracking-tight text-white">
            Hi, I'm{' '}
            <span className="gradient-text">{heroName}</span>
          </h1>

          {/* Typewriter */}
          <div className="h-12 sm:h-14 flex items-center justify-center lg:justify-start mb-6">
            <span className="text-2xl sm:text-3xl font-semibold text-cyan-400 font-mono">
              {typed}
              <span className="typewriter-cursor" />
            </span>
          </div>

          <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
            {heroTagline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <button
              onClick={scrollToProjects}
              className="px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #4361ee, #7c3aed)',
                boxShadow: '0 0 24px rgba(67,97,238,0.45)',
              }}
            >
              <ExternalLink size={16} /> View Projects
            </button>

            <button
              onClick={scrollToContact}
              className="px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2 glass hover:bg-white/10 transition-all hover:scale-105 cursor-pointer"
            >
              <Mail size={16} /> Contact Me
            </button>

            {/* Direct Resume Download Button */}
            <a
              href={resumeUrl || '#'}
              download={resumeName}
              onClick={handleDownloadResume}
              className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer shadow-lg"
              style={{
                border: '1px solid rgba(6,182,212,0.4)',
                color: '#06b6d4',
                background: 'rgba(6,182,212,0.1)',
                boxShadow: '0 0 20px rgba(6,182,212,0.25)',
              }}
              title={resumeUrl ? `Download ${resumeName}` : 'Click to Download Resume'}
            >
              <Download size={16} /> Download Resume
            </a>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4 mt-8 justify-center lg:justify-start">
            {[
              { icon: Code2, href: 'https://github.com/teknarayanyadav', label: 'GitHub' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl glass hover:bg-white/10 text-white/60 hover:text-white transition-all hover:scale-110"
              >
                <Icon size={18} />
              </a>
            ))}
            <span className="text-white/30 text-sm">@teknarayanyadav</span>
          </div>
        </div>

        {/* Right: 3D-ish orbit scene */}
        <div className="flex-shrink-0 relative w-72 h-72 lg:w-96 lg:h-96">
          {/* Central avatar */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 lg:w-36 lg:h-36 rounded-full z-10 flex items-center justify-center text-5xl font-black"
            style={{
              background: 'linear-gradient(135deg, #4361ee, #a855f7)',
              boxShadow: '0 0 50px rgba(67,97,238,0.6), 0 0 100px rgba(168,85,247,0.3)',
              transform: `translate(-50%, -50%) translate(${mousePos.x * -8}px, ${mousePos.y * -5}px)`,
            }}
          >
            <span className="text-white">{heroName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'TN'}</span>
          </div>

          {/* Inner ring */}
          <div
            className="absolute top-1/2 left-1/2 rounded-full animate-spin-slow"
            style={{
              width: 200,
              height: 200,
              marginLeft: -100,
              marginTop: -100,
              border: '1px solid rgba(67,97,238,0.25)',
            }}
          />

          {/* Outer ring */}
          <div
            className="absolute top-1/2 left-1/2 rounded-full animate-spin-reverse"
            style={{
              width: 300,
              height: 300,
              marginLeft: -150,
              marginTop: -150,
              border: '1px solid rgba(168,85,247,0.15)',
            }}
          />

          {/* Orbiting tech labels / floating letters */}
          {techOrbsList.map((orb, i) => {
            const angle = (orb.angle * Math.PI) / 180 + t * (i % 2 === 0 ? 1 : -0.7)
            const r = (orb.radius || 120) * (window.innerWidth < 1024 ? 0.75 : 1)
            const x = Math.cos(angle) * r
            const y = Math.sin(angle) * r
            return (
              <div
                key={orb.label + i}
                onClick={() => isAdmin && openHeroEditModal()}
                className={`absolute top-1/2 left-1/2 flex items-center gap-1.5 rounded-xl text-xs font-bold font-mono px-2.5 py-1.5 glass transition-all ${isAdmin ? 'cursor-pointer hover:scale-110 group/orb border border-cyan-400/40' : ''}`}
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  color: orb.color,
                  border: `1px solid ${orb.color}40`,
                  background: `${orb.color}15`,
                  boxShadow: `0 0 12px ${orb.color}30`,
                  whiteSpace: 'nowrap',
                }}
                title={isAdmin ? `Click to edit floating letters / badges` : orb.label}
              >
                <span>{orb.label}</span>
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleQuickDeleteOrb(i)
                    }}
                    className="opacity-0 group-hover/orb:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-500/30 text-red-400 cursor-pointer"
                    title={`Delete "${orb.label}" floating badge`}
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToProjects}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors z-10"
        style={{ animation: 'scroll-bounce 2s ease-in-out infinite' }}
      >
        <span className="text-xs font-mono tracking-widest">SCROLL</span>
        <ArrowDown size={16} />
      </button>

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
            <p className="text-white/45 text-xs mb-5">Enter passcode to edit home page & floating letters (Hint: admin123)</p>

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

      {/* Edit Home Page & Floating Letters Modal (Admin Only) */}
      {showHeroEditModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setShowHeroEditModal(false)}>
          <div className="glass-strong rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-7 cmd-panel"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Edit2 size={16} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">Edit Home Page & Floating Badges</h3>
              </div>
              <button onClick={() => setShowHeroEditModal(false)} className="p-1.5 glass rounded-xl text-white/50 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveHeroContent} className="space-y-4">
              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">DEVELOPER NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tek Narayan Yadav"
                  value={heroForm.name}
                  onChange={e => setHeroForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">TYPEWRITER ROLES (comma separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="Full Stack Developer, MERN Stack Developer, AI Engineer"
                  value={heroForm.rolesInput}
                  onChange={e => setHeroForm(f => ({ ...f, rolesInput: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">HERO TAGLINE / BIO *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="I build scalable AI-powered web applications..."
                  value={heroForm.tagline}
                  onChange={e => setHeroForm(f => ({ ...f, tagline: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              {/* Floating Letters & Tech Badges Manager */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-white/40 text-xs font-mono block">
                    FLOATING ANIMATED LETTERS & BADGES ({editableOrbs.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddOrb}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30 transition-all hover:bg-cyan-500/20"
                  >
                    <Plus size={12} /> + Add Floating Badge
                  </button>
                </div>

                <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                  {editableOrbs.map((orb, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl glass border border-white/10">
                      {/* Live Badge Preview */}
                      <span
                        className="text-xs font-bold font-mono px-2 py-1 rounded-lg flex-shrink-0"
                        style={{
                          color: orb.color || '#61dafb',
                          background: `${orb.color || '#61dafb'}20`,
                          border: `1px solid ${orb.color || '#61dafb'}40`,
                        }}
                      >
                        {orb.label || 'Letter'}
                      </span>

                      {/* Label Input */}
                      <input
                        type="text"
                        placeholder="Letter / Label (e.g. React, JS)"
                        value={orb.label}
                        onChange={e => handleOrbChange(idx, 'label', e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg text-white text-xs outline-none bg-white/5 border border-white/10"
                      />

                      {/* Color Picker & Hex Code */}
                      <div className="flex items-center gap-1">
                        <input
                          type="color"
                          value={orb.color || '#4361ee'}
                          onChange={e => handleOrbChange(idx, 'color', e.target.value)}
                          className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                          title="Pick Glow Color"
                        />
                        <input
                          type="text"
                          value={orb.color || '#4361ee'}
                          onChange={e => handleOrbChange(idx, 'color', e.target.value)}
                          className="w-20 px-2 py-1.5 rounded-lg text-white font-mono text-xs outline-none bg-white/5 border border-white/10"
                          placeholder="#color"
                        />
                      </div>

                      {/* Delete Badge Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteOrb(idx)}
                        className="p-1.5 text-red-400/80 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                        title="Delete this floating letter/badge"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  {editableOrbs.length === 0 && (
                    <p className="text-white/40 text-xs text-center py-3 font-mono">
                      No floating badges active. Click "+ Add Floating Badge" above to create floating letters!
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowHeroEditModal(false)}
                  className="flex-1 py-3 rounded-xl glass text-white/50 font-semibold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl font-semibold text-white cursor-pointer transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #4361ee, #7c3aed)' }}>
                  {isSubmitting ? 'Saving to MongoDB...' : 'Save & Update Home Page'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Upload Resume Modal */}
      {showResumeModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setShowResumeModal(false)}>
          <div className="glass-strong rounded-3xl max-w-md w-full p-7 cmd-panel"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Upload size={16} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">Upload Resume File</h3>
              </div>
              <button onClick={() => setShowResumeModal(false)} className="p-1.5 glass rounded-xl text-white/50 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto border border-green-500/30">
                  <CheckCircle size={26} />
                </div>
                <h4 className="text-white font-bold text-lg">Resume Uploaded Successfully!</h4>
                <p className="text-white/50 text-xs">
                  Visitors can now click "Download Resume" on your portfolio home page to download your attached file!
                </p>
              </div>
            ) : (
              <form onSubmit={handleUploadResumeSubmit} className="space-y-4">
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-2">SELECT RESUME FILE (.pdf, .doc, .docx)</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all hover:bg-white/5"
                    style={{ borderColor: 'rgba(6,182,212,0.3)', background: 'rgba(6,182,212,0.04)' }}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText size={28} className="text-cyan-400 mb-2" />
                      <p className="mb-1 text-xs text-white/70">
                        <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-[11px] text-white/30 font-mono">
                        {filePreviewName || 'PDF, DOCX up to 10MB'}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      required
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {resumeName && (
                  <div className="p-3 rounded-xl glass text-xs text-white/60 flex items-center justify-between border border-white/10">
                    <span className="font-mono text-cyan-400">Active Resume:</span>
                    <span className="truncate max-w-[200px]">{resumeName}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-3">
                  <button type="button" onClick={() => setShowResumeModal(false)}
                    className="flex-1 py-3 rounded-xl glass text-white/50 font-semibold cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting || !selectedFile}
                    className="flex-1 py-3 rounded-xl font-semibold text-white cursor-pointer transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #4361ee)' }}>
                    {isSubmitting ? 'Uploading File...' : 'Attach Resume'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}

function Stars() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 4,
    minOpacity: 0.1 + Math.random() * 0.3,
  }))

  return (
    <>
      {stars.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            '--duration': `${s.duration}s`,
            '--delay': `${s.delay}s`,
            '--min-opacity': s.minOpacity,
          }}
        />
      ))}
    </>
  )
}

