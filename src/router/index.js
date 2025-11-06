import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/index.vue'), meta: { public: true } },
  { path: '/lp', name: 'Lp', component: () => import('@/views/lp/index.vue') },
  { path: '/sign/in', name: 'SignIn', component: () => import('@/sign/in.vue'), meta: { public: true } },

  // catch-all — перенаправляем на домашнюю (или на 404-компонент)
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/index.vue') }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // корректный base для Vite
  routes,
})

export default router
