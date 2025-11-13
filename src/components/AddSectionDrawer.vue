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
      <div class="add-section-drawer__header">
        <h3>Добавить секцию</h3>
        <el-icon class="add-section-drawer__close" @click="handleClose">
          <Close />
        </el-icon>
      </div>
    </template>

    <div class="add-section-drawer__body">
      <label class="add-section-drawer__label">
        Название секции
        <span class="add-section-drawer__label-required">*</span>
      </label>
      <el-input
        v-model="sectionName"
        placeholder="Введите название"
        class="add-section-drawer__input"
        @keyup.enter="handleSubmit"
      />
      <div v-if="error" class="add-section-drawer__error">
        {{ error }}
      </div>
    </div>

    <template #footer>
      <div class="add-section-drawer__footer">
        <el-button
          class="add-section-drawer__button add-section-drawer__button--cancel"
          @click="handleClose"
        >
          Отмена
        </el-button>
        <el-button
          type="primary"
          class="add-section-drawer__button add-section-drawer__button--submit"
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
.add-section-drawer__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;

  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #111827;
  }
}

.add-section-drawer__close {
  width: 20px;
  height: 20px;
  color: #9CA3AF;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #6B7280;
  }
}

.add-section-drawer__body {
  padding-bottom: 40px;
}

.add-section-drawer__label {
  display: block;
  font-size: 14px;
  color: #374151;
  margin-bottom: 8px;

  &-required {
    color: var(--red);
    margin-left: 2px;
  }
}

.add-section-drawer__input {
  :deep(.el-input__wrapper) {
    height: 40px;
    border-radius: 6px;
    border-color: #D1D5DB;
  }
}

.add-section-drawer__error {
  margin-top: 8px;
  font-size: 12px;
  color: var(--red);
}

.add-section-drawer__footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding-top: 20px;
}

.add-section-drawer__button {
  width: 250px;
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
</style>

