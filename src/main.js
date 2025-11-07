import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router' 
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import ru from 'element-plus/dist/locale/ru.mjs'
import '@/assets/styles/global.scss'
import { useAuthStore } from '@/stores/auth'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(ElementPlus, { locale: ru })
  .mount('#app')

app.use(pinia)
app.use(router)

const auth = useAuthStore()

async function init() {
  auth.loadToken()            // если токен есть — подставляет в axios
  if (auth.token) {
    // попробуем подгрузить профиль — если токен просрочен, store очистит токен
    await auth.fetchUser()
  }
  app.mount('#app')
}

init()