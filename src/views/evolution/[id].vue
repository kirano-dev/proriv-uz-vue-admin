<template>
  <div class="evolution-program-detail-layout">
    <Sidebar />

    <main class="evolution-program-detail">
      <div class="evolution-program-detail__inner">
        <ParticipantProfile
          v-if="selectedParticipantId"
          :program-title="program.title"
          :participant-id="selectedParticipantId"
          @excluded="onParticipantExcluded"
          @back="selectedParticipantId = null"
        />

        <template v-else>
          <ProgramHeader
            :program="program"
            @add-participant="onAddParticipant"
          />

          <el-tabs v-model="activeTab" class="evolution-program-detail__tabs">
            <el-tab-pane label="Цели" name="goals" />
            <el-tab-pane label="Секции" name="sections" />
          </el-tabs>

          <template v-if="activeTab === 'goals'">
          <GoalsProgressTable 
            :table-data="tableData" 
            :milestones-labels="milestonesLabels" 
          />

          <ParticipantsTable
            :participants="participants"
            @change-section="onChangeSection"
            @remove="onRemove"
            @open="onOpenParticipant"
          />

          <HabitsTable :habits="habits" />

          <CommunityProject
            v-model:projects="communityProjects"
            @edit="onEditProject"
            @save="handleSaveProject"
          />

          <GalleryBlock
            :items="galleryItems"
            @add="onAddGallery"
            @edit="onEditGallery"
            @delete="onDeleteGallery"
          />
        </template>
        <template v-else-if="activeTab === 'sections'">
          <SectionsTable
            :sections="sectionsData"
            @add="onAddSection"
            @edit="onEditSection"
            @delete="onDeleteSection"
          />

          <AddSectionDrawer
            v-model="isAddSectionDrawerOpen"
            @success="onSectionAdded"
          />

          <EditSectionDrawer
            v-model="isEditSectionDrawerOpen"
            :section="editingSection"
            @success="onSectionUpdated"
            @update:model-value="(val) => { if (!val) editingSection = null }"
          />
        </template>
        </template>

        <AddParticipantDrawer
          v-model="isAddParticipantDrawerOpen"
          :sections="sections"
          @success="onParticipantAdded"
        />

        <ChangeSectionDrawer
          v-model="isChangeSectionDrawerOpen"
          :sections="sections"
          :current-section="selectedParticipantForSectionChange?.section || ''"
          @success="onSectionChanged"
        />

        <EditCommunityProjectDrawer
          v-model="isEditProjectDrawerOpen"
          @success="onProjectAdded"
        />

        <AddGalleryPhotoDrawer
          v-model="isAddGalleryDrawerOpen"
          :edit-item="editingGalleryItem"
          @success="onGalleryPhotoAdded"
          @update="onGalleryPhotoUpdated"
          @update:model-value="(val) => { if (!val) editingGalleryItem = null }"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import AddSectionDrawer from '@/components/evolution/AddSectionDrawer.vue'
import EditSectionDrawer from '@/components/evolution/EditSectionDrawer.vue'
import AddParticipantDrawer from '@/components/evolution/AddParticipantDrawer.vue'
import ChangeSectionDrawer from '@/components/evolution/ChangeSectionDrawer.vue'
import EditCommunityProjectDrawer from '@/components/evolution/EditCommunityProjectDrawer.vue'
import AddGalleryPhotoDrawer from '@/components/evolution/AddGalleryPhotoDrawer.vue'
import ProgramHeader from '@/components/evolution/ProgramHeader.vue'
import ParticipantsTable from '@/components/evolution/ParticipantsTable.vue'
import GoalsProgressTable from '@/components/evolution/GoalsProgressTable.vue'
import HabitsTable from '@/components/evolution/HabitsTable.vue'
import CommunityProject from '@/components/evolution/CommunityProject.vue'
import GalleryBlock from '@/components/evolution/GalleryBlock.vue'
import SectionsTable from '@/components/evolution/SectionsTable.vue'
import ParticipantProfile from '@/components/evolution/ParticipantProfile.vue'
import { computed, reactive, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { http } from '@/lib/http'

const route = useRoute()
const router = useRouter()

const program = ref({
  id: null,
  title: 'Эволюция',
  start: '01.01.2025',
  end: '31.12.2025'
})

const activeTab = ref('goals')
const selectedParticipantId = ref(null)

const milestonesLabels = ['1', '2', '3', '4', '5']

const sections = ref([
  {
    id: 1,
    title: 'Секция 1',
    evolutionGoal: '10%',
    milestones: ['10%', '10%', '10%', '10%', '10%'],
    average: '10%',
    participants: [
      {
        name: 'Абдуллази Ниязов',
        phone: '(99)990 90 90',
        evolutionGoal: '10%',
        milestones: ['10%', '10%', '10%', '10%', '10%'],
        average: '10%'
      },
      {
        name: 'Абдуллази Ниязов',
        phone: '(99)990 90 90',
        evolutionGoal: '10%',
        milestones: ['10%', '10%', '10%', '10%', '10%'],
        average: '10%'
      }
    ]
  },
  {
    id: 2,
    title: 'Секция 2',
    evolutionGoal: '10%',
    milestones: ['10%', '10%', '10%', '10%', '10%'],
    average: '10%',
    participants: [
      {
        name: 'Участник 2',
        phone: '(99)990 90 90',
        evolutionGoal: '10%',
        milestones: ['10%', '10%', '10%', '10%', '10%'],
        average: '10%'
      },
      {
        name: 'Участник 2',
        phone: '(99)990 90 90',
        evolutionGoal: '10%',
        milestones: ['10%', '10%', '10%', '10%', '10%'],
        average: '10%'
      }
    ]
  }
])

const tableData = computed(() => {
  const rows = []

  sections.value.forEach((section, index) => {
    rows.push({
      id: `section-${section.id}`,
      type: 'section',
      participant: `${index + 1}. ${section.title}`,
      evolutionGoal: section.evolutionGoal,
      milestones: section.milestones,
      average: section.average
    })

    section.participants.forEach((participant, participantIndex) => {
      rows.push({
        id: `participant-${section.id}-${participantIndex}`,
        type: 'participant',
        participant: `${participant.name}, ${participant.phone}`,
        evolutionGoal: participant.evolutionGoal,
        milestones: participant.milestones,
        average: participant.average
      })
    })
  })

  return rows
})

const getRowClassName = ({ row }) => {
  if (row.type === 'section') {
    return 'section-row'
  }
  return ''
}

const getCellClassName = ({ row }) => {
  if (row.type === 'section') {
    return 'section-cell'
  }
  return ''
}

const participants = ref([
  { id: 1, name: 'Абдуллази Ниязов', phone: '(99)990 90 90', section: 'Секция 1' },
  { id: 2, name: 'Абдуллази Ниязов', phone: '(99)990 90 90', section: '' },
  { id: 3, name: 'Абдуллази Ниязов', phone: '(99)990 90 90', section: 'Секция 2' },
])

const isAddParticipantDrawerOpen = ref(false)
const isChangeSectionDrawerOpen = ref(false)
const selectedParticipantForSectionChange = ref(null)

function onAddParticipant() {
  isAddParticipantDrawerOpen.value = true
}

function onParticipantAdded(payload) {
  participants.value.push({
    id: Date.now() + Math.random(),
    name: payload.name,
    phone: payload.phone,
    section: payload.section || ''
  })
}

function onChangeSection(row) {
  selectedParticipantForSectionChange.value = row
  isChangeSectionDrawerOpen.value = true
}

function onSectionChanged(payload) {
  if (selectedParticipantForSectionChange.value) {
    const participant = participants.value.find(p => p.id === selectedParticipantForSectionChange.value.id)
    if (participant) {
      participant.section = payload.section || ''
    }
  }
  selectedParticipantForSectionChange.value = null
}

function onRemove(row) {
  ElMessageBox.confirm(
    `Исключить участника "${row.name}"?`,
    'Подтверждение',
    {
      confirmButtonText: 'Исключить',
      cancelButtonText: 'Отмена',
      type: 'warning'
    }
  )
    .then(() => {
      const index = participants.value.findIndex(p => p.id === row.id)
      if (index !== -1) {
        participants.value.splice(index, 1)
        ElMessage.success('Участник исключен из таблицы')
      }
    })
    .catch(() => {})
}

function onOpenParticipant(row) {
  if (row.id) {
    selectedParticipantId.value = row.id
  }
}

function onParticipantExcluded(participantId) {
  const index = participants.value.findIndex(p => p.id === participantId)
  if (index !== -1) {
    participants.value.splice(index, 1)
  }
  selectedParticipantId.value = null
}

const communityProjects = ref([
  {
    unit: 'Посаженные деревья',
    plan: 10,
    done: 5
  }
])

const isEditProjectDrawerOpen = ref(false)
const isAddGalleryDrawerOpen = ref(false)
const editingGalleryItem = ref(null)

function handleSaveProject() {
  // TODO: отправка данных на бэкенд
  ElMessage.success('Данные сохранены')
}

function onEditProject() {
  isEditProjectDrawerOpen.value = true
}

function onProjectAdded(payload) {
  communityProjects.value.push(payload)
}

const habits = ref([
  {
    id: 1,
    name: 'Абдуллази Ниязов',
    habits: [
      { id: 1, title: 'Тренировки', completed: 6, total: 12 },
      { id: 2, title: 'Походы к врачу', completed: 2, total: 4 },
    ]
  },
  {
    id: 2,
    name: 'Абдуллази Ниязов',
    habits: []
  },
  {
    id: 3,
    name: 'Абдуллази Ниязов',
    habits: [
      { id: 1, title: 'Тренировки', completed: 5, total: 10 },
      { id: 2, title: 'Походы к врачу', completed: 1, total: 2 },
      { id: 3, title: 'Чтение', completed: 12, total: 12 },
    ]
  }
])


const galleryPlaceholderUrl = new URL('@/assets/icons/galery.svg', import.meta.url).href

const galleryItems = ref([
  {
    id: 1,
    title: 'Выступление бизнес-аналитика компании Google',
    src: galleryPlaceholderUrl
  }
])

function onAddGallery() {
  editingGalleryItem.value = null
  isAddGalleryDrawerOpen.value = true
}

function onGalleryPhotoAdded(payload) {
  galleryItems.value.push({
    id: payload.id,
    title: payload.title,
    src: payload.src
  })
}

function onEditGallery(item) {
  editingGalleryItem.value = item
  isAddGalleryDrawerOpen.value = true
}

function onDeleteGallery(item) {
  ElMessageBox.confirm(
    `Удалить фото "${item.title}"?`,
    'Подтверждение',
    {
      confirmButtonText: 'Удалить',
      cancelButtonText: 'Отмена',
      type: 'warning'
    }
  )
    .then(() => {
      const index = galleryItems.value.findIndex(i => i.id === item.id)
      if (index !== -1) {
        galleryItems.value.splice(index, 1)
        ElMessage.success('Фото удалено')
      }
    })
    .catch(() => {})
}

function onGalleryPhotoUpdated(payload) {
  const index = galleryItems.value.findIndex(i => i.id === payload.id)
  if (index !== -1) {
    galleryItems.value[index] = {
      id: payload.id,
      title: payload.title,
      src: payload.src
    }
  }
  editingGalleryItem.value = null
}

const sectionsData = computed(() =>
  sections.value.map(section => ({
    id: section.id,
    title: section.title
  }))
)


const isAddSectionDrawerOpen = ref(false)
const isEditSectionDrawerOpen = ref(false)
const editingSection = ref(null)

function onAddSection() {
  isAddSectionDrawerOpen.value = true
}

function onEditSection(section) {
  editingSection.value = section
  isEditSectionDrawerOpen.value = true
}

function onDeleteSection(section) {
  ElMessageBox.confirm(
    `Удалить секцию "${section.title}"?`,
    'Подтверждение',
    {
      confirmButtonText: 'Удалить',
      cancelButtonText: 'Отмена',
      type: 'warning'
    }
  )
    .then(() => {
      const index = sections.value.findIndex(s => s.id === section.id)
      if (index !== -1) {
        sections.value.splice(index, 1)
        ElMessage.success('Секция удалена')
      }
    })
    .catch(() => {})
}

function onSectionAdded(payload) {
  sections.value.push({
    id: Date.now(),
    title: payload.title,
    evolutionGoal: '',
    milestones: [],
    average: '',
    participants: []
  })
}

function onSectionUpdated(payload) {
  const index = sections.value.findIndex(s => s.id === payload.id)
  if (index !== -1) {
    sections.value[index].title = payload.title
  }
  editingSection.value = null
}

function parseDate(v) {
  if (!v) return null
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return null
  return d
}

function formatDisplayDate(v) {
  const d = parseDate(v)
  if (!d) return ''
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}

async function fetchProgramDetail(id) {
  if (!id) return

  try {
    const { data } = await http.get('/groups', {
      params: {
        type: 'evolution',
        id
      }
    })

    const programData = Array.isArray(data?.data)
      ? data.data[0]
      : Array.isArray(data)
      ? data[0]
      : data?.data ?? data

    if (!programData) {
      throw new Error('Запись не найдена')
    }

    const title =
      programData.name ?? programData.title ?? programData.title_text ?? `Эволюция ${id}`
    const start = programData.start_date ?? programData.startDate ?? programData.start
    const end = programData.end_date ?? programData.endDate ?? programData.end

    program.value = {
      id: programData.id ?? id,
      title,
      start: start ? formatDisplayDate(start) : '',
      end: end ? formatDisplayDate(end) : ''
    }

  } catch (error) {
    console.error('fetchProgramDetail error', error)
    const message =
      error?.response?.data?.message ??
      error?.response?.data?.error ??
      error?.message ??
      'Не удалось загрузить данные программы'
    ElMessage.error(message)
  }
}

onMounted(() => {
  fetchProgramDetail(route.params.id)
})

watch(
  () => route.params.id,
  newId => {
    fetchProgramDetail(newId)
  }
)
</script>

<style scoped lang="scss">
.evolution-program-detail-layout {
  display: flex;
  min-height: 100vh;
  background: var(--ultra-light-grey);
}

.evolution-program-detail {
  flex: 1;
  padding: 30px;
  overflow: auto;

  &__inner {
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  :deep(.sections-add.el-button--primary span) {
    color: var(--white) !important;
  }

  &__tabs {
    :deep(.el-tabs__nav) {
      margin: 0;
    }

    :deep(.el-tabs__item) {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 13px 20px !important;
      font-size: 14px;
      color: #A8ABB2;
      margin: 0;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 3px;
        background: transparent;
        border-radius: 3px 3px 0 0;
        transform: scaleX(0);
        transform-origin: center;
        transition: transform 0.3s ease, background 0.3s ease;
      }

      &.is-active {
        color: var(--blue);
        font-weight: 600;

        &::after {
          background: var(--blue);
          transform: scaleX(1);
        }
      }
    }

    :deep(.el-tabs__active-bar) {
      display: none;
    }
  }

  &__table {
    font-size: 14px;

    :deep(.el-table__header-wrapper th) {
      font-weight: 700;
      color: #606266;
      height: 48px;
      background-color: var(--white);
    }

    :deep(.el-table__body-wrapper td) {
      height: 48px;
    }

    :deep(.section-row) {
      background-color: #dde7eb;
    }

    :deep(.section-cell) {
      font-weight: 700;
      color: var(--black);
    }

    :deep(.section-row .el-table__cell) {
      background-color: #dde7eb;
    }

    :deep(.el-table__cell) {
      border-color: #e0e6ed;
    }
  }

  &__cell-text {
    color: var(--black);
  }

  &__warning {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;

    &-text {
      color: var(--red);
    }

    &--append {
      padding: 10px 16px;
    }
  }
}

:deep(.el-breadcrumb__inner) {
  color: var(--light-grey) !important;
}
</style>