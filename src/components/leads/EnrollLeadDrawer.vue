<template>
  <el-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    direction="rtl"
    size="580px"
    :show-close="false"
  >
    <template #header>
      <div class="drawer-header">
        <h3 class="drawer-header__title">Записать в поток</h3>
        <el-icon class="drawer-header__close" @click="handleClose">
          <Close />
        </el-icon>
      </div>
    </template>

    <div class="enroll-lead-content">
      <div class="enroll-lead-content__body">
        <div class="enroll-lead-content__field">
          <label class="enroll-lead-content__label">Поток*</label>
          <el-select
            v-model="selectedProgram"
            placeholder="Выберите поток"
            class="enroll-lead-content__select"
            size="large"
          >
            <el-option
              v-for="program in programs"
              :key="program.id"
              :label="program.title"
              :value="program.id"
            />
          </el-select>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="drawer-footer">
        <el-button class="drawer-footer__button drawer-footer__button--cancel" @click="handleClose">
          Отмена
        </el-button>
        <el-button
          type="primary"
          class="drawer-footer__button drawer-footer__button--submit"
          @click="handleEnroll"
        >
          Записать
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  programs: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const selectedProgram = ref(null)

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    selectedProgram.value = null
  }
})

function handleClose() {
  emit('update:modelValue', false)
}

function handleEnroll() {
  if (!selectedProgram.value) {
    ElMessage.warning('Выберите поток')
    return
  }

  emit('success', { programId: selectedProgram.value })
  ElMessage.success('Участник успешно записан в поток')
  handleClose()
}
</script>

<style scoped lang="scss">
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--black);
  }

  &__close {
    font-size: 20px;
    cursor: pointer;
    color: var(--light-grey);

    &:hover {
      color: var(--black);
    }
  }
}

.enroll-lead-content {
  &__field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__label {
    font-size: 14px;
    font-weight: 500;
    color: var(--black);
  }

  &__select {
    width: 100%;

    :deep(.el-input__wrapper) {
      border-radius: 6px;
    }
  }
}

.drawer-footer {
  display: flex;
  justify-content: center;
  gap: 12px;

  &__button {
    padding: 8px 95px;

    &--cancel {
      background: var(--white);
      border: 1px solid var(--table-border);
      color: var(--black);

      &:hover {
        background: var(--grey-bg);
      }
    }

    &--submit {
      :deep(span) {
        color: var(--white);
      }
    }
  }
}
</style>

