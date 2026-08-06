import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeSwitcher() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('portfolio-theme')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
      localStorage.setItem('portfolio-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
      localStorage.setItem('portfolio-theme', 'light')
    }
  }, [dark])

  return (
    <button
      onClick={() => setDark(d => !d)}
      className="fixed bottom-6 left-6 z-50 w-11 h-11 rounded-2xl glass flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-lg"
      style={{ border: '1px solid rgba(67,97,238,0.3)' }}
      title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {dark ? (
        <Sun size={18} className="text-amber-400 animate-pulse" />
      ) : (
        <Moon size={18} className="text-indigo-600" />
      )}
    </button>
  )
}
