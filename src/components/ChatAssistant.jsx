import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User } from 'lucide-react'
import { sendChatQuery } from '../api.js'

const faqs = {
  teknarayan: "Tek Narayan Yadav is a Full Stack Developer and AI Engineer specializing in the MERN stack. He builds scalable, AI-powered web applications and has worked on projects ranging from enterprise ERP systems to real-time food delivery platforms.",
  mern: "Tek Narayan's MERN stack expertise includes: **MongoDB** for database design, **Express.js** for REST APIs, **React** with TypeScript for frontend, and **Node.js** for server-side logic. He has shipped multiple production MERN applications.",
  ai: "Tek Narayan's AI projects include: an AI ERP Assistant (natural language database queries), a RAG-powered chatbot, an OCR intelligence system, and a semantic search engine. He works with OpenAI API, LangChain, Pinecone, and vector databases.",
  erp: "The AI ERP System is Tek Narayan's flagship project — an enterprise resource planning platform where users can query the database in plain English. It uses LangChain + GPT-4 to translate natural language to MongoDB queries, with real-time dashboards and AI analytics.",
  skills: "Tek Narayan's core skills: React, TypeScript, Next.js, Node.js, Express.js, MongoDB, OpenAI API, LangChain, RAG, Docker, Tailwind CSS. He also knows Python, SQL, Redis, and GraphQL.",
  contact: "You can reach Tek Narayan at: 📧 teknarayan@example.com | 💼 LinkedIn: linkedin.com/in/teknarayanyadav | 🐱 GitHub: github.com/teknarayanyadav",
  resume: "Tek Narayan's resume is available for download from the portfolio. It covers his MERN stack projects, AI integrations, technical skills, and learning journey.",
  experience: "Tek Narayan has been coding since 2020. His journey: HTML/CSS → JavaScript → React → MERN Stack → AI integrations. He's built 20+ projects and contributed 500+ times on GitHub.",
  projects: "Featured projects: 1) AI ERP System, 2) Medical Store Platform, 3) Food Delivery App, 4) AI Chatbot Suite, 5) Developer Portfolio, 6) AI Code Reviewer. Click 'Projects' to explore each one!",
  hire: "Tek Narayan is available for full-time roles, freelance projects, and collaborations. He's particularly interested in AI-powered product development and MERN stack applications. Use the Contact section to reach out!",
}

function getResponse(query) {
  const q = query.toLowerCase()
  if (q.includes('teknarayan') || q.includes('tek') || q.includes('sidharth') || q.includes('siddharth') || q.includes('who') || q.includes('about')) return faqs.teknarayan
  if (q.includes('mern') || q.includes('stack')) return faqs.mern
  if (q.includes('erp')) return faqs.erp
  if (q.includes('ai') || q.includes('chatbot') || q.includes('langchain') || q.includes('rag')) return faqs.ai
  if (q.includes('skill') || q.includes('tech') || q.includes('know')) return faqs.skills
  if (q.includes('contact') || q.includes('email') || q.includes('reach')) return faqs.contact
  if (q.includes('resume') || q.includes('cv')) return faqs.resume
  if (q.includes('experience') || q.includes('journey') || q.includes('year')) return faqs.experience
  if (q.includes('project') || q.includes('work') || q.includes('built')) return faqs.projects
  if (q.includes('hire') || q.includes('available') || q.includes('job')) return faqs.hire
  return "I'm Tek Narayan's AI assistant! Ask me about his projects, skills, experience, AI work, or how to contact him. Try: 'Tell me about the AI ERP', 'What are his skills?', or 'How to hire Tek Narayan?'"
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "Hi! I'm Tek's AI assistant. Ask me anything about Tek Narayan — his projects, skills, AI work, or how to hire him! 🚀",
      id: 0,
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const nextId = useRef(1)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200)
  }, [open])

  const send = async () => {
    const msg = input.trim()
    if (!msg) return
    setInput('')

    const userMsg = { role: 'user', content: msg, id: nextId.current++ }
    setMessages(m => [...m, userMsg])
    setTyping(true)

    const defaultReply = getResponse(msg)
    const rawReply = await sendChatQuery(msg, defaultReply)
    const reply = (rawReply || defaultReply).replace(/Sidharth/gi, 'Tek Narayan').replace(/Siddharth/gi, 'Tek Narayan')
    setTyping(false)
    setMessages(m => [...m, { role: 'bot', content: reply, id: nextId.current++ }])
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all hover:scale-110"
        style={{
          background: 'linear-gradient(135deg, #4361ee, #a855f7)',
          boxShadow: '0 0 30px rgba(67,97,238,0.5)',
        }}
      >
        {open ? <X size={22} className="text-white" /> : <MessageSquare size={22} className="text-white" />}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl cmd-panel"
          style={{
            background: 'rgba(10,10,30,0.95)',
            border: '1px solid rgba(67,97,238,0.3)',
            boxShadow: '0 0 40px rgba(67,97,238,0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, rgba(67,97,238,0.3), rgba(168,85,247,0.2))' }}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <div className="text-white text-sm font-semibold">Tek's AI Assistant</div>
              <div className="text-white/50 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Always here
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-message flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div
                  className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                  style={{ background: msg.role === 'bot' ? 'rgba(67,97,238,0.3)' : 'rgba(168,85,247,0.3)' }}
                >
                  {msg.role === 'bot' ? <Bot size={12} className="text-blue-400" /> : <User size={12} className="text-purple-400" />}
                </div>
                <div
                  className="rounded-xl px-3 py-2 text-sm max-w-[80%] leading-relaxed"
                  style={{
                    background: msg.role === 'bot' ? 'rgba(255,255,255,0.06)' : 'rgba(67,97,238,0.25)',
                    color: 'rgba(255,255,255,0.8)',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2 items-center">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Bot size={12} className="text-blue-400" />
                </div>
                <div className="px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto">
            {['Skills?', 'AI Projects?', 'Hire me?'].map(q => (
              <button key={q} onClick={() => { setInput(q); setTimeout(send, 0) }}
                className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs text-white/50 hover:text-white/80 transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 pb-4 flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask anything about Tek Narayan..."
              className="flex-1 px-3 py-2 rounded-xl text-white placeholder-white/25 text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="p-2 rounded-xl text-white transition-all hover:scale-110 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #4361ee, #7c3aed)' }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
