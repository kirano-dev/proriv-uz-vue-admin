<template>
  <div class="access-layout">
    <Sidebar />

    <main class="access-page">
      <div class="access-page__inner">
        <el-breadcrumb class="access-page__breadcrumbs" separator=">">
          <el-breadcrumb-item>Открыть доступы</el-breadcrumb-item>
          <el-breadcrumb-item></el-breadcrumb-item>
        </el-breadcrumb>

        <div class="access-page__header">
          <h1 class="access-page__title">Открыть доступы</h1>
          <el-button 
            type="primary" 
            class="access-page__add-btn"
            @click="onAddUser"
          >
            Добавить пользователя
          </el-button>
        </div>

        <LeadsTabs 
          v-model="activeTab" 
          :tabs="tabs"
        />

        <AccessTable 
          :users="filteredUsers"
          :is-blocked="activeTab === 'blocked'"
          @edit="onEditUser"
          @toggle-block="onToggleBlock"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import LeadsTabs from '@/components/leads/LeadsTabs.vue'
import AccessTable from '@/components/access/AccessTable.vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('active')

const tabs = ref([
  { label: 'Активные', value: 'active', count: 0 },
  { label: 'Заблокированные', value: 'blocked', count: 0 }
])

const allUsers = ref([
  {
    id: 1,
    fullName: 'Аязов Аяз',
    login: 'ikacheva0201',
    role: 'Менеджер',
    isBlocked: false
  },
  {
    id: 2,
    fullName: 'Иванов Иван',
    login: 'ivanov2023',
    role: 'Администратор',
    isBlocked: false
  },
  {
    id: 3,
    fullName: 'Петров Петр',
    login: 'petrov2024',
    role: 'Менеджер',
    isBlocked: true
  }
])

const filteredUsers = computed(() => {
  return allUsers.value.filter(user => 
    activeTab.value === 'active' ? !user.isBlocked : user.isBlocked
  )
})

function onAddUser() {
  ElMessage.info('Добавление пользователя')
}

function onEditUser(user) {
  ElMessage.info(`Редактирование: ${user.fullName}`)
}

function onToggleBlock(user) {
  const action = user.isBlocked ? 'разблокирован' : 'заблокирован'
  user.isBlocked = !user.isBlocked
  ElMessage.success(`Пользователь ${action}`)
}
</script>

<style scoped lang="scss">
.access-layout {
  display: flex;
  min-height: 100vh;
  background: var(--grey-bg);
}

.access-page {
  flex: 1;
  display: flex;
  flex-direction: column;

  &__breadcrumbs {
    font-size: 14px;
    color: var(--light-grey);
    margin-bottom: 20px;

    :deep(.el-breadcrumb__inner) {
      color: var(--light-grey);
    }

    :deep(.el-breadcrumb__separator) {
      color: var(--light-grey);
      opacity: 0.6;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
  }

  &__title {
    margin: 0;
    font-size: 28px;
    font-weight: 800;
    color: var(--black);
  }

  &__add-btn {
    :deep(span) {
      color: var(--white);
    }
  }
}
</style>

