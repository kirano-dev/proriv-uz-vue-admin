<template>
  <div>
    <el-breadcrumb class="program-header__breadcrumbs" separator=">">
      <el-breadcrumb-item>Лидерская программа</el-breadcrumb-item>
      <el-breadcrumb-item>{{ program.title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="program-header">
      <div class="program-header__title-block">
        <h1>{{ program.title }}</h1>
        <div class="program-header__dates">
          <template v-if="showStatus">
            <span class="program-header__status">Статус: {{ statusLabel }}</span>
            <el-button size="small" class="program-header__status-button" @click="$emit('change-status')">
              Сменить статус
            </el-button>
          </template>
          <span>Старт: {{ program.start }}</span>
          <span>Конец: {{ program.end }}</span>
        </div>
      </div>
      <el-button type="primary" @click="$emit('add-participant')">
        Добавить участника
      </el-button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  program: {
    type: Object,
    required: true
  },
  showStatus: {
    type: Boolean,
    default: false
  },
  statusLabel: {
    type: String,
    default: ''
  }
})

defineEmits(['add-participant', 'change-status'])
</script>

<style scoped lang="scss">
.program-header__breadcrumbs {
  font-size: 14px;
  color: var(--light-grey);
  margin-bottom: 20px;
}

.program-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;

  :deep(.el-button--primary span) {
    color: var(--white);
  }

  &__title-block {
    display: flex;
    flex-direction: column;
    gap: 12px;

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      color: var(--black);
    }
  }

  &__dates {
    display: flex;
    align-items: center;
    gap: 25px;
    font-size: 14px;
    color: var(--light-black);
    flex-wrap: wrap;
  }

  &__status {
    font-size: 14px;
    color: var(--light-black);
  }

  &__status-button {
    border-radius: 6px;
    border: 1px solid #E5E7EB;
    color: #606266;
    background: #fff;
    min-width: 120px;
  }
}
</style>

