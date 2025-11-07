// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import ru from 'element-plus/dist/locale/ru.mjs'
import '@/assets/styles/global.scss'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus, { locale: ru })

// Инициализация auth перед mount
async function init() {
  const auth = useAuthStore()
  auth.loadToken() // подставит токен в axios если есть
  if (auth.token) {
    // попытаемся подгрузить профиль; если токен невалидный, fetchUser очистит token
    await auth.fetchUser()
  }
  app.mount('#app')
}

init()
