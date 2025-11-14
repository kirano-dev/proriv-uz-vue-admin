<template>
  <div class="access-table-block">
    <el-table
      class="access-table"
      :data="users"
      border
    >
      <el-table-column label="Ф.И." align="left" header-align="center" min-width="200">
        <template #default="{ row }">
          <span class="access-table__name">{{ row.fullName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Логин" align="left" header-align="center" min-width="180">
        <template #default="{ row }">
          <span class="access-table__login">{{ row.login }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Роль" align="left" header-align="center" min-width="150">
        <template #default="{ row }">
          <span class="access-table__role">{{ row.role }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Действие" align="left" header-align="center" min-width="200">
        <template #default="{ row }">
          <div class="access-table__actions">
            <el-link
              type="primary"
              :underline="false"
              class="access-table__link access-table__link--edit"
              @click="$emit('edit', row)"
            >
              Редактировать
            </el-link>
            <el-link
              :underline="false"
              :class="[
                'access-table__link',
                isBlocked ? 'access-table__link--unblock' : 'access-table__link--block'
              ]"
              @click="$emit('toggle-block', row)"
            >
              {{ isBlocked ? 'Разблокировать' : 'Заблокировать' }}
            </el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
defineProps({
  users: {
    type: Array,
    required: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit', 'toggle-block'])
</script>

<style scoped lang="scss">
.access-table-block {
  margin-top: 30px;
}

.access-table {
  width: 100%;
  font-size: 12px;

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

  &__name,
  &__login,
  &__role {
    color: var(--table-text);
    font-size: 12px;
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

    &--block {
      :deep(.el-link__inner) {
        color: var(--red);
      }
    }

    &--unblock {
      :deep(.el-link__inner) {
        color: var(--table-text);
      }
    }
  }
}
</style>

