import { useEffect, useState } from 'react'

export default function LoadingScreen({ onDone }) {
  const [pct, setPct] = useState(0)
  const [phase, setPhase] = useState(0)

  const phases = [
    'Initializing AI Core...',
    'Loading Neural Networks...',
    'Compiling Portfolio...',
    'Optimizing Experience...',
    'Ready to Launch 🚀',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setPct(p => {
        const next = Math.min(p + Math.random() * 8 + 2, 100)
        setPhase(Math.floor((next / 100) * (phases.length - 1)))
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(onDone, 600)
        }
        return next
      })
    }, 60)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: '#050816' }}
    >
      {/* Animated rings */}
      <div className="relative mb-10">
        {[80, 56, 36].map((size, i) => (
          <div
            key={size}
            className="absolute rounded-full border"
            style={{
              width: size,
              height: size,
              top: '50%',
              left: '50%',
              marginLeft: -size / 2,
              marginTop: -size / 2,
              borderColor: i === 0 ? 'rgba(67,97,238,0.3)' : i === 1 ? 'rgba(168,85,247,0.4)' : 'rgba(6,182,212,0.5)',
              animation: `spin-slow ${8 + i * 4}s linear infinite ${i % 2 === 1 ? 'reverse' : ''}`,
            }}
          />
        ))}
        {/* Center glyph */}
        <div
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
          style={{
            background: 'linear-gradient(135deg, #4361ee, #a855f7)',
            boxShadow: '0 0 40px rgba(67,97,238,0.6)',
            zIndex: 1,
          }}
        >
          TN
        </div>
      </div>

      {/* Name */}
      <h1 className="text-2xl font-black text-white mb-1 tracking-tight">Tek Narayan Yadav</h1>
      <p className="text-white/40 text-sm font-mono mb-8">Full Stack · AI Engineer</p>

      {/* Progress bar */}
      <div className="w-64 h-0.5 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #4361ee, #a855f7, #06b6d4)',
            boxShadow: '0 0 8px rgba(67,97,238,0.8)',
          }}
        />
      </div>

      {/* Status text */}
      <p className="text-xs font-mono text-white/35">{phases[phase]}</p>

      {/* Pct */}
      <p className="text-xs font-mono text-white/20 mt-1">{Math.floor(pct)}%</p>
    </div>
  )
}
