import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('auth_user')
      if (stored && localStorage.getItem('auth_token')) setUser(JSON.parse(stored))
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('auth_user', JSON.stringify(userData))
    localStorage.setItem('auth_token', token)
    setUser(userData)
  }

  const updateUser = (userData) => {
    localStorage.setItem('auth_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  const isAdmin = () => user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
