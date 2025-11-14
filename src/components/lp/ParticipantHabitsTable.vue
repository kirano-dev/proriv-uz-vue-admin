<template>
  <div class="participant-habits-block">
    <h3 class="participant-habits-block__title">Привычки</h3>
    <el-table
      class="participant-habits-table"
      :data="habits"
      border
    >
      <el-table-column label="Привычки" align="left" header-align="center">
        <template #default="{ row }">
          <span class="participant-habits-table__habit">{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Результат" align="left" header-align="center">
        <template #default="{ row }">
          <span class="participant-habits-table__result">
            {{ row.completed }} / {{ row.total }} 
            <el-link class="participant-habits-table__percent-link" :underline="false">
              ({{ formatPercent(row.completed, row.total) }})
            </el-link>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ElLink } from 'element-plus'

defineProps({
  habits: {
    type: Array,
    required: true
  }
})

function formatPercent(completed, total) {
  if (!total) return '0%'
  const percent = Math.round((completed / total) * 100)
  return `${percent}%`
}
</script>

<style scoped lang="scss">
.participant-habits-block {
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

.participant-habits-table {
  font-size: 14px;

  :deep(table) {
    table-layout: fixed;
    width: 100%;
  }

  :deep(col:nth-child(1)) {
    width: 70%;
  }

  :deep(col:nth-child(2)) {
    width: 30%;
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

  &__habit {
    color: var(--table-text);
  }

  &__result {
    color: var(--table-text);
  }

  &__percent-link {
    cursor: pointer;
    
    :deep(.el-link__inner) {
      color: var(--blue);
    }
  
  }
}
</style>

