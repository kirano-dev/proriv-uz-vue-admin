<template>
  <div class="habits-report-block">
    <h3 class="habits-report-block__title">Отчёты по привычкам</h3>
    <el-table
      class="habits-report-table"
      :data="tableData"
      border
      :row-class-name="getRowClassName"
    >
      <el-table-column label="Дата" min-width="200" align="left" header-align="center">
        <template #default="{ row }">
          <div v-if="row.isDateRow" class="habits-report-table__date-cell">
            <span class="habits-report-table__date">{{ row.date }}</span>
          </div>
          <span v-else class="habits-report-table__habit-name">{{ row.habit }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Результат" min-width="200" align="right" header-align="center">
        <template #default="{ row }">
          <span v-if="!row.isDateRow && row.result" class="habits-report-table__result" v-html="formatResultWithLink(row.result)"></span>
          <span v-else-if="!row.isDateRow" class="habits-report-table__not-filled">Не заполнено</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  reports: {
    type: Array,
    required: true
  }
})

const tableData = computed(() => {
  const rows = []
  
  props.reports.forEach(report => {
    rows.push({
      id: `date-${report.date}`,
      isDateRow: true,
      date: report.date,
      habit: '',
      result: ''
    })
    
    if (report.habits && report.habits.length > 0) {
      report.habits.forEach(habit => {
        rows.push({
          id: `habit-${report.date}-${habit.id}`,
          isDateRow: false,
          date: '',
          habit: habit.title,
          result: habit.result || null
        })
      })
    } else {
      rows.push({
        id: `empty-${report.date}`,
        isDateRow: false,
        date: '',
        habit: 'Нет данных',
        result: null
      })
    }
  })
  
  return rows
})

function getRowClassName({ row }) {
  return row.isDateRow ? 'habits-report-table__date-row' : ''
}

function formatResultWithLink(result) {
  if (!result) return ''
  return result.replace(/\(([^)]+%)\)/g, (match, percent) => {
    return `(<a href="#" class="habits-report-table__percent-link" onclick="event.preventDefault(); return false;">${percent}</a>)`
  })
}
</script>

<style scoped lang="scss">
.habits-report-block {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__title {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    color: var(--black);
  }
}

.habits-report-table {
  font-size: 14px;

  :deep(.el-table) {
    table-layout: fixed;
  }

  :deep(.el-table__header-wrapper th) {
    background: var(--table-header-bg);
    color: var(--table-text);
    font-weight: 600;
    height: 40px;
  }

  :deep(.el-table__row) {
    height: 35px;
  }

  :deep(.el-table__cell) {
    border-color: var(--table-border);
  }

  :deep(.el-table__header-wrapper th:nth-child(1)),
  :deep(.el-table__body-wrapper td:nth-child(1)) {
    width: 50%;
  }

  :deep(.el-table__header-wrapper th:nth-child(2)),
  :deep(.el-table__body-wrapper td:nth-child(2)) {
    width: 50%;
  }

  &__date-cell {
    padding: 0;
    margin: 0;
  }

  &__date {
    background: var(--table-row-bg);
    display: block;
    padding: 8px 16px;
    margin: -8px -16px;
    font-weight: 600;
    color: var(--black);
  }

  &__habit-name {
    color: var(--table-text);
    padding-left: 16px;
  }

  &__result {
    color: var(--table-text);
  }

  :deep(.habits-report-table__percent-link) {
    color: var(--blue);
    cursor: pointer;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  &__not-filled {
    color: var(--red-error);
  }

  :deep(.habits-report-table__date-row) {
    background: var(--table-row-bg);
  }
}
</style>

