// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const modules = import.meta.glob('../views/**/*.vue')

function filePathToRoute(filepath) {
  const relative = filepath.replace('../views', '')
  const noExt = relative.replace(/\.vue$/, '')
  const segments = noExt
    .split('/')
    .filter(Boolean)
    .map(seg => {
      if (seg === 'index') return '' // index -> root of the folder

      // [...all] -> :all(.*)*
      const catchAllMatch = seg.match(/^\[\.\.\.(.+)\]$/)
      if (catchAllMatch) return `:${catchAllMatch[1]}(.*)*`

      // [id] -> :id
      const paramMatch = seg.match(/^\[(.+)\]$/)
      if (paramMatch) return `:${paramMatch[1]}`

      return seg
    })
    .filter(Boolean)

  return '/' + segments.join('/')
}

// Собираем маршруты из views
let autoRoutes = Object.keys(modules).map((file) => {
  const path = filePathToRoute(file)
  // имя: '/' -> 'home', иначе без ведущего слэша и с дефисами
  const name = path === '/' ? 'home' : path.slice(1).replace(/\//g, '-')

  return {
    path,
    name,
    // import.meta.glob дает функцию-загрузчик — можно передать её напрямую
    component: modules[file],
  }
})

// Уберём автоматически созданный маршрут /sign/in (если есть) — мы добавим его явно как публичный
autoRoutes = autoRoutes.filter(r => r.path !== '/sign/in' && r.name !== 'sign-in')

// Если нет корня — добавим явно (на случай, если не было index.vue)
if (!autoRoutes.some(r => r.path === '/')) {
  autoRoutes.unshift({
    path: '/',
    name: 'home',
    component: () => import('@/views/index.vue')
  })
}

// Теперь явный public route: /sign/in
const publicRoutes = [
  {
    path: '/sign/in',
    name: 'sign-in',
    component: () => import('@/views/sign/in.vue')
  }
]

// Явно добавляем роуты для заявок, доступов и событий
const leadsRoute = {
  path: '/leads',
  name: 'leads',
  component: () => import('@/views/leads/index.vue')
}

const accessRoute = {
  path: '/access',
  name: 'access',
  component: () => import('@/views/access/index.vue')
}

const eventsRoute = {
  path: '/events',
  name: 'events',
  component: () => import('@/views/events/index.vue')
}

// NotFound (fallback)
const notFoundRoute = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/views/index.vue') // или '@/views/404.vue'
}

const routes = [
  ...publicRoutes,
  leadsRoute,
  accessRoute,
  eventsRoute,
  ...autoRoutes,
  notFoundRoute
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // загрузим токен из localStorage в store, если он ещё не загружен
  if (auth.token === null) {
    auth.loadToken()
  }

  // если есть токен, но профиль ещё не загружен — попробуем подгрузить
  if (auth.token && !auth.user) {
    try {
      await auth.fetchUser()
    } catch (e) {
      // fetchUser внутри store очистит токен при ошибке
    }
  }

  const tokenExists = !!auth.token

  // If route is public (sign-in) -> allow
  const isSignIn = to.name === 'sign-in'

  // если нет токена и это не sign-in -> редирект
  if (!tokenExists && !isSignIn) {
    return next({ name: 'sign-in', query: { redirect: to.fullPath } })
  }

  // если есть токен и пытаются открыть sign-in -> отправим на home
  if (tokenExists && isSignIn) {
    return next({ name: 'home' })
  }

  // иначе — разрешаем навигацию
  next()
})

export default router
