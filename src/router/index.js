import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/sign/in', component: () => import('@/sign/in.vue'), meta: { public: true } },
  { path: '/',        component: () => import('@/App.vue'),     meta: { public: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router