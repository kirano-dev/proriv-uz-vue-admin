<template>
  <div class="leads-layout">
    <Sidebar />

    <main class="leads-page">
      <div class="leads-page__inner">
        <el-breadcrumb class="leads-page__breadcrumbs" separator=">">
          <el-breadcrumb-item>Заявки на потоки</el-breadcrumb-item>
          <el-breadcrumb-item></el-breadcrumb-item>
        </el-breadcrumb>

        <h1 class="leads-page__title">Заявки на потоки</h1>

        <LeadsTabs 
          v-model="activeTab" 
          :tabs="tabs"
        />

        <LeadsTable 
          :leads="filteredLeads"
          @status-change="onStatusChange"
          @enroll="onEnroll"
        />

        <EnrollLeadDrawer
          v-model="isEnrollDrawerOpen"
          :programs="programs"
          @success="onEnrollSuccess"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import LeadsTabs from '@/components/leads/LeadsTabs.vue'
import LeadsTable from '@/components/leads/LeadsTable.vue'
import EnrollLeadDrawer from '@/components/leads/EnrollLeadDrawer.vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('new')
const isEnrollDrawerOpen = ref(false)
const selectedLead = ref(null)

const programs = ref([
  { id: 1, title: 'Лидерская программа 1' },
  { id: 2, title: 'Лидерская программа 2' },
  { id: 3, title: 'Лидерская программа 3' }
])

const tabs = ref([
  { label: 'Новые', value: 'new', count: 15 },
  { label: 'Думает', value: 'thinking', count: 20 },
  { label: 'Не отвечает', value: 'no_answer', count: 20 },
  { label: 'Записаны', value: 'enrolled', count: 20 },
  { label: 'Отказ', value: 'rejected', count: 35 }
])

const allLeads = ref([
  {
    id: 1,
    date: '19.02.2025, 19:00',
    program: 'Лидерская программа 1',
    phone: '(90) 999 99 99',
    status: 'new'
  },
  {
    id: 2,
    date: '19.02.2025, 18:30',
    program: 'Лидерская программа 2',
    phone: '(90) 888 88 88',
    status: 'new'
  },
  {
    id: 3,
    date: '19.02.2025, 17:00',
    program: 'Лидерская программа 1',
    phone: '(90) 777 77 77',
    status: 'thinking'
  },
  {
    id: 4,
    date: '18.02.2025, 15:00',
    program: 'Лидерская программа 3',
    phone: '(90) 666 66 66',
    status: 'no_answer'
  },
  {
    id: 5,
    date: '18.02.2025, 14:00',
    program: 'Лидерская программа 1',
    phone: '(90) 555 55 55',
    status: 'enrolled'
  },
  {
    id: 6,
    date: '17.02.2025, 12:00',
    program: 'Лидерская программа 2',
    phone: '(90) 444 44 44',
    status: 'rejected'
  }
])

const filteredLeads = computed(() => {
  return allLeads.value.filter(lead => lead.status === activeTab.value)
})

function onStatusChange({ leadId, newStatus }) {
  const lead = allLeads.value.find(l => l.id === leadId)
  if (lead) {
    lead.status = newStatus
  }
}

function onEnroll(lead) {
  selectedLead.value = lead
  isEnrollDrawerOpen.value = true
}

function onEnrollSuccess({ programId }) {
  const program = programs.value.find(p => p.id === programId)
  if (program && selectedLead.value) {
    console.log(`Заявка ${selectedLead.value.id} записана в ${program.title}`)
  }
  selectedLead.value = null
}
</script>

<style scoped lang="scss">
.leads-layout {
  display: flex;
  min-height: 100vh;
  background: var(--grey-bg);
}

.leads-page {
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

  &__title {
    margin: 0 0 30px 0;
    font-size: 28px;
    font-weight: 800;
    color: var(--black);
  }
}
</style>

