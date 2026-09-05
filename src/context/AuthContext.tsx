import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useLogin } from '../lib/api/auth/auth.hooks'
import { getCartApi } from '../lib/api/cart/cart.api'

interface User {
  userId: string
  email: string
  firstName: string
  lastName: string
}

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<Pick<User, 'firstName' | 'lastName'>>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const AUTH_KEY = 'alakowe_user'

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && parsed.email) {
      return {
        userId: parsed.userId ?? '',
        email: parsed.email,
        firstName: parsed.firstName ?? '',
        lastName: parsed.lastName ?? '',
      }
    }
    return null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const loginMutation = useLogin()
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(getStoredUser)

  async function login(email: string, password: string) {
    const result = await loginMutation.mutateAsync({ emailAddress: email, password })
    const u: User = {
      userId: result.userId ?? '',
      email: result.email ?? email,
      firstName: result.firstName ?? '',
      lastName: result.lastName ?? '',
    }
    localStorage.setItem('token', result.token ?? '')
    localStorage.setItem(AUTH_KEY, JSON.stringify(u))
    setUser(u)
    queryClient.fetchQuery({
      queryKey: ['cart'],
      queryFn: getCartApi,
    })
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem('token')
    setUser(null)
    queryClient.clear()
  }

  function updateUser(updates: Partial<Pick<User, 'firstName' | 'lastName'>>) {
    setUser(prev => {
      if (!prev) return prev
      const next = { ...prev, ...updates }
      localStorage.setItem(AUTH_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading: loginMutation.isPending }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
