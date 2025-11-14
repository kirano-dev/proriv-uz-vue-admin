<template>
  <div class="events-layout">
    <Sidebar />

    <main class="events-page">
      <div class="events-page__inner">
        <el-breadcrumb class="events-page__breadcrumbs" separator=">">
          <el-breadcrumb-item>События</el-breadcrumb-item>
          <el-breadcrumb-item></el-breadcrumb-item>
        </el-breadcrumb>

        <div class="events-page__header">
          <h1 class="events-page__title">События</h1>
          <el-button 
            type="primary" 
            class="events-page__add-btn"
            @click="onAddEvent"
          >
            Добавить событие
          </el-button>
        </div>

        <LeadsTabs 
          v-model="activeTab" 
          :tabs="tabs"
        />

        <EventsTable 
          :events="filteredEvents"
          :is-archive="activeTab === 'archive'"
          @edit="onEditEvent"
          @toggle-archive="onToggleArchive"
          @view-participants="onViewParticipants"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import LeadsTabs from '@/components/leads/LeadsTabs.vue'
import EventsTable from '@/components/events/EventsTable.vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('active')

const tabs = ref([
  { label: 'Активные', value: 'active', count: 0 },
  { label: 'Архив', value: 'archive', count: 0 }
])

const allEvents = ref([
  {
    id: 1,
    dateTime: '02.03.2025, 19:00',
    title: 'Выступление бизнес - аналитика компании Google',
    participants: 10,
    isArchived: false
  },
  {
    id: 2,
    dateTime: '05.03.2025, 18:00',
    title: 'Мастер-класс по продажам',
    participants: 25,
    isArchived: false
  },
  {
    id: 3,
    dateTime: '01.02.2025, 20:00',
    title: 'Конференция по маркетингу',
    participants: 50,
    isArchived: true
  }
])

const filteredEvents = computed(() => {
  return allEvents.value.filter(event => 
    activeTab.value === 'active' ? !event.isArchived : event.isArchived
  )
})

function onAddEvent() {
  ElMessage.info('Добавление события')
}

function onEditEvent(event) {
  ElMessage.info(`Редактирование: ${event.title}`)
}

function onToggleArchive(event) {
  const action = event.isArchived ? 'перемещено в активные' : 'перемещено в архив'
  event.isArchived = !event.isArchived
  ElMessage.success(`Событие ${action}`)
}

function onViewParticipants(event) {
  ElMessage.info(`Просмотр участников события: ${event.title}`)
}
</script>

<style scoped lang="scss">
.events-layout {
  display: flex;
  min-height: 100vh;
  background: var(--grey-bg);
}

.events-page {
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

