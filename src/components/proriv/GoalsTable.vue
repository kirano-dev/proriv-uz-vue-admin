<template>
  <div class="proriv-goals-block">
    <h3 class="proriv-goals-block__title">Цели</h3>
    <el-table
      class="proriv-goals-table"
      :data="goals"
      border
    >
      <el-table-column label="Цели" align="left" header-align="center">
        <template #default="{ row }">
          <span class="proriv-goals-table__goal">{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Результат" align="center" header-align="center">
        <template #default="{ row }">
          <span class="proriv-goals-table__result">
            {{ row.current }} / {{ row.target }} 
            <el-link class="proriv-goals-table__percent-link" :underline="false">
              ({{ formatPercent(row.current, row.target) }})
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
  goals: {
    type: Array,
    required: true
  }
})

function formatPercent(current, target) {
  if (!target) return '0%'
  const percent = Math.round((current / target) * 100)
  return `${percent}%`
}
</script>

<style scoped lang="scss">
.proriv-goals-block {
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

.proriv-goals-table {
  font-size: 14px;

  :deep(table) {
    table-layout: fixed;
    width: 100%;
  }

  :deep(col:nth-child(1)) {
    width: 80%;
  }

  :deep(col:nth-child(2)) {
    width: 20%;
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

  &__goal {
    color: var(--black);
  }

  &__result {
    color: var(--grey-text);
  }

  &__percent-link {
    cursor: pointer;

    :deep(.el-link__inner) {
      color: var(--blue);
    }
  }
}
</style>

