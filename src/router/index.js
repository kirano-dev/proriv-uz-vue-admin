// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const modules = import.meta.glob('../views/**/*.vue')

function filePathToRoute(filepath) {
  const relative = filepath.replace('../views', '')
  const noExt = relative.replace(/\.vue$/, '')
  // split into segments, transform [param] -> :param and [...all] -> :all(.*)*
  const segments = noExt.split('/').filter(Boolean).map(seg => {
    // index -> ignored in the end (handled later)
    if (seg === 'index') return '' 

    // [...all] -> :all(.*)*
    const catchAllMatch = seg.match(/^\[\.\.\.(.+)\]$/)
    if (catchAllMatch) {
      return `:${catchAllMatch[1]}(.*)*`
    }

    // [id] -> :id
    const paramMatch = seg.match(/^\[(.+)\]$/)
    if (paramMatch) {
      return `:${paramMatch[1]}`
    }

    return seg
  }).filter(Boolean)

  return '/' + segments.join('/')
}

const routes = Object.keys(modules).map((file) => {
  const path = filePathToRoute(file)
  // derive a route name: replace slashes with dashes, remove leading dash
  const name = (path === '/' ? 'home' : path.slice(1).replace(/\//g, '-'))
  return {
    path: path,
    name,
    component: modules[file], // lazy import: () => import('...') because import.meta.glob returns loader fn
    // Можно добавить meta, например:
    // meta: { auto: true }
  }
})

if (!routes.some(r => r.path === '/')) {
  // если у вас есть views/index.vue — лучше чтобы glob подхватил его как '/index' -> '/', но на всякий случай:
  routes.unshift({
    path: '/',
    name: 'home',
    component: () => import('@/views/index.vue')
  })
}

routes.push({
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/views/index.vue') // или '@/views/404.vue' если есть
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
