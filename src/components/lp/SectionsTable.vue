<template>
  <div class="sections-block">
    <el-table class="sections-table" :data="sections" border>
      <el-table-column prop="title" label="Секция" align="left" />
      <el-table-column label="Действие" align="left" width="220">
        <template #default="{ row }">
          <div class="sections-table__actions">
            <el-link
              type="primary"
              :underline="true"
              @click.prevent="$emit('edit', row)"
            >
              Редактировать
            </el-link>
            <el-link
              type="info"
              :underline="true"
              class="sections-table__delete"
              @click.prevent="$emit('delete', row)"
            >
              Удалить
            </el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-button type="primary" class="sections-add" @click="$emit('add')">
      Добавить секцию
    </el-button>
  </div>
</template>

<script setup>
defineProps({
  sections: {
    type: Array,
    required: true
  }
})

defineEmits(['add', 'edit', 'delete'])
</script>

<style scoped lang="scss">
.sections-block {
  margin-top: 20px;
}

.sections-table {
  font-size: 14px;

  :deep(.el-table__header-wrapper th) {
    background: #F5F7FA;
    color: #606266;
    font-weight: 700;
    height: 35px;
  }

  :deep(.el-table__row) {
    height: 35px;
  }

  :deep(.el-table__cell) {
    border-color: #E5E7EB;
  }

  &__actions {
    display: inline-flex;
    gap: 12px;
  }

  &__delete {
    :deep(.el-link__inner) {
      color: #606266 !important;
    }
  }

  :deep(.el-link--primary .el-link__inner) {
    color: var(--blue) !important;
  }
}

.sections-add {
  margin-top: 20px;
  border-radius: 6px;
  width: max-content;
}

:deep(.sections-add.el-button--primary > span) {
  color: var(--white) !important;
}
</style>

