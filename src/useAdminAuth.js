import { useState, useEffect } from 'react'

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('portfolio_admin_auth') === 'true'
  })

  useEffect(() => {
    const handleAuthChange = (e) => {
      if (e.detail && typeof e.detail.isAdmin === 'boolean') {
        setIsAdmin(e.detail.isAdmin)
      } else {
        setIsAdmin(localStorage.getItem('portfolio_admin_auth') === 'true')
      }
    }

    window.addEventListener('admin-auth-changed', handleAuthChange)
    return () => window.removeEventListener('admin-auth-changed', handleAuthChange)
  }, [])

  const login = (passcode) => {
    if (passcode === 'admin123' || passcode.trim().length > 0) {
      localStorage.setItem('portfolio_admin_auth', 'true')
      localStorage.setItem('portfolio_admin_key', passcode)
      setIsAdmin(true)
      window.dispatchEvent(new CustomEvent('admin-auth-changed', { detail: { isAdmin: true } }))
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('portfolio_admin_auth')
    localStorage.removeItem('portfolio_admin_key')
    setIsAdmin(false)
    window.dispatchEvent(new CustomEvent('admin-auth-changed', { detail: { isAdmin: false } }))
  }

  return { isAdmin, login, logout }
}
