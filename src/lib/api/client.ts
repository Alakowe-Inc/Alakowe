import axios from "axios"
import { toast } from "react-toastify"

declare module "axios" {
  export interface AxiosRequestConfig {
    skipSuccessToast?: boolean
  }
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:7175/",
  headers: { "Content-Type": "application/json" },
})

const mutatingMethods = new Set(["post", "put", "patch", "delete"])

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => {
    const body = response.data
    const isMutating = mutatingMethods.has(response.config.method ?? "")

    // A few legacy endpoints (notably /orders) return their DTOs directly
    // instead of the shared { success, data, message } response envelope.
    if (typeof body?.success !== "boolean") {
      return response
    }

    if (body.success) {
      if (isMutating && body.message && !response.config.skipSuccessToast) toast.success(body.message)
      response.data = body.data
      return response
    }

    const msg = body.message ?? "Request failed"
    if (isMutating) toast.error(msg)
    return Promise.reject(new Error(msg))
  },
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("alakowe_user")
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login"
      }
      const message = error.response?.data?.message ?? "Session expired. Please log in again."
      return Promise.reject(new Error(message))
    }

    const problem = error.response?.data
    const message = problem?.message ?? problem?.detail ?? problem?.title ?? error.message
    toast.error(message)
    return Promise.reject(new Error(message))
  },
)

export default client
