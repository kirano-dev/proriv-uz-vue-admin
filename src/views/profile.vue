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
import Sidebar from '@/components/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()

async function onLogout() {
  try {
    await ElMessageBox.confirm('Вы действительно хотите выйти?', 'Подтвердите', {
      confirmButtonText: 'Выйти',
      cancelButtonText: 'Отмена',
      type: 'warning',
    })
    await auth.logout()
  } catch (e) {
    // отмена
  }
}
</script>
