<template>
  <div class="proriv-goals-report-block">
    <h3 class="proriv-goals-report-block__title">Отчёты по целям</h3>
    <el-table
      class="proriv-goals-report-table"
      :data="tableData"
      border
      :row-class-name="getRowClassName"
    >
      <el-table-column label="Дата" min-width="200" align="left" header-align="center">
        <template #default="{ row }">
          <div v-if="row.isDateRow" class="proriv-goals-report-table__date-cell">
            <span class="proriv-goals-report-table__date">{{ row.date }}</span>
          </div>
          <span v-else class="proriv-goals-report-table__goal-name">{{ row.goal }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Результат" min-width="200" align="center" header-align="center">
        <template #default="{ row }">
          <div v-if="!row.isDateRow" class="proriv-goals-report-table__result-cell">
            <template v-if="row.result && row.description">
              <span class="proriv-goals-report-table__result" v-html="formatResultWithLink(row.result)"></span>
              <span class="proriv-goals-report-table__description">{{ row.description }}</span>
            </template>
            <template v-else-if="row.result">
              <span class="proriv-goals-report-table__result" v-html="formatResultWithLink(row.result)"></span>
            </template>
            <template v-else>
              <span class="proriv-goals-report-table__not-filled proriv-goals-report-table__not-filled--end">Не заполнено</span>
            </template>
          </div>
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
      goal: '',
      result: '',
      description: ''
    })
    
    if (report.goals && report.goals.length > 0) {
      report.goals.forEach(goal => {
        rows.push({
          id: `goal-${report.date}-${goal.id}`,
          isDateRow: false,
          date: '',
          goal: goal.title,
          result: goal.result || null,
          description: goal.description || null
        })
      })
    } else {
      rows.push({
        id: `empty-${report.date}`,
        isDateRow: false,
        date: '',
        goal: 'Нет данных',
        result: null,
        description: null
      })
    }
  })
  
  return rows
})

function getRowClassName({ row }) {
  return row.isDateRow ? 'proriv-goals-report-table__date-row' : ''
}

function formatResultWithLink(result) {
  if (!result) return ''
  return result.replace(/\(([^)]+%)\)/g, (match, percent) => {
    return `(<a href="#" class="proriv-goals-report-table__percent-link" onclick="event.preventDefault(); return false;">${percent}</a>)`
  })
}
</script>

<style scoped lang="scss">
.proriv-goals-report-block {
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

.proriv-goals-report-table {
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

  &__goal-name {
    color: var(--table-text);
    padding-left: 16px;
  }

  &__result-cell {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 16px;
  }

  &__result {
    color: var(--table-text);
  }

  &__description {
    color: var(--table-text);
  }

  :deep(.proriv-goals-report-table__percent-link) {
    color: var(--blue);
    cursor: pointer;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  &__not-filled {
    color: var(--red-error);

    &--end {
      margin-left: auto;
    }
  }

  :deep(.proriv-goals-report-table__date-row) {
    background: var(--table-row-bg);
  }
}
</style>

