// lib/http.js
import axios from 'axios'
import { ElMessage } from 'element-plus'

/**
 * Нормализуем VITE_API_BASE из .env
 * - добавляем протокол по умолчанию (http://) если его нет
 * - убираем завершающие слеши
 */
function getApiBaseFromEnv() {
  let base = import.meta.env.VITE_API_BASE || ''
  base = String(base).trim()
  if (!base) return ''

  // если указан порт без протокола (например "192.168.1.6:8000/api/v1"), добавим http://
  if (!/^https?:\/\//i.test(base)) {
    base = `http://${base}`
  }

  // убираем завершающий слеш(и)
  base = base.replace(/\/+$/, '')

  return base
}

const API_BASE = getApiBaseFromEnv()

// если API_BASE пуст — axios будет использовать относительные пути (полезно для same-origin)
const http = axios.create({
  baseURL: API_BASE || undefined, // если undefined — используем относительные URL (например '/auth/login')
  withCredentials: false, // переключи в true если используешь cookie-based auth (Sanctum)
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// подставим токен из localStorage при старте
const TOKEN_KEY = 'access_token'
const token = localStorage.getItem(TOKEN_KEY)
if (token) {
  http.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Перехватчик ответов: централизованная обработка ошибок
http.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      // 401 — сессия устарела / невалидный токен
      if (status === 401) {
        // очищаем localStorage и заголовок
        localStorage.removeItem(TOKEN_KEY)
        delete http.defaults.headers.common['Authorization']
        ElMessage.error('Сессия истекла. Пожалуйста, выполните вход заново.')
        // опционально: window.location.href = '/sign/in'
      } else if (data && data.message) {
        // сообщения от API показываем пользователю
        ElMessage.error(data.message)
      } else {
        ElMessage.error('Ошибка сервера')
      }
    } else {
      // network error
      ElMessage.error('Ошибка соединения с сервером')
    }

    return Promise.reject(error)
  }
)

export { http, API_BASE }
export default http
