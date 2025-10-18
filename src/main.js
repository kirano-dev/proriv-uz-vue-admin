import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router' 
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import ru from 'element-plus/dist/locale/ru.mjs'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(ElementPlus, { locale: ru })
  .mount('#app')