<template>

      <div class="layout">
    <Sidebar :items="navItems" @select="onSelect">
      <template>
      </template>
    </Sidebar>

    <main class="content">
      <h1>Профиль</h1>
      <el-button type="text" @click="onLogout">Выйти</el-button>
    </main>
  </div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { http } from '@/lib/http'
import Sidebar from '@/components/Sidebar.vue'

const router = useRouter()
const TOKEN_KEY = 'access_token'

async function onLogout() {
  try {
    await ElMessageBox.confirm('Вы действительно хотите выйти?', 'Подтвердите', {
      confirmButtonText: 'Выйти',
      cancelButtonText: 'Отмена',
      type: 'warning',
    })

    // Попробуем вызвать API logout. Если бек не поддерживает — всё равно почистим локально.
    try {
      await http.post('/auth/logout') // если API путь другой — замените
    } catch (e) {
      // игнорируем ошибки — всё равно продолжим выход
      console.warn('Logout API failed', e)
    }

    // Очистка client-side
    localStorage.removeItem(TOKEN_KEY)
    delete http.defaults.headers.common['Authorization']

    ElMessage.success('Выход выполнен')
    router.push({ name: 'sign-in' })
  } catch (e) {
    // отмена — ничего
  }
}
</script>
