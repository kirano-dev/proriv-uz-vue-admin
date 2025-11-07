<script setup>
import { ref } from 'vue'
import lpSvg from '@/assets/icons/lp.svg'
import evolutionSvg from '@/assets/icons/evolution.svg'
import prorivSvg from '@/assets/icons/proriv.svg'
import clubSvg from '@/assets/icons/club.svg'
import leadsSvg from '@/assets/icons/leads.svg'
import accessSvg from '@/assets/icons/access.svg'
import eventsSvg from '@/assets/icons/events.svg'

const items = ref([
  { to: '/lp', label: 'Лидерская программа', svg: lpSvg },
  { to: '/evolution', label: 'Эволюция', svg: evolutionSvg },
  { to: '/proriv', label: 'Прорыв', svg: prorivSvg },
  { to: '/leads', label: 'Заявки', svg: leadsSvg },
  { to: '/access', label: 'Открыть доступ', svg: accessSvg },
  { to: '/events', label: 'События', svg: eventsSvg },
  { to: '/club', label: 'GrowUp Club', svg: clubSvg },
  { to: '/profile', label: 'Профиль', svg: clubSvg },
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
