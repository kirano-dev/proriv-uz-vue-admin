<template>
  <div class="proriv-participant-profile">
    <ParticipantHeader
      :program-title="programTitle"
      :participant-name="participant.name"
      :participant-phone="participant.phone"
      :added-date="participant.addedDate"
      @download-declaration="onDownloadDeclaration"
      @exclude="onExclude"
    />

    <ParticipantHabitsTable :habits="habits" />

    <HabitsReportTable :reports="habitReports" />

    <GoalsTable :goals="goals" />

    <GoalsReportTable :reports="goalReports" />
  </div>
</template>

<script setup>
import ParticipantHeader from '@/components/proriv/ParticipantHeader.vue'
import ParticipantHabitsTable from '@/components/proriv/ParticipantHabitsTable.vue'
import HabitsReportTable from '@/components/proriv/HabitsReportTable.vue'
import GoalsTable from '@/components/proriv/GoalsTable.vue'
import GoalsReportTable from '@/components/proriv/GoalsReportTable.vue'
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { http } from '@/lib/http'

const props = defineProps({
  programTitle: {
    type: String,
    required: true
  },
  participantId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['excluded', 'back'])

const participant = ref({
  id: null,
  name: '',
  phone: '',
  addedDate: ''
})

const habits = ref([
  { id: 1, title: 'Тренировки', completed: 6, total: 12 },
  { id: 2, title: 'Походы к врачу', completed: 6, total: 12 }
])

const habitReports = ref([
  {
    date: '02.03.2025',
    habits: [
      { id: 1, title: 'Тренировки', result: '6 / 12 (+5%)' },
      { id: 2, title: 'Походы к врачу', result: '6 / 12 (+5%)' }
    ]
  },
  {
    date: '03.03.2025',
    habits: [
      { id: 1, title: 'Тренировки', result: null },
      { id: 2, title: 'Походы к врачу', result: null }
    ]
  }
])

const goals = ref([
  { id: 1, title: 'Звёздная цель', current: 20000, target: 40000 }
])

const goalReports = ref([
  {
    date: '02.03.2025',
    goals: [
      { id: 1, title: 'Звёздная цель', result: '6 / 12 (+5%)', description: 'тренировки' },
      { id: 2, title: 'Звёздная цель', result: '3 / 5 (+5%)', description: 'семейные мероприятия' }
    ]
  },
  {
    date: '03.03.2025',
    goals: [
      { id: 1, title: 'Звёздная цель', result: null, description: null }
    ]
  }
])

function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${dd}.${mm}.${yyyy}, ${hh}:${min}`
}

async function fetchParticipantData() {
  if (!props.participantId) return

  try {
    participant.value = {
      id: props.participantId,
      name: 'Абдулазиз Ниязов',
      phone: '(90)999 99 99',
      addedDate: formatDate(new Date('2025-09-10T15:00:00'))
    }
  } catch (error) {
    console.error('fetchParticipantData error', error)
    ElMessage.error('Не удалось загрузить данные участника')
  }
}

function onDownloadDeclaration() {
  ElMessage.info('Функция скачивания декларации будет реализована')
}

function onExclude() {
  ElMessageBox.confirm(
    'Исключить участника из потока?',
    'Подтверждение',
    {
      confirmButtonText: 'Исключить',
      cancelButtonText: 'Отмена',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        ElMessage.success('Участник исключен')
        emit('excluded', participant.value.id)
      } catch (error) {
        ElMessage.error('Ошибка при исключении участника')
      }
    })
    .catch(() => {})
}

watch(() => props.participantId, () => {
  if (props.participantId) {
    fetchParticipantData()
  }
}, { immediate: true })

onMounted(() => {
  if (props.participantId) {
    fetchParticipantData()
  }
})
</script>

<style scoped lang="scss">
.proriv-participant-profile {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>


