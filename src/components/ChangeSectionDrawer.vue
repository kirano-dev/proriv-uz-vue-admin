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
      <div class="change-section-drawer__header">
        <h3>Изменить секцию</h3>
        <el-icon class="change-section-drawer__close" @click="handleClose">
          <Close />
        </el-icon>
      </div>
    </template>

    <div class="change-section-drawer__body">
      <label class="change-section-drawer__label">
        Секция
        <span class="change-section-drawer__label-required">*</span>
      </label>
      <el-select
        v-model="selectedSection"
        placeholder="Выберите секцию"
        class="change-section-drawer__select"
        clearable
      >
        <el-option
          v-for="section in sections"
          :key="section.id"
          :label="section.title"
          :value="section.title"
        />
      </el-select>
      <div v-if="error" class="change-section-drawer__error">
        {{ error }}
      </div>
    </div>

    <template #footer>
      <div class="change-section-drawer__footer">
        <el-button
          class="change-section-drawer__button change-section-drawer__button--cancel"
          @click="handleClose"
        >
          Отмена
        </el-button>
        <el-button
          type="primary"
          class="change-section-drawer__button change-section-drawer__button--submit"
          @click="handleSubmit"
        >
          Сохранить
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
  },
  sections: {
    type: Array,
    default: () => []
  },
  currentSection: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(props.modelValue)
const selectedSection = ref(props.currentSection || '')
const error = ref('')

watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
  if (newVal) {
    selectedSection.value = props.currentSection || ''
    error.value = ''
  }
})

watch(() => props.currentSection, (newVal) => {
  if (visible.value) {
    selectedSection.value = newVal || ''
  }
})

watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
})

function handleClose() {
  visible.value = false
  error.value = ''
  selectedSection.value = props.currentSection || ''
}

function handleSubmit() {
  const payload = {
    section: selectedSection.value || ''
  }
  visible.value = false
  ElMessage.success('Секция изменена')
  emit('success', payload)
}
</script>

<style scoped lang="scss">
.change-section-drawer__header {
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

.change-section-drawer__close {
  width: 20px;
  height: 20px;
  color: #9CA3AF;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #6B7280;
  }
}

.change-section-drawer__body {
  padding-bottom: 40px;
}

.change-section-drawer__label {
  display: block;
  font-size: 14px;
  color: #374151;
  margin-bottom: 8px;

  &-required {
    color: var(--red);
    margin-left: 2px;
  }
}

.change-section-drawer__select {
  width: 100%;

  :deep(.el-input__wrapper) {
    height: 40px;
    border-radius: 6px;
    border-color: #D1D5DB;
  }
}

.change-section-drawer__error {
  margin-top: 8px;
  font-size: 12px;
  color: var(--red);
}

.change-section-drawer__footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding-top: 20px;
}

.change-section-drawer__button {
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

