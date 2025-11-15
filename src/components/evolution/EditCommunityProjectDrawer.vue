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
        <h3 class="drawer-header__title">Редактировать общественный проект</h3>
        <el-icon class="drawer-header__close" @click="handleClose">
          <Close />
        </el-icon>
      </div>
    </template>

    <div class="edit-project-content">
      <div class="edit-project-content__body">
        <label class="edit-project-content__label">
          Единица измерения
          <span class="edit-project-content__label-required">*</span>
        </label>
        <el-input
          v-model="unit"
          placeholder="Введите единицу измерения"
          class="edit-project-content__input"
          @keyup.enter="handleSubmit"
        />
        <div v-if="error" class="edit-project-content__error">
          {{ error }}
        </div>

        <label class="edit-project-content__label edit-project-content__label--second">
          Кол-во
          <span class="edit-project-content__label-required">*</span>
        </label>
        <el-input
          v-model="quantity"
          placeholder="Введите кол-во"
          class="edit-project-content__input"
          @input="validateQuantity"
          @keyup.enter="handleSubmit"
        />
        <div v-if="errorQuantity" class="edit-project-content__error">
          {{ errorQuantity }}
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
          :disabled="!isFormValid"
          @click="handleSubmit"
        >
          Назначить
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
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
const unit = ref('')
const quantity = ref('')
const error = ref('')
const errorQuantity = ref('')

const isFormValid = computed(() => {
  const unitValid = unit.value.trim().length > 0
  const quantityNum = Number(quantity.value)
  const quantityValid = quantity.value.trim().length > 0 && 
                        !isNaN(quantityNum) && 
                        quantityNum > 0
  return unitValid && quantityValid && !error.value && !errorQuantity.value
})

watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
  if (newVal) {
    unit.value = ''
    quantity.value = ''
    error.value = ''
    errorQuantity.value = ''
  }
})

watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
})

function handleClose() {
  visible.value = false
  error.value = ''
  errorQuantity.value = ''
  unit.value = ''
  quantity.value = ''
}

function validateQuantity() {
  errorQuantity.value = ''
  
  if (!quantity.value.trim()) {
    errorQuantity.value = ''
    return
  }

  const quantityNum = Number(quantity.value)
  if (isNaN(quantityNum) || quantityNum <= 0) {
    errorQuantity.value = 'Введите число'
    return
  }
}

function handleSubmit() {
  error.value = ''
  errorQuantity.value = ''

  if (!unit.value.trim()) {
    error.value = 'Введите единицу измерения'
    return
  }

  validateQuantity()
  if (errorQuantity.value) {
    return
  }

  const quantityNum = Number(quantity.value)
  if (!quantity.value.trim() || isNaN(quantityNum) || quantityNum <= 0) {
    errorQuantity.value = 'Введите число'
    return
  }

  const payload = {
    unit: unit.value.trim(),
    plan: quantityNum,
    done: 0
  }
  visible.value = false
  ElMessage.success('Проект добавлен')
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

.edit-project-content {
  &__label {
    display: block;
    font-size: 14px;
    color: #374151;
    margin-bottom: 8px;

    &--second {
      margin-top: 24px;
    }

    &-required {
      color: var(--red);
      margin-left: 2px;
    }
  }

  &__input {
    width: 100%;

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

