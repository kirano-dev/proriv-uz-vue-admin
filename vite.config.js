import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    svgLoader(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        sourceMap: true,
        additionalData: `@use "@/assets/styles/_vars.scss" as *;`
      }
    }
  },
})
