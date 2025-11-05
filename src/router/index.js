import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/index.vue'

const routes = [
  { path: '/', component: () => import('@/views/index.vue'), meta: { public: true } },
  { path: '/sign/in', component: () => import('@/sign/in.vue'), meta: { public: true } },
  { path: '/', component: () => import('@/views/index.vue'), meta: { public: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router