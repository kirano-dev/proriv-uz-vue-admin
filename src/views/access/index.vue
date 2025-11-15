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

    <AddUserDrawer 
      v-model="isAddUserDrawerOpen"
      @success="onAddUserSuccess"
    />

    <EditUserDrawer 
      v-model="isEditUserDrawerOpen"
      :user="selectedUser"
      @success="onEditUserSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import LeadsTabs from '@/components/leads/LeadsTabs.vue'
import AccessTable from '@/components/access/AccessTable.vue'
import AddUserDrawer from '@/components/access/AddUserDrawer.vue'
import EditUserDrawer from '@/components/access/EditUserDrawer.vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('active')
const isAddUserDrawerOpen = ref(false)
const isEditUserDrawerOpen = ref(false)
const selectedUser = ref(null)

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
    email: 'ayazov@example.com',
    isBlocked: false
  },
  {
    id: 2,
    fullName: 'Иванов Иван',
    login: 'ivanov2023',
    role: 'Администратор',
    email: 'ivanov@example.com',
    isBlocked: false
  },
  {
    id: 3,
    fullName: 'Петров Петр',
    login: 'petrov2024',
    role: 'Менеджер',
    email: 'petrov@example.com',
    isBlocked: true
  }
])

const filteredUsers = computed(() => {
  return allUsers.value.filter(user => 
    activeTab.value === 'active' ? !user.isBlocked : user.isBlocked
  )
})

function onAddUser() {
  isAddUserDrawerOpen.value = true
}

function onEditUser(user) {
  selectedUser.value = user
  isEditUserDrawerOpen.value = true
}

function onToggleBlock(user) {
  const action = user.isBlocked ? 'разблокирован' : 'заблокирован'
  user.isBlocked = !user.isBlocked
  ElMessage.success(`Пользователь ${action}`)
}

function onAddUserSuccess(userData) {
  const newUser = {
    id: allUsers.value.length + 1,
    fullName: userData.fullName,
    login: userData.login,
    role: userData.role,
    email: userData.email,
    isBlocked: false
  }
  allUsers.value.unshift(newUser)
  isAddUserDrawerOpen.value = false
}

function onEditUserSuccess(updatedData) {
  const userIndex = allUsers.value.findIndex(u => u.id === updatedData.id)
  if (userIndex !== -1) {
    allUsers.value[userIndex] = {
      ...allUsers.value[userIndex],
      fullName: updatedData.fullName,
      login: updatedData.login,
      role: updatedData.role,
      email: updatedData.email
    }
  }
  isEditUserDrawerOpen.value = false
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

