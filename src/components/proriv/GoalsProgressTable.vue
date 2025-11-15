<template>
  <div class="proriv-goals-progress-block">
    <el-table
      class="proriv-goals-progress-table"
      :data="tableData"
      border
      :row-class-name="getRowClassName"
    >
      <el-table-column label="Участники" align="left" header-align="center" min-width="200">
        <template #default="{ row }">
          <span v-if="row.type === 'section'" class="proriv-goals-progress-table__section-title">
            {{ row.participant }}
          </span>
          <span v-else class="proriv-goals-progress-table__participant-name">
            {{ row.participant }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="Заявленная цель" align="center" header-align="center" min-width="140">
        <template #default="{ row }">
          {{ row.evolutionGoal }}
        </template>
      </el-table-column>

      <el-table-column 
        v-for="(label, index) in milestonesLabels" 
        :key="index"
        :label="label"
        align="center"
        header-align="center"
        min-width="90"
      >
        <template #default="{ row }">
          {{ row.milestones[index] }}
        </template>
      </el-table-column>

      <el-table-column label="Средний %" align="center" header-align="center" min-width="110">
        <template #default="{ row }">
          {{ row.average }}
        </template>
      </el-table-column>

      <template #append>
        <tr class="proriv-goals-progress-table__warning-row">
          <td :colspan="milestonesLabels.length + 3" class="proriv-goals-progress-table__warning-cell">
            <div class="proriv-goals-progress-table__warning">
              <WarningIcon class="proriv-goals-progress-table__warning-icon" />
              <span class="proriv-goals-progress-table__warning-text">Декларация не загружена</span>
            </div>
          </td>
        </tr>
      </template>
    </el-table>
  </div>
</template>

<script setup>
import WarningIcon from '@/assets/icons/warning.svg'

defineProps({
  tableData: {
    type: Array,
    required: true
  },
  milestonesLabels: {
    type: Array,
    required: true
  }
})

function getRowClassName({ row }) {
  return row.type === 'section' ? 'proriv-goals-progress-table__section-row' : ''
}
</script>

<style scoped lang="scss">
.proriv-goals-progress-block {
  margin-top: 30px;
}

.proriv-goals-progress-table {
  width: 100%;
  font-size: 12px;

  :deep(.el-table) {
    width: 100%;
  }

  :deep(.el-table__header-wrapper th) {
    background: var(--table-header-bg);
    color: var(--table-text);
    font-weight: 700;
    height: 35px;
  }

  :deep(.el-table__row) {
    height: 33px;
  }

  :deep(.el-table__cell) {
    border-color: var(--table-border);
  }

  &__section-title {
    font-weight: 700;
    color: var(--black);
  }

  &__participant-name {
    color: var(--table-text);
    font-size: 12px;
  }

  &__warning-row {
    background: var(--white);
  }

  &__warning-cell {
    padding: 10px 16px;
    border-color: var(--table-border);
  }

  &__warning {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
  }

  &__warning-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  &__warning-text {
    color: var(--red);
  }

  :deep(.proriv-goals-progress-table__section-row) {
    background: var(--table-row-bg);
    
    td {
      font-weight: 700;
    }
  }
}
</style>

