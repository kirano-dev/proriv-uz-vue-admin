<script setup>
import { ref } from 'vue'
import ChartSvg from '@/assets/icons/lp.svg' // после установки vite-svg-loader

const items = ref([
  { to: '/lp', label: 'Лидерская программа', svg: ChartSvg },
  { to: '/courses', label: 'Курсы', svg: ChartSvg }
])
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__logo">GROW UP</div>
    <nav>
      <ul>
        <li v-for="item in items" :key="item.to">
          <router-link :to="item.to" class="nav-link" active-class="is-active">
            <!-- динамически рендерим компонент иконки -->
            <component :is="item.svg" class="icon" />
            <span class="label">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>

</style>
