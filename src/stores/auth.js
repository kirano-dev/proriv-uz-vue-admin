// stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { http } from '@/lib/http' // axios инстанс

const TOKEN_KEY = 'access_token'

// helper: нормализуем VITE_API_BASE из .env
function getApiBaseFromEnv() {
  let base = import.meta.env.VITE_API_BASE || ''
  base = String(base).trim()

  if (!base) return '' // не задано — будем использовать относительные пути

  // если нет протокола — добавим http:// по умолчанию
  if (!/^https?:\/\//i.test(base)) {
    base = `http://${base}`
  }

  // уберём завершающие слеши
  base = base.replace(/\/+$/, '')

  return base
}

const API_BASE = getApiBaseFromEnv()

// строим конечный путь: если API_BASE задан — возвращаем абсолютный URL, иначе относительный путь
function apiPath(path) {
  // path должен начинаться с ведущего слэша: '/auth/user'
  if (!path.startsWith('/')) path = '/' + path
  return API_BASE ? `${API_BASE}${path}` : path
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || null)
  const user = ref(null)

  function setToken(t) {
    token.value = t
    if (t) {
      localStorage.setItem(TOKEN_KEY, t)
      http.defaults.headers.common['Authorization'] = `Bearer ${t}`
    } else {
      localStorage.removeItem(TOKEN_KEY)
      delete http.defaults.headers.common['Authorization']
    }
  }

  function loadToken() {
    const t = localStorage.getItem(TOKEN_KEY)
    if (t) {
      setToken(t)
    }
  }

  async function fetchUser() {
    if (!token.value) return null
    try {
      // используем apiPath — если в .env указан base, будет абсолютный вызов
      const { data } = await http.get(apiPath('/auth/user'))
      user.value = data
      return data
    } catch (e) {
      // если токен устарел/невалидный — чистим
      setToken(null)
      user.value = null
      return null
    }
  }

  async function logout() {
    try {
      await http.post(apiPath('/auth/logout'))
    } catch (_) {
      // игнорируем ошибки при logout
    } finally {
      setToken(null)
      user.value = null
      ElMessage.success('Выход выполнен')
      router.push({ name: 'sign-in' })
    }
  }

  return { token, user, setToken, loadToken, fetchUser, logout }
})
