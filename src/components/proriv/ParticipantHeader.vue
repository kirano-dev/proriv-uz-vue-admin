<template>
  <div class="proriv-participant-header">
    <el-breadcrumb class="proriv-participant-header__breadcrumbs" separator=">">
      <el-breadcrumb-item>
        <el-link :underline="false" class="proriv-participant-header__back-link" @click="$emit('back')">
          Прорыв
        </el-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ programTitle }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ participantName }}</el-breadcrumb-item>
    </el-breadcrumb>

    <h1 class="proriv-participant-header__title">
      {{ programTitle }} / {{ participantName }}, {{ participantPhone }}
    </h1>

    <div class="proriv-participant-header__actions">
      <div class="proriv-participant-header__left-group">
        <el-button
          type="primary"
          class="proriv-participant-header__download-btn"
          @click="$emit('download-declaration')"
        >
          Скачать декларацию
        </el-button>

        <span class="proriv-participant-header__date">
          Добавлен(а): {{ addedDate }}
        </span>
      </div>

      <el-popconfirm
        title="Исключить участника из потока?"
        confirm-button-text="Исключить"
        cancel-button-text="Отмена"
        placement="bottom"
        @confirm="$emit('exclude')"
      >
        <template #icon>
          <QuestionIcon class="popconfirm-icon" />
        </template>
        <template #reference>
          <el-button class="proriv-participant-header__exclude-btn">
            Исключить
          </el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<script setup>
import QuestionIcon from '@/assets/icons/question.svg'

defineProps({
  programTitle: {
    type: String,
    required: true
  },
  participantName: {
    type: String,
    required: true
  },
  participantPhone: {
    type: String,
    required: true
  },
  addedDate: {
    type: String,
    required: true
  }
})

defineEmits(['download-declaration', 'exclude', 'back'])
</script>

<style scoped lang="scss">
.proriv-participant-header {
  &__breadcrumbs {
    font-size: 13px;
    color: var(--grey-text);
    margin-bottom: 16px;

    :deep(.el-breadcrumb__inner) {
      color: var(--grey-text);
    }

    :deep(.el-breadcrumb__separator) {
      color: var(--grey-text);
      opacity: 0.6;
    }
  }

  &__back-link {
    color: var(--grey-text);
    cursor: pointer;

    &:hover {
      color: var(--blue);
    }
  }

  &__title {
    margin: 0 0 20px 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--dark-grey);
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
  }

  &__left-group {
    display: flex;
    align-items: center;
    gap: 30px;
    flex-wrap: wrap;
  }

  &__download-btn {
    height: 36px;
    border-radius: 6px;
    background: var(--blue);
    border-color: var(--blue);

    :deep(span) {
      color: var(--white);
    }
  }

  &__date {
    font-size: 14px;
    color: var(--grey-text);
  }

  &__exclude-btn {
    height: 36px;
    border-radius: 6px;
    border: 1px solid var(--table-border);
    background: var(--white);
    color: var(--table-text);

    &:hover:not(:disabled) {
      background: var(--grey-bg);
      border-color: var(--table-border);
    }
  }
}
</style>


