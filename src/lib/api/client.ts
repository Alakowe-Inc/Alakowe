import axios from "axios"

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:7175/",
  headers: { "Content-Type": "application/json" },
})

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
    if (body.success) {
      response.data = body.data
      return response
    }
    return Promise.reject(new Error(body.message ?? "Request failed"))
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("alakowe_user")
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login"
      }
    }
    const problem = error.response?.data
    const message = problem?.detail ?? problem?.title ?? error.message
    return Promise.reject(new Error(message))
  },
)

export default client
