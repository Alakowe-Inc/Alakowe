import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { LoginResponse, SignUpRequest } from '@/lib/api-types'
import * as authService from '@/services/auth.service'

interface AuthContextValue {
  user: LoginResponse | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignUpRequest) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'alakowe_token'
const REFRESH_KEY = 'alakowe_refresh_token'
const USER_KEY = 'alakowe_user'

function getStoredUser(): LoginResponse | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(getStoredUser)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token && !user) {
      setUser(getStoredUser())
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await authService.login({ emailAddress: email, password })
      if (result.token) localStorage.setItem(TOKEN_KEY, result.token)
      if (result.refreshToken) localStorage.setItem(REFRESH_KEY, result.refreshToken)
      localStorage.setItem(USER_KEY, JSON.stringify(result))
      setUser(result)
    } finally {
      setLoading(false)
    }
  }, [])

  const signup = useCallback(async (data: SignUpRequest) => {
    setLoading(true)
    try {
      await authService.signup(data)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const isAuthenticated = user !== null && !!localStorage.getItem(TOKEN_KEY)
  const isAdmin = user?.roleName === 'Admin'

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
