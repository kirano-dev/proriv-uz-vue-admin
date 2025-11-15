<template>
  <div class="evolution-sections-block">
    <el-table class="evolution-sections-block__table" :data="sections" border>
      <el-table-column prop="title" label="Секция" align="left" />
      <el-table-column label="Действие" align="left" width="220">
        <template #default="{ row }">
          <div class="evolution-sections-block__actions">
            <el-link
              type="primary"
              :underline="true"
              class="evolution-sections-block__link evolution-sections-block__link--edit"
              @click.prevent="$emit('edit', row)"
            >
              Редактировать
            </el-link>
            <el-link
              type="info"
              :underline="true"
              class="evolution-sections-block__link evolution-sections-block__link--delete"
              @click.prevent="$emit('delete', row)"
            >
              Удалить
            </el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-button 
      type="primary" 
      class="evolution-sections-block__add-btn" 
      @click="$emit('add')"
    >
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
.evolution-sections-block {
  margin-top: 20px;

  &__table {
    font-size: 14px;

    :deep(.el-table__header-wrapper th) {
      background: var(--ultra-light-grey);
      color: var(--table-text);
      font-weight: 700;
      height: 35px;
    }

    :deep(.el-table__row) {
      height: 35px;
    }

    :deep(.el-table__cell) {
      border-color: var(--table-border);
    }
  }

  &__actions {
    display: inline-flex;
    gap: 12px;
  }

  &__link {
    &--edit {
      :deep(.el-link__inner) {
        color: var(--blue);
      }
    }

    &--delete {
      :deep(.el-link__inner) {
        color: var(--table-text);
      }
    }
  }

  &__add-btn {
    margin-top: 20px;
    border-radius: 6px;

    :deep(span) {
      color: var(--white);
    }
  }
}
</style>

