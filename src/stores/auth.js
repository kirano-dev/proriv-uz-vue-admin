import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || ''
  }),
  getters: {
    isAuthenticated: s => !!s.token
  },
  actions: {
    setToken(t) {
      this.token = t
      localStorage.setItem('token', t)
    },
    logout() {
      this.token = ''
      localStorage.removeItem('token')
    }
  }
})
