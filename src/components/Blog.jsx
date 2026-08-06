import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Clock, ArrowRight, Tag, Plus, Lock, Unlock, Trash2, X } from 'lucide-react'
import { fetchBlogPosts, createBlogPost, deleteBlogPostById } from '../api.js'
import { useAdminAuth } from '../useAdminAuth'

const initialPosts = [
  {
    title: 'Building Production-Grade RAG Systems with LangChain',
    excerpt: 'A deep dive into retrieval-augmented generation: chunking strategies, embedding models, vector database choices, and real-world pitfalls I encountered building an AI ERP system.',
    content: `Retrieval-Augmented Generation (RAG) has emerged as the definitive pattern for connecting Large Language Models (LLMs) to private, real-time enterprise data. However, taking a basic RAG setup from a weekend prototype to a high-throughput, low-latency production service presents several non-trivial engineering challenges.

In this deep dive, we break down the end-to-end architecture of the RAG engine powering our AI ERP system.

1. Document Parsing & Semantic Chunking:
Standard chunking by character length often splits logical paragraphs mid-sentence. We implemented Semantic Chunking using RecursiveCharacterTextSplitter tuned with custom regex dividers for financial tables, bullet points, and code blocks.

2. Embedding & Vector Indexing:
We benchmarked OpenAI text-embedding-3-small against local HuggingFace embeddings. Using Pinecone with cosine similarity indexing allowed us to maintain < 120ms retrieval times across millions of vector embeddings.

3. Hybrid Search & Reranking:
To prevent hallucinated context, we combined vector dense search with BM25 sparse keyword search using a Reciprocal Rank Fusion (RRF) algorithm. This ensured precise matches for specific product IDs, invoice numbers, and SKU codes.`,
    category: 'AI Engineering',
    readTime: '12 min',
    date: 'Jul 18, 2025',
    color: '#a855f7',
    gradient: 'from-purple-600/20 to-blue-600/10',
    tags: ['LangChain', 'RAG', 'OpenAI', 'Pinecone'],
    featured: true,
  },
  {
    title: 'MERN Stack Architecture Patterns That Scale to 100K Users',
    excerpt: 'Architectural decisions, database sharding strategies, caching layers, and deployment configurations that keep your MERN app performant under heavy load.',
    content: `Scaling a MERN (MongoDB, Express, React, Node.js) application beyond initial traffic requires shifting from monolithic code structures to clean, decoupled micro-patterns.

Here are the key architecture patterns we implemented to comfortably handle over 100,000 active users:

1. MongoDB Connection Pooling & Indexing:
- Configured maxPoolSize: 50 with aggressive index strategies on compound queries.
- Utilized read preferences to direct read-heavy reporting traffic to MongoDB secondary replica nodes.

2. Caching Layer with Redis:
- Cached frequent API responses (user profiles, product catalogs) in Redis with TTL strategy.
- Reduced overall MongoDB read operations by 68%.

3. Express Middleware & Rate Limiting:
- Implemented sliding-window rate limiting per IP and user JWT token using Redis store.
- Protected authentication endpoints from brute-force attempts.`,
    category: 'Full Stack',
    readTime: '9 min',
    date: 'Jun 30, 2025',
    color: '#4361ee',
    gradient: 'from-blue-600/20 to-cyan-600/10',
    tags: ['MERN', 'Node.js', 'MongoDB', 'Redis'],
    featured: true,
  },
  {
    title: 'How I Built an NL-to-MongoDB Query Engine',
    excerpt: 'The complete engineering breakdown of building a system that converts plain English questions into MongoDB aggregation pipelines using GPT-4 and few-shot prompting.',
    content: `Translating natural language questions like "What were our top 5 selling items last quarter in California?" into executable MongoDB aggregation pipelines requires robust prompt engineering and safety sandboxing.

Architecture Overview:
1. Schema Serialization: We pass a lightweight representation of database collections and field types to GPT-4.
2. Few-Shot Prompting: Providing high-quality input/output JSON pipeline pairs improved query generation accuracy from 64% to 94%.
3. Safety Sandbox: Before execution, every generated query passes through an AST validator to block destructive pipeline stages ($out, $merge, $delete).`,
    category: 'AI Engineering',
    readTime: '15 min',
    date: 'May 12, 2025',
    color: '#06b6d4',
    gradient: 'from-cyan-600/20 to-purple-600/10',
    tags: ['GPT-4', 'MongoDB', 'NLP', 'API Design'],
    featured: false,
  },
  {
    title: 'React Performance: From 4s to 800ms Load Time',
    excerpt: 'Code-splitting, lazy loading, memoization, virtual lists, and bundle analysis techniques I used to cut load times by 80% in a production React app.',
    content: `Slow initial page loads directly hurt conversion rates. In our developer portfolio and web apps, we systematically reduced initial bundle size and load times by 80%.

Key Techniques Used:
- Route & Component Lazy Loading: Code-split non-critical modals and heavy 3D canvases using React.lazy() and Suspense.
- Vite Bundle Splitting: Split vendor libraries (Three.js, Lucide, Framer Motion) into separate cached chunks.
- Image & Asset Optimization: Converted raw PNGs and JPEGs to WebP format with responsive srcset tags.
- Memoization: Avoided unnecessary component re-renders using React.memo, useMemo, and useCallback on heavy list items.`,
    category: 'Frontend',
    readTime: '7 min',
    date: 'Apr 5, 2025',
    color: '#61dafb',
    gradient: 'from-cyan-500/15 to-blue-600/10',
    tags: ['React', 'Performance', 'Vite', 'Optimization'],
    featured: false,
  },
  {
    title: 'Docker Compose for Full Stack Devs: The Real Guide',
    excerpt: 'Skip the toy examples. This covers multi-service orchestration, environment management, networking, volumes, and production-ready Docker Compose setups.',
    content: `Production containerization requires moving beyond single Dockerfiles into multi-container orchestration with Docker Compose.

In this guide, we walk through configuring a complete full-stack environment:
- Container 1: Frontend Vite React app with hot-reloading dev server
- Container 2: Express Node.js API server with health checks
- Container 3: Persistent MongoDB database with volume mounts
- Container 4: Redis caching server

We also cover environment variable security, Docker network isolation, and multi-stage builds for lean production images.`,
    category: 'DevOps',
    readTime: '11 min',
    date: 'Mar 20, 2025',
    color: '#2496ed',
    gradient: 'from-blue-500/15 to-blue-700/10',
    tags: ['Docker', 'DevOps', 'Node.js'],
    featured: false,
  },
  {
    title: 'JWT vs Sessions: What Nobody Tells You',
    excerpt: 'The real tradeoffs between JWT and session-based auth — token invalidation, refresh flows, XSS/CSRF surface, and when to use each in MERN applications.',
    content: `Choosing between JSON Web Tokens (JWT) and traditional Server-Side Sessions is one of the most debated security topics in web engineering.

Tradeoff Analysis:
1. Storage Security: Storing JWTs in localStorage exposes them to XSS attacks. We recommend using HTTP-Only, SameSite=Strict cookies to store auth tokens safely.
2. Token Invalidation: Unlike sessions stored in Redis or DB, stateless JWTs cannot be instantly revoked without a token blacklist.
3. Hybrid Approach: We use short-lived JWT access tokens (15 mins) paired with HTTP-only refresh tokens stored in Redis for instantaneous session revocation.`,
    category: 'Security',
    readTime: '8 min',
    date: 'Feb 14, 2025',
    color: '#ec4899',
    gradient: 'from-pink-600/15 to-rose-600/10',
    tags: ['JWT', 'Auth', 'Security', 'Express'],
    featured: false,
  },
]

function BlogCard({ post, big = false, onDelete, onSelect, isAdmin }) {
  return (
    <article
      onClick={() => onSelect && onSelect(post)}
      className={`glass rounded-2xl overflow-hidden group hover:bg-white/5 transition-all duration-300 hover:scale-[1.02] cursor-pointer flex flex-col relative`}
      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Cover image area */}
      <div
        className={`relative ${big ? 'h-36' : 'h-24'} bg-gradient-to-br ${post.gradient || 'from-purple-600/20 to-blue-600/10'} flex items-end p-4 overflow-hidden justify-between`}
      >
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 70% 30%, ${post.color || '#a855f7'}60 0%, transparent 60%)`,
          }}
        />
        <span className="relative text-xs font-mono px-2.5 py-1 rounded-full z-10"
          style={{ background: `${post.color || '#a855f7'}30`, color: post.color || '#a855f7', border: `1px solid ${post.color || '#a855f7'}40` }}>
          {post.category || 'Engineering'}
        </span>

        {isAdmin && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(post)
            }}
            className="relative z-10 p-1.5 rounded-lg bg-red-500/30 text-white hover:bg-red-500/60 transition-colors cursor-pointer"
            title="Delete Blog Post"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-3 text-white/30 text-xs font-mono mb-3">
          <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime || '5 min'}</span>
          <span>{post.date}</span>
        </div>

        <h3 className={`text-white font-bold leading-snug mb-2 group-hover:text-white/90 ${big ? 'text-lg' : 'text-base'}`}>
          {post.title}
        </h3>

        <p className="text-white/50 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{post.excerpt}</p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-wrap gap-1">
            {(post.tags || []).slice(0, 2).map(tag => (
              <span key={tag} className="flex items-center gap-0.5 text-xs text-white/30 font-mono">
                <Tag size={8} />{tag}
              </span>
            ))}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSelect && onSelect(post)
            }}
            className="text-xs font-medium flex items-center gap-1 transition-all group-hover:gap-2 cursor-pointer"
            style={{ color: post.color || '#a855f7' }}
          >
            Read <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default function Blog() {
  const [postList, setPostList] = useState(initialPosts)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const { isAdmin, login, logout } = useAdminAuth()
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
    excerpt: '',
    content: '',
    category: 'AI Engineering',
    readTime: '6 min',
    tags: '',
    color: '#a855f7',
    gradient: 'from-purple-600/20 to-blue-600/10',
    featured: false,
  })

  useEffect(() => {
    fetchBlogPosts(initialPosts).then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setPostList(data)
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
    const success = login(passcodeAttempt)
    if (success) {
      setAdminKey(passcodeAttempt)
      setShowAuthModal(false)
      setShowAddModal(true)
      setAuthError('')
      setPasscodeAttempt('')
    } else {
      setAuthError('Incorrect passcode. Hint: admin123')
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.excerpt.trim()) return

    setIsSubmitting(true)
    const newPostData = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }

    const res = await createBlogPost(newPostData, adminKey || 'admin123')
    setIsSubmitting(false)

    if (res.success && res.post) {
      setPostList(prev => [res.post, ...prev])
      setShowAddModal(false)
      setForm({
        title: '',
        excerpt: '',
        content: '',
        category: 'AI Engineering',
        readTime: '6 min',
        tags: '',
        color: '#a855f7',
        gradient: 'from-purple-600/20 to-blue-600/10',
        featured: false,
      })
    } else {
      // Local fallback
      const tempPost = { ...newPostData, _id: Date.now().toString() }
      setPostList(prev => [tempPost, ...prev])
      setShowAddModal(false)
    }
  }

  const handleDeletePost = async (post) => {
    if (!window.confirm(`Delete blog article "${post.title}"?`)) return
    if (post._id) {
      await deleteBlogPostById(post._id, adminKey || 'admin123')
    }
    setPostList(prev => prev.filter(p => (p._id ? p._id !== post._id : p.title !== post.title)))
  }

  const featured = postList.filter(p => p.featured)
  const rest = postList.filter(p => !p.featured)

  return (
    <section id="blog" className="relative py-24 px-6">
      <div ref={ref} className="section-hidden max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-pink-400"
              style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.25)' }}>
              BLOG ({postList.length})
            </span>
            {isAdmin && (
              <button
                onClick={logout}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono text-emerald-400 glass cursor-pointer hover:bg-emerald-500/20 transition-all"
                title="Admin Unlocked — Click to Lock"
              >
                <Unlock size={12} /> Admin Active
              </button>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Technical <span className="gradient-text">Writing</span>
          </h2>
          <p className="text-white/50 max-w-lg mx-auto mb-6">
            Deep dives on AI engineering, MERN stack, and the lessons from shipping real products.
          </p>

          {/* Action Header bar: Add Article (Admin ONLY) */}
          {isAdmin && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105 cursor-pointer shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                  boxShadow: '0 0 20px rgba(236,72,153,0.3)',
                }}
              >
                <Plus size={16} /> + Add Article
              </button>
            </div>
          )}
        </div>

        {/* Featured posts */}
        {featured.length > 0 && (
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            {featured.map(post => (
              <BlogCard key={post._id || post.title} post={post} big onDelete={handleDeletePost} onSelect={setSelectedArticle} isAdmin={isAdmin} />
            ))}
          </div>
        )}

        {/* Rest posts */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map(post => (
            <BlogCard key={post._id || post.title} post={post} onDelete={handleDeletePost} onSelect={setSelectedArticle} isAdmin={isAdmin} />
          ))}
        </div>
      </div>

      {/* Full Article Reader Modal */}
      {selectedArticle && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(16px)' }}
          onClick={() => setSelectedArticle(null)}>
          <div className="glass-strong rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto cmd-panel border border-white/10"
            onClick={e => e.stopPropagation()}>
            
            {/* Cover Header */}
            <div className={`relative p-6 sm:p-8 bg-gradient-to-br ${selectedArticle.gradient || 'from-purple-600/30 to-blue-600/20'} flex flex-col justify-between overflow-hidden border-b border-white/10`}>
              <div className="absolute inset-0 opacity-40"
                style={{ backgroundImage: `radial-gradient(circle at 80% 20%, ${selectedArticle.color || '#a855f7'}70 0%, transparent 60%)` }} />
              
              <div className="flex items-center justify-between gap-4 mb-4 relative z-10">
                <span className="text-xs font-mono px-3 py-1 rounded-full"
                  style={{ background: `${selectedArticle.color || '#a855f7'}30`, color: selectedArticle.color || '#a855f7', border: `1px solid ${selectedArticle.color || '#a855f7'}50` }}>
                  {selectedArticle.category || 'Engineering'}
                </span>
                <button onClick={() => setSelectedArticle(null)}
                  className="p-2 glass rounded-xl text-white/70 hover:text-white cursor-pointer transition-colors">
                  <X size={18} />
                </button>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3 relative z-10">
                {selectedArticle.title}
              </h2>

              <div className="flex items-center gap-4 text-xs font-mono text-white/60 relative z-10">
                <span className="flex items-center gap-1.5"><Clock size={12} /> {selectedArticle.readTime || '5 min'}</span>
                <span>📅 {selectedArticle.date}</span>
                <span>✍️ Tek Narayan Yadav</span>
              </div>
            </div>

            {/* Article Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Excerpt box */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 text-white/80 text-sm leading-relaxed font-mono">
                <span className="text-amber-400 font-bold block mb-1">💡 EXECUTIVE SUMMARY</span>
                {selectedArticle.excerpt}
              </div>

              {/* Detailed Content */}
              <div className="text-white/75 space-y-4 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {selectedArticle.content ? (
                  selectedArticle.content.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                ) : (
                  <>
                    <p>
                      In modern software development, building applications that balance high performance with robust scalability requires thoughtful architectural decisions. This article explores key technical strategies, practical patterns, and real-world lessons learned while engineering production systems.
                    </p>
                    <h4 className="text-white font-bold text-lg pt-2">Key Technical Highlights</h4>
                    <ul className="list-disc list-inside space-y-2 text-white/70 text-sm pl-2">
                      <li>Optimized data pipelines to minimize latency and memory overhead.</li>
                      <li>Implemented clean separation of concerns across service components.</li>
                      <li>Configured automated failovers, caching layers, and real-time event streaming.</li>
                      <li>Applied rigorous schema validations and error handling boundaries.</li>
                    </ul>
                    <p className="pt-2">
                      By carefully structuring codebases and leveraging cloud-native best practices, development teams can deliver fast, reliable, and maintainable user experiences at scale.
                    </p>
                  </>
                )}
              </div>

              {/* Tags & Action Bar */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {(selectedArticle.tags || []).map(t => (
                    <span key={t} className="flex items-center gap-1 text-xs font-mono px-3 py-1 rounded-lg glass text-white/50">
                      <Tag size={10} /> {t}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white glass hover:bg-white/10 transition-all cursor-pointer"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Admin Passcode Modal */}
      {showAuthModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
          onClick={() => setShowAuthModal(false)}>
          <div className="glass-strong rounded-3xl max-w-sm w-full p-6 cmd-panel text-center"
            onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Lock size={22} className="text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Portfolio Owner Auth</h3>
            <p className="text-white/45 text-xs mb-5">Enter passcode to publish/delete blog posts (Hint: admin123)</p>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Enter admin passcode..."
                value={passcodeAttempt}
                onChange={e => setPasscodeAttempt(e.target.value)}
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(236,72,153,0.3)' }}
              />
              {authError && <p className="text-red-400 text-xs">{authError}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowAuthModal(false)}
                  className="flex-1 py-2.5 rounded-xl glass text-white/50 text-sm cursor-pointer">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl font-semibold text-white text-sm cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)' }}>
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Add Blog Post Modal */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setShowAddModal(false)}>
          <div className="glass-strong rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-7 cmd-panel"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <Plus size={16} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">Publish New Blog Article</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 glass rounded-xl text-white/50 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">ARTICLE TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master LangChain Agents in Production"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">CATEGORY</label>
                  <input
                    type="text"
                    placeholder="e.g. AI Engineering"
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">READ TIME</label>
                  <input
                    type="text"
                    placeholder="e.g. 8 min"
                    value={form.readTime}
                    onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">EXCERPT / SUMMARY *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Key takeaways and summary of the article..."
                  value={form.excerpt}
                  onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">FULL ARTICLE CONTENT</label>
                <textarea
                  rows={5}
                  placeholder="Detailed article body, technical breakdown, architectural steps..."
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">TAGS (comma separated)</label>
                <input
                  type="text"
                  placeholder="LangChain, AI, Vector DB, RAG"
                  value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={form.featured}
                  onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                  className="w-4 h-4 rounded cursor-pointer accent-pink-500"
                />
                <label htmlFor="featuredCheck" className="text-white/70 text-xs font-mono cursor-pointer">
                  Feature this article at the top of the Blog section
                </label>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl glass text-white/50 font-semibold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl font-semibold text-white cursor-pointer transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)' }}>
                  {isSubmitting ? 'Publishing to MongoDB...' : 'Publish Article'}
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
