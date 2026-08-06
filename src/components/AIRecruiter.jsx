import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Brain, ChevronRight, RotateCcw, Send } from 'lucide-react'

const questionBank = [
  {
    category: 'Architecture',
    question: 'Can you explain how you designed the database schema for the AI ERP system? What were the key considerations?',
    answer: "The ERP schema used a multi-tenant approach with separate collections for organizations, users, and business data. Key considerations: 1) Document embedding vs. references — I used references for entities that change independently (users, products) and embedding for data always accessed together (order line items). 2) Indexed fields for NL query performance — every field that GPT-4 might filter on was indexed. 3) Denormalization for real-time dashboards — aggregated stats are stored separately and updated via change streams for O(1) reads.",
  },
  {
    category: 'MERN Stack',
    question: 'How do you handle authentication and authorization in your MERN applications?',
    answer: "I use a layered auth system: JWT for stateless API authentication with short-lived access tokens (15 min) and long-lived refresh tokens stored in httpOnly cookies. On the server, Express middleware validates the JWT on every protected route. For authorization, I implement RBAC — roles stored in MongoDB with a permission bitmap. The middleware checks permissions before route handlers execute. For admin operations, I add IP allowlisting. I never store plain passwords — bcrypt with 12 salt rounds minimum.",
  },
  {
    category: 'AI Engineering',
    question: 'Walk me through how you built the natural language to MongoDB query feature.',
    answer: "The NL-to-MongoDB pipeline works in 3 stages: 1) Schema introspection — I serialize the MongoDB schema and sample data into a structured prompt context. 2) Few-shot prompting — I provide GPT-4 with 10-15 example NL→query pairs that cover aggregations, filters, sorts, and joins. 3) Query validation & sandboxing — the generated query runs through a static analyzer that checks for dangerous operators ($where, arbitrary JS) before execution. Results are paginated and streamed back. The accuracy on our domain is ~94% for common queries.",
  },
  {
    category: 'System Design',
    question: 'How would you design a real-time notification system for 10,000 concurrent users?',
    answer: "I'd use WebSockets via Socket.io with Redis adapter for horizontal scaling across Node.js instances. Architecture: 1) Each Node.js server maintains WebSocket connections for its slice of users. 2) Redis pub/sub broadcasts events to all server instances — each server forwards to its connected clients. 3) For delivery guarantees, events are persisted to MongoDB with delivery status. 4) On reconnect, the client sends its last-seen event ID and receives missed events. 5) For true scale, replace Socket.io with NATS or Kafka. This handles 10K concurrent easily; for 100K, introduce a dedicated WebSocket gateway.",
  },
  {
    category: 'Frontend',
    question: 'What strategies do you use to optimize React application performance?',
    answer: "My performance checklist: 1) Code splitting with React.lazy + Suspense — every route is a separate chunk. 2) Memoization with useMemo and useCallback only where profiling confirms re-renders are expensive (avoid premature optimization). 3) Virtual lists (TanStack Virtual) for any list > 100 items. 4) Image optimization — next/image or manual lazy loading with IntersectionObserver. 5) State management — colocate state; only lift when genuinely shared. 6) Bundle analysis — Webpack Bundle Analyzer or Vite's rollup-plugin-visualizer to hunt down large deps. 7) Prefetching — critical routes prefetched on hover.",
  },
  {
    category: 'Problem Solving',
    question: 'Describe a difficult technical challenge you faced and how you solved it.',
    answer: "In the food delivery platform, we had a race condition where two drivers could accept the same order simultaneously. Initial fix (optimistic locking) failed under high load because our MongoDB version didn't support transactions on sharded collections at the time. I solved it with a Redis-based distributed lock: when a driver clicks 'Accept', we atomically SET a Redis key with SETNX and a 30-second TTL. Only one driver wins the lock; the others get a soft rejection with 'Order taken'. On lock acquisition, we write to MongoDB and release the lock. P99 assignment latency dropped to 8ms and we've had zero double-assignments in 6 months of production.",
  },
]

export default function AIRecruiter() {
  const [open, setOpen] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [inputAnswer, setInputAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const bottomRef = useRef(null)

  const q = questionBank[currentIdx]

  const reset = () => {
    setCurrentIdx(0)
    setShowAnswer(false)
    setInputAnswer('')
    setSubmitted(false)
    setScore(0)
    setDone(false)
  }

  const submit = () => {
    if (!inputAnswer.trim()) return
    setSubmitted(true)
    setShowAnswer(true)
    setScore(s => s + 1)
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const next = () => {
    if (currentIdx >= questionBank.length - 1) {
      setDone(true)
    } else {
      setCurrentIdx(i => i + 1)
      setShowAnswer(false)
      setInputAnswer('')
      setSubmitted(false)
    }
  }

  return (
    <>
      <div className="flex justify-center py-6">
        <button
          onClick={() => setOpen(true)}
          className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all hover:scale-105 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #4361ee, #a855f7)',
            boxShadow: '0 0 40px rgba(67,97,238,0.4)',
          }}
        >
          <Brain size={22} className="group-hover:animate-pulse" />
          Interview Me with AI
          <ChevronRight size={18} />
        </button>
      </div>

      {open && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="glass-strong rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto cmd-panel"
            style={{ border: '1px solid rgba(67,97,238,0.3)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Brain size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">AI Technical Interview</h3>
                  <p className="text-white/40 text-xs">Tek Narayan Yadav · Full Stack & AI Engineer</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40 font-mono">{currentIdx + 1}/{questionBank.length}</span>
                <button onClick={reset} className="p-1.5 text-white/40 hover:text-white transition-colors cursor-pointer">
                  <RotateCcw size={14} />
                </button>
                <button onClick={() => setOpen(false)} className="p-1.5 text-white/40 hover:text-white transition-colors cursor-pointer">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-0.5 bg-white/8">
              <div className="h-full transition-all duration-500"
                style={{
                  width: `${((currentIdx + (submitted ? 1 : 0)) / questionBank.length) * 100}%`,
                  background: 'linear-gradient(90deg, #4361ee, #a855f7)',
                }} />
            </div>

            <div className="p-6">
              {done ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-2xl font-black text-white mb-2">Interview Complete!</h3>
                  <p className="text-white/50 mb-6">Tek Narayan answered all {questionBank.length} questions.</p>
                  <div className="glass rounded-2xl p-6 mb-6">
                    <div className="text-4xl font-black gradient-text mb-1">{score}/{questionBank.length}</div>
                    <div className="text-white/50 text-sm">Questions Answered</div>
                    <div className="mt-4 text-white/60 text-sm leading-relaxed">
                      Strong demonstration of MERN architecture, AI engineering, system design, and real-world problem solving.
                      Highly recommended for senior full-stack or AI engineering roles.
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button onClick={reset}
                      className="px-5 py-2.5 rounded-xl font-semibold glass text-white/60 hover:text-white transition-colors cursor-pointer">
                      Retry Interview
                    </button>
                    <button onClick={() => { setOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                      className="px-5 py-2.5 rounded-xl font-semibold text-white cursor-pointer"
                      style={{ background: 'linear-gradient(135deg, #4361ee, #7c3aed)' }}>
                      Hire Tek Narayan →
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Category badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(67,97,238,0.2)', color: '#93c5fd', border: '1px solid rgba(67,97,238,0.3)' }}>
                      {q.category}
                    </span>
                    <span className="text-white/30 text-xs font-mono">Q{currentIdx + 1} of {questionBank.length}</span>
                  </div>

                  {/* Question */}
                  <div className="glass rounded-2xl p-5 mb-5">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Brain size={13} className="text-white" />
                      </div>
                      <p className="text-white font-medium leading-relaxed">{q.question}</p>
                    </div>
                  </div>

                  {/* User answer input */}
                  {!submitted && (
                    <div className="mb-5">
                      <label className="text-white/40 text-xs font-mono tracking-widest block mb-2">YOUR ANSWER (optional — see Tek Narayan's answer below)</label>
                      <textarea
                        rows={3}
                        placeholder="Type your answer or click 'Show Answer' to see Tek Narayan's response..."
                        value={inputAnswer}
                        onChange={e => setInputAnswer(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm outline-none resize-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                        onFocus={e => (e.target.style.borderColor = 'rgba(67,97,238,0.5)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                      <div className="flex gap-2 mt-2">
                        <button onClick={submit}
                          className="flex-1 py-2.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 text-sm cursor-pointer"
                          style={{ background: 'linear-gradient(135deg, #4361ee, #7c3aed)' }}>
                          <Send size={13} /> Submit & See Answer
                        </button>
                        <button onClick={() => { setShowAnswer(true); setSubmitted(true) }}
                          className="px-4 py-2.5 rounded-xl font-semibold glass text-white/60 hover:text-white text-sm transition-colors cursor-pointer">
                          Skip
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tek Narayan's answer */}
                  {showAnswer && (
                    <div className="mb-5 chat-message">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">T</span>
                        </div>
                        <span className="text-white/60 text-xs font-mono">Tek Narayan's Answer</span>
                      </div>
                      <div className="glass rounded-2xl p-5"
                        style={{ border: '1px solid rgba(67,97,238,0.2)', background: 'rgba(67,97,238,0.05)' }}>
                        <p className="text-white/75 text-sm leading-relaxed">{q.answer}</p>
                      </div>
                    </div>
                  )}

                  {submitted && (
                    <button onClick={next}
                      className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                      style={{ background: 'linear-gradient(135deg, #4361ee, #a855f7)' }}>
                      {currentIdx < questionBank.length - 1 ? 'Next Question' : 'See Results'}
                      <ChevronRight size={16} />
                    </button>
                  )}
                </>
              )}
              <div ref={bottomRef} />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
