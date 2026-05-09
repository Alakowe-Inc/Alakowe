import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { appNavigate } from './navigate'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const LOGIN_URL = '/login'
const ADMIN_LOGIN_URL = '/admin/login'

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public requestId?: string,
  ) {
    super(message)
  }
}

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('alakowe_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function isOnLoginPage(): boolean {
  return window.location.pathname === LOGIN_URL || window.location.pathname === ADMIN_LOGIN_URL
}

function clearAuthAndRedirect() {
  localStorage.removeItem('alakowe_token')
  localStorage.removeItem('alakowe_refresh_token')
  localStorage.removeItem('alakowe_user')
  if (!isOnLoginPage()) {
    appNavigate(LOGIN_URL)
  }
}

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (isOnLoginPage()) {
        throw new ApiError('Unauthorized', 401)
      }
      const refreshToken = localStorage.getItem('alakowe_refresh_token')
      if (refreshToken && error.config && !error.config.url?.includes('/auth/')) {
        try {
          const { data } = await axios.post(`${API_URL}/api/v1/auth/refresh-token`, {
            refreshToken,
          })
          if (data.success && data.data?.token) {
            localStorage.setItem('alakowe_token', data.data.token)
            if (error.config.headers) {
              error.config.headers.Authorization = `Bearer ${data.data.token}`
            }
            return apiClient(error.config)
          }
        } catch {
          clearAuthAndRedirect()
        }
      } else {
        clearAuthAndRedirect()
      }
    }
    const data = error.response?.data as Record<string, unknown> | undefined
    const apiMessage = data?.message as string | undefined
    const apiCode = data?.code as string | undefined
    throw new ApiError(
      apiMessage || error.message || 'An unexpected error occurred',
      error.response?.status || 500,
      apiCode,
      data?.requestId as string | undefined,
    )
  },
)

export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await apiClient.get(url, { params })
  const body = response.data as { success: boolean; data: T; message?: string }
  if (!body.success) {
    throw new ApiError(body.message || 'Request failed', response.status)
  }
  return body.data
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const response = await apiClient.post(url, body)
  const data = response.data as { success: boolean; data: T; message?: string }
  if (!data.success) {
    throw new ApiError(data.message || 'Request failed', response.status)
  }
  return data.data
}

export async function apiPut<T>(url: string, body?: unknown): Promise<T> {
  const response = await apiClient.put(url, body)
  const data = response.data as { success: boolean; data: T; message?: string }
  if (!data.success) {
    throw new ApiError(data.message || 'Request failed', response.status)
  }
  return data.data
}

export async function apiDelete<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await apiClient.delete(url, { params })
  const data = response.data as { success: boolean; data: T; message?: string }
  if (!data.success) {
    throw new ApiError(data.message || 'Request failed', response.status)
  }
  return data.data
}

export default apiClient
