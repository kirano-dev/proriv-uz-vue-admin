<script setup>
import Sidebar from '@/components/Sidebar.vue'
import CreateProrivFlowDrawer from '@/components/proriv/CreateProrivFlowDrawer.vue'
import EditLeadershipModal from '@/components/EditGroup.vue'
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { http } from '@/lib/http'

const showCreate = ref(false)
const showEdit = ref(false)

const selectedGroup = ref(null)
const router = useRouter()

const activeTab = ref('active')
const page = ref(1)
const pageSize = 10

const loading = ref(false)
const items = ref([])

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

function daysLeftFrom(endDate) {
  const today = new Date()
  const t = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
  const e = parseDate(endDate)
  if (!e) return 0
  const endUTC = new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate()))
  const diffMs = endUTC - t
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

function mapGroupToRow(g) {
  const id = g.id ?? g._id ?? Date.now()
  const name = g.name ?? g.title ?? g.title_text ?? ''
  const start_date_raw = g.start_date ?? g.startDate ?? g.start
  const end_date_raw = g.end_date ?? g.endDate ?? g.end
  const participants = g.participants ?? g.participants_count ?? 0
  const percent = g.percent ?? g.average_percent ?? 0

  const endDateObj = parseDate(end_date_raw)
  const finished = endDateObj ? (endDateObj < new Date(new Date().setHours(0, 0, 0, 0))) : false
  const daysLeft = daysLeftFrom(end_date_raw)

  return {
    id,
    title: name,
    participants,
    start: start_date_raw ? formatDisplayDate(start_date_raw) : '',
    end: end_date_raw ? formatDisplayDate(end_date_raw) : '',
    daysLeft: daysLeft > 0 ? daysLeft : 0,
    percent,
    finished,
    __raw: g
  }
}

async function fetchProrivGroups() {
  loading.value = true
  try {
    const { data } = await http.get('/groups', {
      params: {
        type: 'proriv',
        status: 'active',
      }
    })

    const itemsArray = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : data?.data?.items ?? data?.data ?? [])

    const rawList = Array.isArray(itemsArray) ? itemsArray : []

    items.value = rawList.map(mapGroupToRow)
  } catch (err) {
    console.error('fetchProrivGroups error', err)
    const msg =
      err?.response?.data?.message ||
      'Ошибка при загрузке программ'
    ElMessage.error(msg)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProrivGroups()
})

const filtered = computed(() => {
  if (!items.value) return []
  if (activeTab.value === 'active') {
    return items.value.filter(i => !i.finished)
  } else {
    return items.value.filter(i => i.finished)
  }
})

const displayed = computed(() => {
  const start = (page.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

function rowKey(row) {
  return row.id
}

function openRow(row) {
  if (!row?.id) return
  router.push(`/proriv/${row.id}`)
}

function editRow(row) {
  selectedGroup.value = row.__raw ?? {
    id: row.id,
    name: row.title,
    start_date: row.start,
    end_date: row.end,
    type: 'proriv'
  }
  showEdit.value = true
}

function onCreated(newFlow) {
  const mapped = mapGroupToRow(newFlow)
  items.value.unshift(mapped)
  page.value = 1
}

function onUpdated(updatedGroup) {
  const id = updatedGroup?.id ?? updatedGroup?._id
  if (!id) {
    ElMessage.success('Группа обновлена')
    showEdit.value = false
    return
  }

  const idx = items.value.findIndex(i => String(i.id) === String(id))
  if (idx !== -1) {
    const newRow = mapGroupToRow(updatedGroup)
    items.value.splice(idx, 1, newRow)
  } else {
    items.value.unshift(mapGroupToRow(updatedGroup))
  }

  ElMessage.success('Группа обновлена')
  showEdit.value = false
}

const navItems = []
</script>


<template>
  <div class="layout">
    <Sidebar :items="navItems" @select="onSelect">
      <template>
      </template>
    </Sidebar>

    <main class="content">
      <div class="programm">
        <div class="programm__head">
          <h1>Прорыв</h1>
          <button @click="showCreate = true">Создать поток</button>
        </div>
      </div>
      <div class="table-container">
        <el-tabs v-model="activeTab" type="border-card">
          <el-tab-pane label="Активные" name="active"></el-tab-pane>
          <el-tab-pane label="Завершённые" name="finished"></el-tab-pane>
        </el-tabs>

        <el-table :data="displayed" stripe style="width: 100%; margin-top: 12px;" :row-key="rowKey" size="small">
          <el-table-column prop="title" label="Потоки" min-width="220" />
          <el-table-column prop="participants" label="Участники" width="120" />
          <el-table-column prop="start" label="Старт" width="120" />
          <el-table-column prop="end" label="Конец" width="120" />

          <el-table-column label="Осталось" width="120">
            <template #default="{ row }">
              <span class="remaining" :class="{ 'remaining--danger': row.daysLeft <= 30 }">
                {{ row.daysLeft }} дней
              </span>
            </template>
          </el-table-column>

          <el-table-column label="Средний %" width="120">
            <template #default="{ row }">
              <span class="percent" :class="{ 'percent--high': row.percent >= 75 }">
                {{ row.percent }}%
              </span>
            </template>
          </el-table-column>

          <el-table-column label="Действие" min-width="160" align="right">
            <template #default="{ row }">
              <a class="action" @click.prevent="openRow(row)">Открыть</a>
              <span class="divider">|</span>
              <a class="action" @click.prevent="editRow(row)">Редактировать</a>
            </template>
          </el-table-column>
        </el-table>

        <div style="display:flex; justify-content:flex-end; margin-top:12px;">
          <el-pagination background :page-size="pageSize" v-model:current-page="page" :total="filtered.length"
            layout="prev, pager, next" />
        </div>
      </div>
    </main>
  </div>


  <CreateProrivFlowDrawer v-model="showCreate" @success="onCreated" />
  <EditLeadershipModal v-model:visible="showEdit" :group="selectedGroup" @updated="onUpdated" />
</template>

<style scoped></style>

