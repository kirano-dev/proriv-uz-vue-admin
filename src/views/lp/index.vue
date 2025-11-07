<script setup>
import Sidebar from '@/components/Sidebar.vue'
import { ref, computed } from 'vue'
import CreateLeadershipModal from '@/components/CreateLeadershipModal.vue'

const showCreate = ref(false)

function onCreated(newFlow) {
  // Добавляем в items локально, чтобы таблица обновилась мгновенно
  items.value.unshift({
    id: newFlow.id || Date.now(),
    title: newFlow.title,
    participants: newFlow.participants ?? 0,
    start: newFlow.start_date ?? newFlow.startDate ?? newFlow.start,
    end: newFlow.end_date ?? newFlow.endDate ?? newFlow.end,
    daysLeft: 0,
    percent: 0,
    finished: false
  })
}

function onSelect(item) {
  console.log('selected', item)
  // например, переход через router.push(...) или изменение состояния
}

const activeTab = ref('active')
const page = ref(1)
const pageSize = 10

// пример данных — замените на ваши реальные
const items = ref([
  { id: 1, title: 'Лидерская программа 3', participants: 10, start: '10.09.2025', end: '30.09.2025', daysLeft: 20, percent: 80, finished: false },
  { id: 2, title: 'Лидерская программа 2', participants: 10, start: '10.09.2025', end: '30.09.2025', daysLeft: 20, percent: 80, finished: false },
  { id: 3, title: 'Лидерская программа 1', participants: 10, start: '10.09.2025', end: '30.09.2025', daysLeft: 20, percent: 80, finished: false },
  // пример завершённой
  { id: 4, title: 'Поток завершён', participants: 12, start: '01.06.2025', end: '30.06.2025', daysLeft: 0, percent: 92, finished: true },
])

const filtered = computed(() => {
  return items.value.filter(i => (activeTab.value === 'active' ? !i.finished : i.finished))
})

const displayed = computed(() => {
  const start = (page.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

function rowKey(row) {
  return row.id
}

function openRow(row) {
  // ваша логика: роут, диалог и т.д.
  console.log('open', row)
}

function editRow(row) {
  // ваша логика
  console.log('edit', row)
}
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
          <h1>Лидерская программа</h1>
          <button @click="showCreate = true">Добавить</button>
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

        <!-- пагинация (опционально) -->
        <div style="display:flex; justify-content:flex-end; margin-top:12px;">
          <el-pagination background :page-size="pageSize" :current-page.sync="page" :total="filtered.length"
            layout="prev, pager, next" />
        </div>
      </div>
    </main>
  </div>


  <CreateLeadershipModal v-model:visible="showCreate" @created="onCreated" />
</template>

<style scoped></style>
