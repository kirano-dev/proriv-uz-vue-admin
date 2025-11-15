<template>
  <div class="proriv-community-project">
    <div class="proriv-community-project__head">
      <h3>Общественный проект</h3>
      <el-button
        class="proriv-community-project__edit"
        @click="$emit('edit')"
      >
        Редактировать
      </el-button>
    </div>

    <el-table
      class="proriv-community-project__table"
      :data="projectRows"
      border
    >
      <el-table-column
        label="Ед. измерения"
        prop="unit"
        header-align="center"
        align="left"
        min-width="200"
      />
      <el-table-column
        label="План"
        prop="plan"
        header-align="center"
        align="center"
        min-width="120"
      />
      <el-table-column
        label="Выполнено"
        header-align="center"
        align="center"
        min-width="160"
      >
        <template #default="{ row, $index }">
          <el-input-number
            :model-value="row.done"
            @update:model-value="updateDone($index, $event)"
            :min="0"
            :max="row.plan"
            controls-position="right"
            class="proriv-community-project__input"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="Осталось"
        header-align="center"
        align="center"
        min-width="120"
      >
        <template #default="{ row }">
          {{ getRemaining(row) }}
        </template>
      </el-table-column>
    </el-table>

    <el-button
      type="primary"
      class="proriv-community-project__save"
      @click="$emit('save')"
    >
      Сохранить
    </el-button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  projects: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit', 'save', 'update:projects'])

const localProjects = computed({
  get: () => props.projects,
  set: (value) => emit('update:projects', value)
})

const projectRows = computed(() => localProjects.value)

function getRemaining(project) {
  const plan = Number(project.plan) || 0
  const done = Math.min(Number(project.done) || 0, plan)

  if (!plan) return '0%'

  const remainingPercent = Math.max(0, Math.round(((plan - done) / plan) * 100))
  return `${remainingPercent}%`
}

function updateDone(index, value) {
  const updated = [...localProjects.value]
  updated[index] = { ...updated[index], done: value }
  emit('update:projects', updated)
}
</script>

<style scoped lang="scss">
.proriv-community-project {
  margin-top: 50px;
  display: flex;
  flex-direction: column;

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--black);
    }
  }

  &__edit {
    padding: 8px 16px;
    background: var(--white);
    color: var(--table-text);
    border: 1px solid var(--table-border);
  }

  &__table {
    :deep(.el-table__header-wrapper th) {
      background: var(--ultra-light-grey);
      color: var(--table-text);
      font-weight: 600;
      height: 33px;
    }

    :deep(.el-table__row) {
      height: 33px;
    }

    :deep(.el-table__cell) {
      border-color: var(--table-border);
    }
  }

  &__input {
    width: 100%;

    :deep(.el-input__wrapper) {
      border: 1px solid var(--blue);
      box-shadow: none;
    }

    :deep(.el-input-number__increase),
    :deep(.el-input-number__decrease) {
      border-left: 1px solid var(--table-border);
    }
  }

  &__save {
    margin-top: 20px;
    align-self: flex-start;

    :deep(span) {
      color: var(--white);
    }
  }
}
</style>

