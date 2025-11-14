<template>
  <div class="leads-table-block">
    <el-table
      class="leads-table"
      :data="leads"
      border
    >
      <el-table-column label="Дата и время заявки" align="left" header-align="center" min-width="180">
        <template #default="{ row }">
          <span class="leads-table__date">{{ row.date }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Желаемая программа" align="left" header-align="center" min-width="220">
        <template #default="{ row }">
          <span class="leads-table__program">{{ row.program }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Телефон" align="left" header-align="center" min-width="150">
        <template #default="{ row }">
          <span class="leads-table__phone">{{ row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Статус" align="left" header-align="center" min-width="280">
        <template #default="{ row }">
          <div class="leads-table__status-cell">
            <el-select
              :model-value="row.status"
              @update:model-value="onStatusChange(row.id, $event)"
              size="small"
              class="leads-table__status-select"
            >
              <el-option label="Новые" value="new" />
              <el-option label="Думает" value="thinking" />
              <el-option label="Не отвечает" value="no_answer" />
              <el-option label="Записаны" value="enrolled" />
              <el-option label="Отказ" value="rejected" />
            </el-select>
            <el-button
              size="small"
              class="leads-table__enroll-btn"
              @click="onEnroll(row)"
            >
              Записать
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
defineProps({
  leads: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['status-change', 'enroll'])

function onStatusChange(leadId, newStatus) {
  emit('status-change', { leadId, newStatus })
}

function onEnroll(lead) {
  emit('enroll', lead)
}
</script>

<style scoped lang="scss">
.leads-table-block {
  margin-top: 30px;
}

.leads-table {
  width: 100%;
  font-size: 14px;

  :deep(table) {
    table-layout: fixed;
    width: 100%;
  }

  :deep(col:nth-child(1)) {
    width: 20%;
  }

  :deep(col:nth-child(2)) {
    width: 30%;
  }

  :deep(col:nth-child(3)) {
    width: 30%;
  }

  :deep(col:nth-child(4)) {
    width: 15%;
  }

  :deep(.el-table__header-wrapper th) {
    background: var(--table-header-bg);
    color: var(--table-text);
    font-weight: 700;
    height: 40px;
  }

  :deep(.el-table__row) {
    height: 32px;
  }

  :deep(.el-table__cell) {
    border-color: var(--table-border);
  }

  &__date,
  &__program,
  &__phone {
    color: var(--table-text);
    font-size: 14px;
  }

  &__status-cell {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__status-select {
    flex: 1;

    :deep(.el-input__wrapper) {
      border-radius: 6px;
    }

    :deep(.el-input__inner) {
      color: var(--table-text);
    }
  }

  &__enroll-btn {
    padding: 0px 16px;
    background: var(--blue);

    :deep(span) {
        color: var(--white);
    }
  }
}
</style>

