import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, Star, Plus, MessageSquarePlus, Lock, Unlock, Trash2, X, HeartHandshake } from 'lucide-react'
import { fetchTestimonials, createTestimonial, deleteTestimonialById } from '../api.js'
import { useAdminAuth } from '../useAdminAuth'

const initialTestimonials = [
  {
    name: 'Priya Sharma',
    role: 'CTO',
    company: 'TechStartup AI',
    avatar: 'PS',
    avatarColor: '#4361ee',
    rating: 5,
    review:
      'Tek Narayan built our AI ERP system from scratch in just 3 months. The natural language query feature alone saved our team 10+ hours a week. Exceptional technical depth and fast delivery.',
    highlight: 'Natural language query saved us 10+ hours/week',
  },
  {
    name: 'Rohan Mehta',
    role: 'Engineering Manager',
    company: 'HealthTech Corp',
    avatar: 'RM',
    avatarColor: '#06b6d4',
    rating: 5,
    review:
      'We hired Tek Narayan for our medical store platform. His code quality, documentation, and communication were all top-notch. He anticipated edge cases we hadn\'t even thought of.',
    highlight: 'Anticipated edge cases we hadn\'t even thought of',
  },
  {
    name: 'Ananya Gupta',
    role: 'Product Manager',
    company: 'FoodTech Ventures',
    avatar: 'AG',
    avatarColor: '#a855f7',
    rating: 5,
    review:
      'The real-time food delivery platform Tek Narayan built handles 500+ concurrent orders flawlessly. His architecture decisions were exactly right for our scale. Highly recommended.',
    highlight: 'Handles 500+ concurrent orders flawlessly',
  },
  {
    name: 'Dr. Vikram Singh',
    role: 'Founder',
    company: 'AI Research Lab',
    avatar: 'VS',
    avatarColor: '#ec4899',
    rating: 5,
    review:
      'Tek Narayan integrated our LangChain RAG pipeline with the existing infrastructure seamlessly. His AI knowledge is genuinely impressive — he understood our requirements immediately.',
    highlight: 'AI knowledge is genuinely impressive',
  },
  {
    name: 'Kavya Reddy',
    role: 'Senior Developer',
    company: 'SaaS Platform Co.',
    avatar: 'KR',
    avatarColor: '#f59e0b',
    rating: 5,
    review:
      'Collaborated with Tek Narayan on an open-source project. His code is clean, well-structured, and he reviews PRs with great care. A developer who genuinely cares about quality.',
    highlight: 'Code is clean, well-structured, reviews with great care',
  },
]

export default function Testimonials() {
  const [list, setList] = useState(initialTestimonials)
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)

  // Admin state
  const { isAdmin } = useAdminAuth()
  const [adminKey, setAdminKey] = useState('admin123')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [passcodeAttempt, setPasscodeAttempt] = useState('')
  const [authError, setAuthError] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const ref = useRef(null)
  const autoRef = useRef()

  // Visitor Review Form state
  const [form, setForm] = useState({
    name: '',
    role: '',
    company: '',
    rating: 5,
    review: '',
    highlight: '',
  })

  useEffect(() => {
    fetchTestimonials(initialTestimonials).then(data => {
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

  const startAuto = () => {
    autoRef.current = setInterval(() => go(1), 6000)
  }

  useEffect(() => {
    startAuto()
    return () => clearInterval(autoRef.current)
  }, [current, list.length])

  const go = (dir) => {
    if (animating || list.length === 0) return
    clearInterval(autoRef.current)
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setCurrent(c => (c + dir + list.length) % list.length)
      setAnimating(false)
    }, 250)
  }

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

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.review.trim()) return

    setIsSubmitting(true)
    const newReviewData = {
      name: form.name.trim(),
      role: form.role ? form.role.trim() : 'Visitor',
      company: form.company ? form.company.trim() : 'Portfolio Visitor',
      rating: form.rating,
      review: form.review.trim(),
      highlight: form.highlight ? form.highlight.trim() : (form.review.trim().slice(0, 40) + '...'),
    }

    const res = await createTestimonial(newReviewData)
    setIsSubmitting(false)

    if (res.success && res.testimonial) {
      setList(prev => [...prev, res.testimonial])
      setCurrent(list.length) // Jump to newly added review card!
    } else {
      // Local fallback
      const tempReview = {
        ...newReviewData,
        _id: Date.now().toString(),
        avatar: form.name.slice(0, 2).toUpperCase(),
        avatarColor: '#06b6d4',
      }
      setList(prev => [...prev, tempReview])
      setCurrent(list.length)
    }

    setSubmitSuccess(true)
    setTimeout(() => {
      setSubmitSuccess(false)
      setShowReviewModal(false)
      setForm({ name: '', role: '', company: '', rating: 5, review: '', highlight: '' })
    }, 1500)
  }

  const handleDeleteTestimonial = async (t) => {
    if (!window.confirm(`Delete review from "${t.name}"?`)) return
    if (t._id) {
      await deleteTestimonialById(t._id, adminKey || 'admin123')
    }
    const newList = list.filter(item => (item._id ? item._id !== t._id : item.name !== t.name))
    setList(newList)
    setCurrent(0)
  }

  const t = list[current] || list[0] || initialTestimonials[0]

  return (
    <section id="testimonials" className="relative py-24 px-6">
      <div ref={ref} className="section-hidden max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-cyan-400 mb-4"
            style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)' }}>
            TESTIMONIALS & REVIEWS ({list.length})
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            What People <span className="gradient-text">Say</span>
          </h2>
          <p className="text-white/50 max-w-lg mx-auto mb-6 text-sm">
            Real feedback from clients, team members, and visitors about my portfolio and work.
          </p>

          {/* Header Action Buttons: Write a Review & Owner Auth */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowReviewModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 cursor-pointer shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
                boxShadow: '0 0 20px rgba(6,182,212,0.4)',
              }}
            >
              <MessageSquarePlus size={16} /> Leave a Review
            </button>

            {isAdmin && (
              <button
                onClick={() => setIsAdmin(false)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-mono border transition-all cursor-pointer bg-green-500/15 border-green-500/40 text-green-400"
              >
                <Unlock size={13} />
                Admin Moderation Active
              </button>
            )}
          </div>
        </div>

        {/* Carousel Card */}
        {t && (
          <div className="relative">
            <div
              className="glass-strong rounded-3xl p-8 md:p-10 text-center relative overflow-hidden"
              style={{
                opacity: animating ? 0 : 1,
                transform: animating ? `translateX(${direction > 0 ? '-20px' : '20px'})` : 'translateX(0)',
                transition: 'opacity 0.25s ease, transform 0.25s ease',
              }}
            >
              {/* Quick Small Message Icon Button on top right of card */}
              <button
                onClick={() => setShowReviewModal(true)}
                className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 border border-cyan-500/30 transition-all text-xs font-mono cursor-pointer z-20"
                title="Write a Review"
              >
                <MessageSquarePlus size={14} />
                <span>+ Review</span>
              </button>

              {/* Admin delete badge */}
              {isAdmin && (
                <button
                  onClick={() => handleDeleteTestimonial(t)}
                  className="absolute top-4 left-4 p-2 rounded-xl bg-red-500/30 text-white hover:bg-red-500/60 transition-colors z-20 cursor-pointer"
                  title="Delete Review"
                >
                  <Trash2 size={15} />
                </button>
              )}

              {/* Background glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${t.avatarColor || '#06b6d4'}15 0%, transparent 60%)`,
                }}
              />

              {/* Highlight quote */}
              <div
                className="inline-block px-4 py-2 rounded-xl mb-6 text-sm font-medium"
                style={{ background: `${t.avatarColor || '#06b6d4'}15`, color: t.avatarColor || '#06b6d4', border: `1px solid ${t.avatarColor || '#06b6d4'}30` }}
              >
                "{t.highlight || t.review.slice(0, 40)}"
              </div>

              {/* Full review */}
              <blockquote className="text-white/80 text-lg leading-relaxed mb-8 max-w-2xl mx-auto relative">
                <span className="text-5xl text-white/10 absolute -top-4 -left-2 font-serif">"</span>
                {t.review}
                <span className="text-5xl text-white/10 absolute -bottom-8 -right-2 font-serif">"</span>
              </blockquote>

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-5">
                {Array.from({ length: t.rating || 5 }, (_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" className="text-amber-400" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center justify-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white"
                  style={{
                    background: `linear-gradient(135deg, ${t.avatarColor || '#06b6d4'}, ${(t.avatarColor || '#06b6d4')}99)`,
                    boxShadow: `0 0 16px ${t.avatarColor || '#06b6d4'}50`,
                  }}
                >
                  {t.avatar || 'PV'}
                </div>
                <div className="text-left">
                  <div className="font-bold text-white">{t.name}</div>
                  <div className="text-white/45 text-sm">{t.role || 'Visitor'} · {t.company || 'Community'}</div>
                </div>
              </div>
            </div>

            {/* Controls with small message icon trigger */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => go(-1)}
                className="p-2.5 rounded-xl glass text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Small message icon button */}
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-3.5 py-2 rounded-xl glass text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                title="Leave a Review"
              >
                <MessageSquarePlus size={15} />
                <span>Leave Review</span>
              </button>

              {/* Dots */}
              <div className="flex gap-2 items-center px-1">
                {list.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { clearInterval(autoRef.current); setCurrent(i) }}
                    className="rounded-full transition-all cursor-pointer"
                    style={{
                      width: i === current ? 20 : 6,
                      height: 6,
                      background: i === current
                        ? `linear-gradient(90deg, #4361ee, #a855f7)`
                        : 'rgba(255,255,255,0.2)',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => go(1)}
                className="p-2.5 rounded-xl glass text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VISITOR WRITE REVIEW MODAL */}
      {showReviewModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setShowReviewModal(false)}>
          <div className="glass-strong rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-7 cmd-panel"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                  <MessageSquarePlus size={16} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">Leave a Review / Feedback</h3>
              </div>
              <button onClick={() => setShowReviewModal(false)} className="p-1.5 glass rounded-xl text-white/50 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {submitSuccess ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-14 h-14 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto border border-green-500/30">
                  <HeartHandshake size={28} />
                </div>
                <h4 className="text-white font-bold text-xl">Thank You for Your Feedback!</h4>
                <p className="text-white/50 text-sm max-w-xs mx-auto">
                  Your review has been published to the portfolio dashboard!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">YOUR FULL NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/40 text-xs font-mono block mb-1">YOUR ROLE / TITLE</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Recruiter, Software Dev"
                      value={form.role}
                      onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-mono block mb-1">COMPANY / ORGANIZATION</label>
                    <input
                      type="text"
                      placeholder="e.g. Google, Tech Visitor"
                      value={form.company}
                      onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">RATING (STARS)</label>
                  <div className="flex gap-2 items-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setForm(f => ({ ...f, rating: star }))}
                        className="p-1 cursor-pointer transition-transform hover:scale-125"
                      >
                        <Star
                          size={24}
                          fill={star <= form.rating ? '#f59e0b' : 'transparent'}
                          className={star <= form.rating ? 'text-amber-400' : 'text-white/20'}
                        />
                      </button>
                    ))}
                    <span className="text-amber-400 font-bold text-sm ml-2">{form.rating} / 5 Stars</span>
                  </div>
                </div>

                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">YOUR REVIEW & FEEDBACK *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="What do you think about Tek Narayan's 3D portfolio and projects? Share your feedback..."
                    value={form.review}
                    onChange={e => setForm(f => ({ ...f, review: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none resize-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>

                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">KEY HIGHLIGHT QUOTE (OPTIONAL)</label>
                  <input
                    type="text"
                    placeholder="e.g. Stunning 3D visuals and responsive design!"
                    value={form.highlight}
                    onChange={e => setForm(f => ({ ...f, highlight: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button type="button" onClick={() => setShowReviewModal(false)}
                    className="flex-1 py-3 rounded-xl glass text-white/50 font-semibold cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl font-semibold text-white cursor-pointer transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #a855f7)' }}>
                    {isSubmitting ? 'Publishing Review...' : 'Publish Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* ADMIN AUTH MODAL */}
      {showAuthModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
          onClick={() => setShowAuthModal(false)}>
          <div className="glass-strong rounded-3xl max-w-sm w-full p-6 cmd-panel text-center"
            onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Lock size={22} className="text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Portfolio Owner Auth</h3>
            <p className="text-white/45 text-xs mb-5">Enter passcode to moderate/delete reviews (Hint: admin123)</p>

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
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #a855f7)' }}>
                  Unlock
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
