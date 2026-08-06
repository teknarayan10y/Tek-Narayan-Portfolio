import { useEffect, useRef, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { GitBranch, Star, Users, GitCommitHorizontal, Plus, Lock, Unlock, Trash2, Edit2, X } from 'lucide-react'
import { fetchGitHubData, updateGitHubStats } from '../api.js'
import { useAdminAuth } from '../useAdminAuth'

const initialRecentRepos = [
  { name: 'ai-erp-system', desc: 'Enterprise ERP with NL database queries', lang: 'TypeScript', stars: 48, forks: 12, color: '#3178c6' },
  { name: 'mern-food-delivery', desc: 'Real-time food delivery platform', lang: 'JavaScript', stars: 34, forks: 9, color: '#f7df1e' },
  { name: 'rag-chatbot-suite', desc: 'RAG-powered multi-model chatbot', lang: 'TypeScript', stars: 61, forks: 18, color: '#3178c6' },
  { name: 'medical-store-app', desc: 'Full-stack healthcare e-commerce', lang: 'JavaScript', stars: 27, forks: 7, color: '#f7df1e' },
  { name: 'langchain-tools', desc: 'LangChain utility library', lang: 'Python', stars: 92, forks: 24, color: '#3572A5' },
  { name: 'portfolio-2027', desc: 'Premium futuristic portfolio', lang: 'TypeScript', stars: 115, forks: 31, color: '#3178c6' },
]

const initialLangStats = [
  { lang: 'TypeScript', pct: 42, color: '#3178c6' },
  { lang: 'JavaScript', pct: 28, color: '#f7df1e' },
  { lang: 'Python', pct: 15, color: '#3572a5' },
  { lang: 'CSS', pct: 10, color: '#563d7c' },
  { lang: 'Other', pct: 5, color: '#555' },
]

const langColorMap = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572a5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C++': '#f34b7d',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Ruby: '#701516',
}

function calculateLangStatsFromRepos(repos = []) {
  if (!repos || repos.length === 0) {
    return initialLangStats
  }

  const counts = {}
  let total = 0

  repos.forEach(r => {
    const lang = (r.lang || 'TypeScript').trim()
    counts[lang] = (counts[lang] || 0) + 1
    total += 1
  })

  const sortedLangs = Object.keys(counts).sort((a, b) => counts[b] - counts[a])
  let remainingPct = 100

  const stats = sortedLangs.map((lang, idx) => {
    let pct = 0
    if (idx === sortedLangs.length - 1) {
      pct = Math.max(1, remainingPct)
    } else {
      pct = Math.max(1, Math.round((counts[lang] / total) * 100))
    }
    remainingPct -= pct
    const repoColor = repos.find(r => r.lang === lang)?.color
    const color = repoColor || langColorMap[lang] || '#06b6d4'
    return { lang, pct, color }
  })

  return stats
}

function ContribGraph({ gridData = [], commitsCount = 847, isAdmin, onCellClick }) {
  const weeks = 52
  const days = 7
  const colors = [
    'rgba(255,255,255,0.04)',
    'rgba(6,182,212,0.35)',   // level 1 - cyan
    'rgba(67,97,238,0.6)',    // level 2 - blue
    'rgba(168,85,247,0.8)',   // level 3 - purple
    '#00f2fe'                // level 4 - neon cyan glow
  ]

  // Default fallback grid
  const defaultGrid = useMemo(() => {
    return Array.from({ length: weeks * days }, (_, i) => {
      const w = Math.floor(i / 7)
      const isRecent = w > 34
      const seed = (i * 9301 + 49297) % 233280
      const active = (seed / 233280) > (isRecent ? 0.35 : 0.6)
      const lvl = active ? (i % 4) + 1 : 0
      return { id: i, lvl }
    })
  }, [])

  const currentGrid = (gridData && gridData.length === weeks * days) ? gridData : defaultGrid
  const [activeCellIdx, setActiveCellIdx] = useState(-1)

  // Auto pulse on commits change
  useEffect(() => {
    setActiveCellIdx((weeks - 1) * 7 + Math.floor(Math.random() * 7))
    const timer = setTimeout(() => setActiveCellIdx(-1), 1200)
    return () => clearTimeout(timer)
  }, [commitsCount])

  const handleCellClick = (idx) => {
    setActiveCellIdx(idx)
    if (onCellClick) {
      onCellClick(idx)
    }
    setTimeout(() => setActiveCellIdx(-1), 800)
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-1 min-w-max">
        {Array.from({ length: weeks }, (_, w) => (
          <div key={w} className="flex flex-col gap-1">
            {Array.from({ length: days }, (_, d) => {
              const idx = w * 7 + d
              const cell = currentGrid[idx] || { lvl: 0 }
              const isPulsing = activeCellIdx === idx
              return (
                <div
                  key={d}
                  onClick={() => handleCellClick(idx)}
                  className={`w-2.5 h-2.5 rounded-sm transition-all duration-300 cursor-pointer ${
                    isPulsing ? 'scale-150 z-10 animate-pulse' : 'hover:scale-125'
                  }`}
                  style={{
                    background: colors[cell.lvl || 0],
                    boxShadow: cell.lvl > 1 ? `0 0 ${(cell.lvl || 1) * 3}px ${colors[cell.lvl || 0]}` : 'none',
                    border: isPulsing ? '1px solid #00f2fe' : 'none',
                  }}
                  title={`Week ${w + 1}, Day ${d + 1}: ${(cell.lvl || 0) * 4 || 'No'} contributions (${isAdmin ? 'Click to fill color' : 'Click to trigger contribution'})`}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function AnimCounter({ target, color }) {
  const [count, setCount] = useState(target)
  const ref = useRef(null)

  useEffect(() => {
    setCount(target)
  }, [target])

  return <div ref={ref} className="text-3xl font-black" style={{ color }}>{count}</div>
}

export default function GitHubDashboard() {
  const [ghData, setGhData] = useState({
    repositoriesCount: 48,
    totalStars: 377,
    followers: 124,
    commitsThisYear: 847,
    currentStreak: 23,
    longestStreak: 91,
    recentRepos: initialRecentRepos,
    langStats: calculateLangStatsFromRepos(initialRecentRepos),
    contribGrid: [],
  })

  const { isAdmin, login, logout } = useAdminAuth()
  const [adminKey, setAdminKey] = useState('admin123')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddRepoModal, setShowAddRepoModal] = useState(false)
  const [editingRepoIndex, setEditingRepoIndex] = useState(-1)
  const [editingRepo, setEditingRepo] = useState(null)
  const [passcodeAttempt, setPasscodeAttempt] = useState('')
  const [authError, setAuthError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const ref = useRef(null)

  // Edit form state
  const [formStats, setFormStats] = useState({
    repositoriesCount: 48,
    totalStars: 377,
    followers: 124,
    commitsThisYear: 847,
    currentStreak: 23,
    longestStreak: 91,
  })

  // Add repo state
  const [newRepo, setNewRepo] = useState({
    name: '',
    desc: '',
    lang: 'TypeScript',
    stars: 10,
    forks: 2,
    color: '#3178c6',
  })

  // Real-time polling every 3 seconds
  useEffect(() => {
    const loadData = () => {
      fetchGitHubData({}).then(data => {
        if (data && (data.repositoriesCount !== undefined || (data.recentRepos && data.recentRepos.length > 0))) {
          const repos = (data.recentRepos && data.recentRepos.length > 0) ? data.recentRepos : initialRecentRepos
          const calculatedLangs = calculateLangStatsFromRepos(repos)
          setGhData(prev => ({
            ...prev,
            repositoriesCount: data.repositoriesCount !== undefined ? data.repositoriesCount : prev.repositoriesCount,
            totalStars: data.totalStars !== undefined ? data.totalStars : prev.totalStars,
            followers: data.followers !== undefined ? data.followers : prev.followers,
            commitsThisYear: data.commitsThisYear !== undefined ? data.commitsThisYear : prev.commitsThisYear,
            currentStreak: data.currentStreak !== undefined ? data.currentStreak : prev.currentStreak,
            longestStreak: data.longestStreak !== undefined ? data.longestStreak : prev.longestStreak,
            recentRepos: repos,
            langStats: calculatedLangs,
            contribGrid: (data.contribGrid && data.contribGrid.length > 0) ? data.contribGrid : prev.contribGrid,
          }))
          setFormStats({
            repositoriesCount: data.repositoriesCount !== undefined ? data.repositoriesCount : 48,
            totalStars: data.totalStars !== undefined ? data.totalStars : 377,
            followers: data.followers !== undefined ? data.followers : 124,
            commitsThisYear: data.commitsThisYear !== undefined ? data.commitsThisYear : 847,
            currentStreak: data.currentStreak !== undefined ? data.currentStreak : 23,
            longestStreak: data.longestStreak !== undefined ? data.longestStreak : 91,
          })
        }
      })
    }

    loadData()
    const interval = setInterval(loadData, 3000)
    return () => clearInterval(interval)
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
      if (showAddRepoModal) {
        setShowAddRepoModal(true)
      } else {
        setShowEditModal(true)
      }
      setAuthError('')
      setPasscodeAttempt('')
    } else {
      setAuthError('Incorrect passcode. Hint: admin123')
    }
  }

  const handleSaveStats = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    let updatedRepos = ghData.recentRepos
    if (newRepo.name.trim()) {
      updatedRepos = [newRepo, ...updatedRepos]
    }
    const updatedLangs = calculateLangStatsFromRepos(updatedRepos)

    const updatedData = {
      ...ghData,
      repositoriesCount: parseInt(formStats.repositoriesCount || 0),
      totalStars: parseInt(formStats.totalStars || 0),
      followers: parseInt(formStats.followers || 0),
      commitsThisYear: parseInt(formStats.commitsThisYear || 0),
      currentStreak: parseInt(formStats.currentStreak || 0),
      longestStreak: parseInt(formStats.longestStreak || 0),
      recentRepos: updatedRepos,
      langStats: updatedLangs,
    }

    const res = await updateGitHubStats(updatedData, adminKey || 'admin123')
    setIsSubmitting(false)

    if (res.success && res.stats) {
      setGhData({
        ...res.stats,
        langStats: calculateLangStatsFromRepos(res.stats.recentRepos || updatedRepos)
      })
      setFormStats({
        repositoriesCount: res.stats.repositoriesCount,
        totalStars: res.stats.totalStars,
        followers: res.stats.followers,
        commitsThisYear: res.stats.commitsThisYear,
        currentStreak: res.stats.currentStreak,
        longestStreak: res.stats.longestStreak,
      })
    } else {
      setGhData(updatedData)
    }

    setShowEditModal(false)
    setShowAddRepoModal(false)
    setNewRepo({ name: '', desc: '', lang: 'TypeScript', stars: 10, forks: 2, color: '#3178c6' })
  }

  const handleAddSingleRepo = async (e) => {
    e.preventDefault()
    if (!newRepo.name.trim()) return

    setIsSubmitting(true)
    const updatedRepos = [newRepo, ...ghData.recentRepos]
    const updatedLangs = calculateLangStatsFromRepos(updatedRepos)

    const updatedData = {
      ...ghData,
      recentRepos: updatedRepos,
      langStats: updatedLangs,
      repositoriesCount: ghData.repositoriesCount + 1,
    }

    const res = await updateGitHubStats(updatedData, adminKey || 'admin123')
    setIsSubmitting(false)

    if (res.success && res.stats) {
      setGhData({
        ...res.stats,
        langStats: calculateLangStatsFromRepos(res.stats.recentRepos || updatedRepos)
      })
      setFormStats({
        repositoriesCount: res.stats.repositoriesCount,
        totalStars: res.stats.totalStars,
        followers: res.stats.followers,
        commitsThisYear: res.stats.commitsThisYear,
      })
    } else {
      setGhData(updatedData)
    }

    setShowAddRepoModal(false)
    setNewRepo({ name: '', desc: '', lang: 'TypeScript', stars: 10, forks: 2, color: '#3178c6' })
  }

  const openEditRepoModal = (repo, idx) => {
    setEditingRepoIndex(idx)
    setEditingRepo({ ...repo })
  }

  const handleSaveEditRepo = async (e) => {
    e.preventDefault()
    if (!editingRepo || editingRepoIndex < 0) return

    setIsSubmitting(true)
    const updatedRepos = [...ghData.recentRepos]
    updatedRepos[editingRepoIndex] = editingRepo
    const updatedLangs = calculateLangStatsFromRepos(updatedRepos)

    const updatedData = {
      ...ghData,
      recentRepos: updatedRepos,
      langStats: updatedLangs,
    }

    await updateGitHubStats(updatedData, adminKey || 'admin123')
    setIsSubmitting(false)

    setGhData(updatedData)
    setEditingRepoIndex(-1)
    setEditingRepo(null)
  }

  const handleDeleteRepo = async (repoName) => {
    if (!window.confirm(`Remove repository "${repoName}" from dashboard?`)) return
    const updatedRepos = ghData.recentRepos.filter(r => r.name !== repoName)
    const updatedLangs = calculateLangStatsFromRepos(updatedRepos)

    const updatedData = {
      ...ghData,
      recentRepos: updatedRepos,
      langStats: updatedLangs,
      repositoriesCount: Math.max(0, ghData.repositoriesCount - 1),
    }

    setGhData(updatedData)
    setFormStats(f => ({ ...f, repositoriesCount: Math.max(0, parseInt(f.repositoriesCount || 0) - 1) }))
    await updateGitHubStats(updatedData, adminKey || 'admin123')
  }

  const handleCellClick = async (idx) => {
    const weeks = 52
    const days = 7
    const defaultGrid = Array.from({ length: weeks * days }, (_, i) => {
      const w = Math.floor(i / 7)
      const isRecent = w > 34
      const seed = (i * 9301 + 49297) % 233280
      const active = (seed / 233280) > (isRecent ? 0.35 : 0.6)
      const lvl = active ? (i % 4) + 1 : 0
      return { id: i, lvl }
    })

    const baseGrid = (ghData.contribGrid && ghData.contribGrid.length === weeks * days) ? ghData.contribGrid : defaultGrid
    const updatedGrid = baseGrid.map((c, i) => {
      if (i === idx) {
        const nextLvl = ((c.lvl || 0) + 1) % 5
        return { id: i, lvl: nextLvl === 0 ? 1 : nextLvl }
      }
      return { id: i, lvl: c.lvl || 0 }
    })

    const newCommitCount = parseInt(ghData.commitsThisYear || 0) + 3
    const updatedData = {
      ...ghData,
      commitsThisYear: newCommitCount,
      contribGrid: updatedGrid,
    }

    setGhData(updatedData)
    setFormStats(f => ({ ...f, commitsThisYear: newCommitCount }))
    await updateGitHubStats(updatedData, adminKey || 'admin123')
  }

  const handleAddContributionActivity = async (addedCommits = 5) => {
    const weeks = 52
    const days = 7
    const defaultGrid = Array.from({ length: weeks * days }, (_, i) => {
      const w = Math.floor(i / 7)
      const isRecent = w > 34
      const seed = (i * 9301 + 49297) % 233280
      const active = (seed / 233280) > (isRecent ? 0.35 : 0.6)
      const lvl = active ? (i % 4) + 1 : 0
      return { id: i, lvl }
    })

    const baseGrid = (ghData.contribGrid && ghData.contribGrid.length === weeks * days) ? ghData.contribGrid : defaultGrid
    const updatedGrid = [...baseGrid]
    const lastWeekStartIndex = (weeks - 4) * days
    for (let i = lastWeekStartIndex; i < weeks * days; i++) {
      if (Math.random() > 0.4) {
        updatedGrid[i] = { id: i, lvl: Math.min(4, ((updatedGrid[i]?.lvl || 0) + 1)) }
      }
    }

    const newCommitCount = parseInt(ghData.commitsThisYear || 0) + addedCommits
    const updatedData = {
      ...ghData,
      commitsThisYear: newCommitCount,
      contribGrid: updatedGrid,
    }

    setGhData(updatedData)
    setFormStats(f => ({ ...f, commitsThisYear: newCommitCount }))
    await updateGitHubStats(updatedData, adminKey || 'admin123')
  }

  const statsList = [
    { icon: GitBranch, label: 'Repositories', value: ghData.repositoriesCount, color: '#4361ee' },
    { icon: Star, label: 'Total Stars', value: ghData.totalStars, color: '#f59e0b' },
    { icon: Users, label: 'Followers', value: ghData.followers, color: '#06b6d4' },
    { icon: GitCommitHorizontal, label: 'Commits (2024)', value: ghData.commitsThisYear, color: '#a855f7' },
  ]

  return (
    <section id="github" className="relative py-24 px-6">
      <div ref={ref} className="section-hidden max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-green-400"
              style={{ background: 'rgba(132,206,36,0.1)', border: '1px solid rgba(132,206,36,0.25)' }}>
              GITHUB ({ghData.recentRepos.length} Repos)
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
            Open Source <span className="gradient-text">Activity</span>
          </h2>

          <div className="flex items-center justify-center gap-3 mb-4">
            <a href="https://github.com/teknarayanyadav" target="_blank" rel="noopener noreferrer"
              className="text-white/40 hover:text-cyan-400 transition-colors text-sm font-mono">
              @teknarayanyadav ↗
            </a>
          </div>

          {/* Action Header bar: Add Repo & Edit Stats (Admin ONLY) */}
          {isAdmin && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setShowAddRepoModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105 cursor-pointer shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #4361ee)',
                  boxShadow: '0 0 20px rgba(6,182,212,0.3)',
                }}
              >
                <Plus size={16} /> + Add Repository
              </button>

              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105 cursor-pointer shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #84ce24, #06b6d4)',
                  boxShadow: '0 0 20px rgba(132,206,36,0.3)',
                }}
              >
                <Edit2 size={15} /> Edit GitHub Stats
              </button>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsList.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass rounded-2xl p-5 text-center">
              <Icon size={18} style={{ color }} className="mx-auto mb-2" />
              <AnimCounter target={value} color={color} />
              <div className="text-white/40 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Contribution graph */}
        <div className="glass rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <h3 className="text-white/70 text-sm font-semibold">Contribution Activity · 2024</h3>
              <button
                onClick={() => handleAddContributionActivity(5)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all cursor-pointer shadow-sm"
                title="Click to log contributions & trigger neon pulse animation"
              >
                <Plus size={12} /> Log Contribution
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <span>Less</span>
              {['rgba(255,255,255,0.04)', 'rgba(6,182,212,0.35)', 'rgba(67,97,238,0.6)', 'rgba(168,85,247,0.8)', '#00f2fe'].map((c, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-sm" style={{ background: c, boxShadow: i > 2 ? `0 0 6px ${c}` : 'none' }} />
              ))}
              <span>More</span>
            </div>
          </div>
          <ContribGraph gridData={ghData.contribGrid} commitsCount={ghData.commitsThisYear} isAdmin={isAdmin} onCellClick={handleCellClick} />
        </div>

        {/* Repos + Language stats */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-white/60 text-xs font-mono tracking-widest mb-3">PINNED REPOSITORIES</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {ghData.recentRepos.map((repo, idx) => (
                <div key={repo.name + idx}
                  className="glass rounded-xl p-4 hover:bg-white/5 transition-all hover:scale-[1.02] cursor-pointer group relative"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: repo.color || '#3178c6' }} />
                      <span className="text-cyan-400 text-sm font-mono font-medium group-hover:text-cyan-300 transition-colors">
                        {repo.name}
                      </span>
                    </div>
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            openEditRepoModal(repo, idx)
                          }}
                          className="p-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-colors cursor-pointer"
                          title="Edit Repository & Language"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteRepo(repo.name)
                          }}
                          className="p-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors cursor-pointer"
                          title="Delete Repository"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-white/45 text-xs leading-relaxed mb-3">{repo.desc}</p>
                  <div className="flex items-center gap-3 text-white/30 text-xs">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: repo.color || '#3178c6' }} />
                      {repo.lang}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Star size={10} /> {repo.stars}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <GitBranch size={10} /> {repo.forks}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Language stats */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-white/60 text-xs font-mono tracking-widest mb-4">LANGUAGES</h3>
            {/* Bar */}
            <div className="flex h-3 rounded-full overflow-hidden mb-4 gap-0.5">
              {ghData.langStats.map(l => (
                <div key={l.lang} style={{ width: `${l.pct}%`, background: l.color }} title={`${l.lang} ${l.pct}%`} />
              ))}
            </div>
            <div className="space-y-2.5">
              {ghData.langStats.map(l => (
                <div key={l.lang} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                    <span className="text-white/65 text-sm">{l.lang}</span>
                  </div>
                  <span className="text-white/30 text-xs font-mono">{l.pct}%</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/6">
              <h4 className="text-white/40 text-xs font-mono tracking-widest mb-3">STREAK</h4>
              <div className="flex justify-between text-center">
                {[
                  { label: 'Current', val: `${ghData.currentStreak !== undefined ? ghData.currentStreak : 23} days` },
                  { label: 'Longest', val: `${ghData.longestStreak !== undefined ? ghData.longestStreak : 91} days` },
                  { label: 'Total', val: `${ghData.commitsThisYear}` },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-sm font-bold text-cyan-400">{s.val}</div>
                    <div className="text-white/30 text-xs">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-cyan-600 flex items-center justify-center mx-auto mb-4">
              <Lock size={22} className="text-white" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Portfolio Owner Auth</h3>
            <p className="text-white/45 text-xs mb-5">Enter passcode to edit GitHub dashboard (Hint: admin123)</p>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Enter admin passcode..."
                value={passcodeAttempt}
                onChange={e => setPasscodeAttempt(e.target.value)}
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none text-center"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(132,206,36,0.3)' }}
              />
              {authError && <p className="text-red-400 text-xs">{authError}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowAuthModal(false)}
                  className="flex-1 py-2.5 rounded-xl glass text-white/50 text-sm cursor-pointer">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl font-semibold text-white text-sm cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #84ce24, #06b6d4)' }}>
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Edit GitHub Stats Modal */}
      {showEditModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setShowEditModal(false)}>
          <div className="glass-strong rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-7 cmd-panel"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-cyan-600 flex items-center justify-center">
                  <Edit2 size={16} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">Edit GitHub Metrics</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 glass rounded-xl text-white/50 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveStats} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">REPOSITORIES COUNT</label>
                  <input
                    type="number"
                    value={formStats.repositoriesCount}
                    onChange={e => setFormStats(f => ({ ...f, repositoriesCount: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">TOTAL STARS</label>
                  <input
                    type="number"
                    value={formStats.totalStars}
                    onChange={e => setFormStats(f => ({ ...f, totalStars: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">FOLLOWERS</label>
                  <input
                    type="number"
                    value={formStats.followers}
                    onChange={e => setFormStats(f => ({ ...f, followers: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">COMMITS THIS YEAR</label>
                  <input
                    type="number"
                    value={formStats.commitsThisYear}
                    onChange={e => setFormStats(f => ({ ...f, commitsThisYear: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">CURRENT STREAK (DAYS)</label>
                  <input
                    type="number"
                    value={formStats.currentStreak}
                    onChange={e => setFormStats(f => ({ ...f, currentStreak: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">LONGEST STREAK (DAYS)</label>
                  <input
                    type="number"
                    value={formStats.longestStreak}
                    onChange={e => setFormStats(f => ({ ...f, longestStreak: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 rounded-xl glass text-white/50 font-semibold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl font-semibold text-white cursor-pointer transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #84ce24, #06b6d4)' }}>
                  {isSubmitting ? 'Saving to MongoDB...' : 'Save & Update Dashboard'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Add Dedicated Repo Modal */}
      {showAddRepoModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setShowAddRepoModal(false)}>
          <div className="glass-strong rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-7 cmd-panel"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Plus size={16} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">Add New Pinned Repository</h3>
              </div>
              <button onClick={() => setShowAddRepoModal(false)} className="p-1.5 glass rounded-xl text-white/50 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSingleRepo} className="space-y-4">
              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">REPO NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ai-agent-framework"
                  value={newRepo.name}
                  onChange={e => setNewRepo(r => ({ ...r, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">DESCRIPTION *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous AI agent engine for web scraping"
                  value={newRepo.desc}
                  onChange={e => setNewRepo(r => ({ ...r, desc: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">LANGUAGE</label>
                  <input
                    type="text"
                    placeholder="TypeScript"
                    value={newRepo.lang}
                    onChange={e => setNewRepo(r => ({ ...r, lang: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl text-white text-xs outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">STARS</label>
                  <input
                    type="number"
                    value={newRepo.stars}
                    onChange={e => setNewRepo(r => ({ ...r, stars: parseInt(e.target.value || '0') }))}
                    className="w-full px-3 py-2 rounded-xl text-white text-xs outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">FORKS</label>
                  <input
                    type="number"
                    value={newRepo.forks}
                    onChange={e => setNewRepo(r => ({ ...r, forks: parseInt(e.target.value || '0') }))}
                    className="w-full px-3 py-2 rounded-xl text-white text-xs outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowAddRepoModal(false)}
                  className="flex-1 py-3 rounded-xl glass text-white/50 font-semibold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl font-semibold text-white cursor-pointer transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #4361ee)' }}>
                  {isSubmitting ? 'Saving to MongoDB...' : 'Add Repository'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Repository & Language Modal */}
      {editingRepo && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 cmd-overlay"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setEditingRepo(null)}>
          <div className="glass-strong rounded-3xl max-w-md w-full p-7 cmd-panel"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Edit2 size={16} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">Edit Repository & Language</h3>
              </div>
              <button onClick={() => setEditingRepo(null)} className="p-1.5 glass rounded-xl text-white/50 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEditRepo} className="space-y-4">
              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">REPO NAME *</label>
                <input
                  type="text"
                  required
                  value={editingRepo.name}
                  onChange={e => setEditingRepo(r => ({ ...r, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none bg-white/5 border border-white/10"
                />
              </div>

              <div>
                <label className="text-white/40 text-xs font-mono block mb-1">DESCRIPTION *</label>
                <input
                  type="text"
                  required
                  value={editingRepo.desc}
                  onChange={e => setEditingRepo(r => ({ ...r, desc: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none bg-white/5 border border-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">LANGUAGE *</label>
                  <input
                    type="text"
                    required
                    placeholder="TypeScript, Python, C++"
                    value={editingRepo.lang}
                    onChange={e => {
                      const val = e.target.value
                      const color = langColorMap[val] || editingRepo.color || '#3178c6'
                      setEditingRepo(r => ({ ...r, lang: val, color }))
                    }}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none bg-white/5 border border-white/10"
                  />
                </div>

                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">LANG COLOR</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={editingRepo.color || '#3178c6'}
                      onChange={e => setEditingRepo(r => ({ ...r, color: e.target.value }))}
                      className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                    />
                    <input
                      type="text"
                      value={editingRepo.color || '#3178c6'}
                      onChange={e => setEditingRepo(r => ({ ...r, color: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl text-white font-mono text-xs outline-none bg-white/5 border border-white/10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">STARS ⭐</label>
                  <input
                    type="number"
                    value={editingRepo.stars}
                    onChange={e => setEditingRepo(r => ({ ...r, stars: parseInt(e.target.value || '0') }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none bg-white/5 border border-white/10"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs font-mono block mb-1">FORKS 🍴</label>
                  <input
                    type="number"
                    value={editingRepo.forks}
                    onChange={e => setEditingRepo(r => ({ ...r, forks: parseInt(e.target.value || '0') }))}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none bg-white/5 border border-white/10"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setEditingRepo(null)}
                  className="flex-1 py-3 rounded-xl glass text-white/50 font-semibold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl font-semibold text-white cursor-pointer transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #4361ee)' }}>
                  {isSubmitting ? 'Saving to MongoDB...' : 'Save & Update Languages'}
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
