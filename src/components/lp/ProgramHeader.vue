<template>
  <div class="program-header">
    <el-breadcrumb class="program-header__breadcrumbs" separator=">">
      <el-breadcrumb-item>Лидерская программа</el-breadcrumb-item>
      <el-breadcrumb-item>{{ program.title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="program-header__content">
      <div class="program-header__title-block">
        <h1 class="program-header__title">{{ program.title }}</h1>
        <div class="program-header__dates">
          <span class="program-header__date">Старт: {{ program.start }}</span>
          <span class="program-header__date">Конец: {{ program.end }}</span>
        </div>
      </div>
      <el-button 
        type="primary" 
        class="program-header__add-btn"
        @click="$emit('add-participant')"
      >
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
  }
})

defineEmits(['add-participant'])
</script>

<style scoped lang="scss">
.program-header {
  &__breadcrumbs {
    font-size: 14px;
    color: var(--light-grey);
    margin-bottom: 20px;
  }

  &__content {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
  }

  &__title-block {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__title {
    margin: 0;
    font-size: 24px;
    font-weight: 800;
    color: var(--black);
  }

  &__dates {
    display: flex;
    align-items: center;
    gap: 25px;
    flex-wrap: wrap;
  }

  &__date {
    font-size: 14px;
    color: var(--light-black);
  }

  &__add-btn {
    :deep(span) {
      color: var(--white);
    }
  }
}
</style>

