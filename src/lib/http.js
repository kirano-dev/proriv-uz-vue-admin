import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/',
})

http.interceptors.request.use(config => {
  const auth = useAuthStore()
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`
  return config
})

http.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      const auth = useAuthStore()
      auth.logout()
      router.replace({ name: 'sign-in' })
    }
    return Promise.reject(err)
  }
)
