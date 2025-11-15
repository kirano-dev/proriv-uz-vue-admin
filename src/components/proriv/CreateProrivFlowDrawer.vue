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
        <h3 class="drawer-header__title">Создать поток</h3>
        <el-icon class="drawer-header__close" @click="handleClose">
          <Close />
        </el-icon>
      </div>
    </template>

    <div class="create-flow-content">
      <div class="create-flow-content__body">
        <label class="create-flow-content__label">
          Название потока
          <span class="create-flow-content__label-required">*</span>
        </label>
        <el-input
          v-model="flowName"
          placeholder="Введите название потока"
          class="create-flow-content__input"
        />
        
        <div class="create-flow-content__date-row">
          <div class="create-flow-content__date-field">
            <label class="create-flow-content__label">
              Дата старта
              <span class="create-flow-content__label-required">*</span>
            </label>
            <el-date-picker
              v-model="startDate"
              type="date"
              placeholder="Выберите дату"
              class="create-flow-content__date-picker"
              format="DD.MM.YYYY"
              value-format="YYYY-MM-DD"
            />
          </div>

          <div class="create-flow-content__date-field">
            <label class="create-flow-content__label">
              Дата окончания
              <span class="create-flow-content__label-required">*</span>
            </label>
            <el-date-picker
              v-model="endDate"
              type="date"
              placeholder="Выберите дату"
              class="create-flow-content__date-picker"
              format="DD.MM.YYYY"
              value-format="YYYY-MM-DD"
            />
          </div>
        </div>

        <div v-if="error" class="create-flow-content__error">
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
          Создать
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
const flowName = ref('')
const startDate = ref('')
const endDate = ref('')
const error = ref('')

watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
  if (newVal) {
    flowName.value = ''
    startDate.value = ''
    endDate.value = ''
    error.value = ''
  }
})

watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
})

function handleClose() {
  visible.value = false
  error.value = ''
  flowName.value = ''
  startDate.value = ''
  endDate.value = ''
}

function handleSubmit() {
  if (!flowName.value || !startDate.value || !endDate.value) {
    error.value = 'Заполните все обязательные поля'
    return
  }

  if (new Date(endDate.value) < new Date(startDate.value)) {
    error.value = 'Дата окончания не может быть раньше даты старта'
    return
  }

  error.value = ''
  const payload = {
    id: Date.now(),
    name: flowName.value,
    start_date: startDate.value,
    end_date: endDate.value,
    type: 'proriv'
  }
  
  visible.value = false
  ElMessage.success('Поток создан')
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

.create-flow-content {
  &__body {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

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
    width: 100%;

    :deep(.el-input__wrapper) {
      height: 40px;
      border-radius: 6px;
      border-color: #D1D5DB;
    }
  }

  &__date-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  &__date-field {
    display: flex;
    flex-direction: column;
  }

  &__date-picker {
    width: 100%;

    :deep(.el-input__wrapper) {
      height: 40px;
      border-radius: 6px;
      border-color: #D1D5DB;
    }
  }

  &__error {
    margin-top: -12px;
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
      background: var(--blue);
      border-color: var(--blue);

      :deep(span) {
        color: var(--white);
      }
    }
  }
}
</style>

