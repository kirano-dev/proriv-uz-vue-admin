<template>
  <div class="participants-block">
    <h3>Участники:</h3>
    <el-table
      class="participants-table"
      :data="participants"
      border
      stripe
    >
      <el-table-column label="Участники" min-width="260" align="left" header-align="center">
        <template #default="{ row }">
          <span class="participants-table__name">{{ row.name }}, {{ row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Секция" min-width="140" align="left" header-align="center">
        <template #default="{ row }">
          <span v-if="row.section" class="participants-table__section">{{ row.section }}</span>
          <span v-else class="participants-table__section participants-table__section--empty">Не назначена</span>
        </template>
      </el-table-column>

      <el-table-column label="Действие" min-width="200" align="right" header-align="center">
        <template #default="{ row }">
          <div class="participants-table__actions">
            <el-link
              :underline="false"
              class="participants-table__action participants-table__action--primary"
              @click.prevent="$emit('change-section', row)"
            >
              Изменить секцию
            </el-link>
            <el-link
              :underline="false"
              class="participants-table__action participants-table__action--secondary"
              @click.prevent="$emit('remove', row)"
            >
              Исключить
            </el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
defineProps({
  participants: {
    type: Array,
    required: true
  }
})

defineEmits(['change-section', 'remove'])
</script>

<style scoped lang="scss">
.participants-block {
  margin-top: 30px;

  h3 {
    margin: 0 0 15px 0;
    font-size: 20px;
    font-weight: 800;
    color: var(--black);
  }

  .participants-table {
    font-size: 14px;

    :deep(.el-table__header-wrapper th) {
      background: #F5F7FA;
      color: #606266;
      font-weight: 700;
      height: 40px;
    }

    :deep(.el-table__row) {
      height: 35px;
    }

    :deep(.el-table__cell) {
      border-color: #E5E7EB;
    }

    &__name {
      color: var(--light-grey);
    }

    &__section {
      color: var(--black);

      &--empty {
        color: var(--red);
      }
    }

    &__actions {
      display: inline-flex;
      align-items: center;
      gap: 8px;

      .participants-table__action {
        cursor: pointer;
      }

      :deep(.participants-table__action--primary .el-link__inner) {
        color: var(--blue) !important;
      }
      :deep(.participants-table__action--secondary .el-link__inner) {
        color: var(--light-black) !important;
      }
    }
  }
}
</style>

