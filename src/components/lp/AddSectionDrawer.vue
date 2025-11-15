<template>
  <el-drawer
    v-model="visible"
    direction="rtl"
    :size="580"
    :modal="true"
    :close-on-click-modal="true"
    :show-close="false"
    @close="handleClose"
  >
    <template #header>
      <div class="drawer-header">
        <h3 class="drawer-header__title">Добавить секцию</h3>
        <el-icon class="drawer-header__close" @click="handleClose">
          <Close />
        </el-icon>
      </div>
    </template>

    <div class="add-section-content">
      <div class="add-section-content__body">
        <label class="add-section-content__label">
          Название секции
          <span class="add-section-content__label-required">*</span>
        </label>
        <el-input
          v-model="sectionName"
          placeholder="Введите название"
          class="add-section-content__input"
          @keyup.enter="handleSubmit"
        />
        <div v-if="error" class="add-section-content__error">
          {{ error }}
        </div>
      </div>
    </div>

    <template #footer>
      <div class="drawer-footer">
        <el-button
          class="drawer-footer__button drawer-footer__button--cancel"
          @click="handleClose"
        >
          Отмена
        </el-button>
        <el-button
          type="primary"
          class="drawer-footer__button drawer-footer__button--submit"
          @click="handleSubmit"
        >
          Добавить
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(props.modelValue)
const sectionName = ref('')
const error = ref('')

watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
  if (newVal) {
    sectionName.value = ''
    error.value = ''
  }
})

watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
})

function handleClose() {
  visible.value = false
  error.value = ''
  sectionName.value = ''
}

function handleSubmit() {
  if (!sectionName.value.trim()) {
    error.value = 'Введите название секции'
    return
  }

  error.value = ''
  const payload = { title: sectionName.value.trim() }
  visible.value = false
  ElMessage.success('Секция добавлена')
  emit('success', payload)
}
</script>

<style scoped lang="scss">
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;

  &__title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #111827;
  }

  &__close {
    width: 20px;
    height: 20px;
    color: #9CA3AF;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #6B7280;
    }
  }
}

.add-section-content {
  &__label {
    display: block;
    font-size: 14px;
    color: #374151;
    margin-bottom: 8px;

    &-required {
      color: var(--red);
      margin-left: 2px;
    }
  }

  &__input {
    :deep(.el-input__wrapper) {
      height: 40px;
      border-radius: 6px;
      border-color: #D1D5DB;
    }
  }

  &__error {
    margin-top: 8px;
    font-size: 12px;
    color: var(--red);
  }
}

.drawer-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding-top: 20px;

  &__button {
    padding: 10px 95px;
    height: 40px;
    border-radius: 6px;

    &--cancel {
      background: var(--white);
      color: var(--black);
      border: 1px solid #D1D5DB;

      &:hover:not(:disabled) {
        background: #F9FAFB;
      }
    }

    &--submit {
      background: var(--blue) !important;
      border-color: var(--blue) !important;

      :deep(span) {
        color: var(--white) !important;
      }
    }
  }
}
</style>

