<script setup>
import Sidebar from '@/components/Sidebar.vue'
function onSelect(item){
  console.log('selected', item)
  // например, переход через router.push(...) или изменение состояния
}
</script>

<template>
  <div class="layout">
    <Sidebar :items="navItems" @select="onSelect">
      <template>
      </template>
    </Sidebar>

    <main class="content">
      <h1>Добро пожаловать</h1>
      <p>Приятного рабочего дня</p>
    </main>
  </div>
</template>

<style scoped>
</style>
