import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null
    const storedUser = window.localStorage.getItem('auth_user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem('auth_token')
  })
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (user) {
      window.localStorage.setItem('auth_user', JSON.stringify(user))
    } else {
      window.localStorage.removeItem('auth_user')
    }
  }, [user])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (token) {
      window.localStorage.setItem('auth_token', token)
    } else {
      window.localStorage.removeItem('auth_token')
    }
  }, [token])

  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        setIsAuthLoading(false)
        return
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (!res.ok || !data.user) {
          throw new Error(data.message || 'Session expired')
        }

        setUser(data.user)
      } catch {
        setUser(null)
        setToken(null)
      } finally {
        setIsAuthLoading(false)
      }
    }

    initializeAuth()
  }, [token])

  const signup = async ({ name, email, password }) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || 'Signup failed')
    }

    setUser(data.user)
    setToken(data.token)
    return data.user
  }

  const login = async ({ email, password }) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || 'Login failed')
    }

    setUser(data.user)
    setToken(data.token)
    return data.user
  }

  const updateProfile = async ({ name, email, password, avatar }) => {
    if (!token) {
      throw new Error('Not authorized')
    }

    const payload = { name, email, avatar }

    if (password) {
      payload.password = password
    }

    const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Profile update failed')
    }

    setUser(data.user)
    return data.user
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  const value = {
    user,
    token,
    isAuthLoading,
    isAuthenticated: !!user,
    signup,
    login,
    updateProfile,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)


