<template>
  <div class="events-table-block">
    <el-table
      class="events-table"
      :data="events"
      border
    >
      <el-table-column label="Дата и время проведения" align="left" header-align="center" min-width="200">
        <template #default="{ row }">
          <span class="events-table__date">{{ row.dateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Название" align="left" header-align="center" min-width="300">
        <template #default="{ row }">
          <span class="events-table__title">{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Записано (чел.)" align="left" header-align="center" min-width="150">
        <template #default="{ row }">
          <el-link
            type="primary"
            :underline="false"
            class="events-table__participants-link"
            @click="$emit('view-participants', row)"
          >
            {{ row.participants }}
          </el-link>
        </template>
      </el-table-column>

      <el-table-column label="Действие" align="left" header-align="center" min-width="200">
        <template #default="{ row }">
          <div class="events-table__actions">
            <el-link
              type="primary"
              :underline="false"
              class="events-table__link events-table__link--edit"
              @click="$emit('edit', row)"
            >
              Редактировать
            </el-link>
            <el-link
              :underline="false"
              class="events-table__link events-table__link--archive"
              @click="$emit('toggle-archive', row)"
            >
              {{ isArchive ? 'В активные' : 'В архив' }}
            </el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
defineProps({
  events: {
    type: Array,
    required: true
  },
  isArchive: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit', 'toggle-archive', 'view-participants'])
</script>

<style scoped lang="scss">
.events-table-block {
  margin-top: 30px;
}

.events-table {
  width: 100%;
  font-size: 14px;

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
  &__title {
    color: var(--table-text);
    font-size: 14px;
  }

  &__participants-link {
    cursor: pointer;

    :deep(.el-link__inner) {
      color: var(--blue);
    }
  }

  &__actions {
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }

  &__link {
    cursor: pointer;

    &--edit {
      :deep(.el-link__inner) {
        color: var(--blue);
      }
    }

    &--archive {
      :deep(.el-link__inner) {
        color: var(--table-text);
      }
    }
  }
}
</style>

