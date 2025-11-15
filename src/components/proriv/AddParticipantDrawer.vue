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
        <h3 class="drawer-header__title">Добавить участника</h3>
        <el-icon class="drawer-header__close" @click="handleClose">
          <Close />
        </el-icon>
      </div>
    </template>

    <div class="add-participant-content">
      <div class="add-participant-content__body">
        <label class="add-participant-content__label">
          Участник
          <span class="add-participant-content__label-required">*</span>
        </label>
        <el-select
          v-model="selectedParticipant"
          placeholder="Выберите участника"
          class="add-participant-content__select"
          filterable
        >
          <el-option
            v-for="participant in availableParticipants"
            :key="participant.id"
            :label="`${participant.name}, ${participant.phone}`"
            :value="participant.id"
          />
        </el-select>
        <div v-if="error" class="add-participant-content__error">
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
import { ref, watch, computed } from 'vue'
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
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(props.modelValue)
const selectedParticipant = ref(null)
const error = ref('')

const availableParticipants = computed(() => {
  const allParticipants = []
  const seenKeys = new Set()

  props.sections.forEach(section => {
    if (section.participants && Array.isArray(section.participants)) {
      section.participants.forEach(participant => {
        const key = `${participant.name}_${participant.phone}`
        if (!seenKeys.has(key)) {
          seenKeys.add(key)
          allParticipants.push({
            id: participant.id || Date.now() + Math.random(),
            name: participant.name,
            phone: participant.phone
          })
        }
      })
    }
  })

  return allParticipants
})

watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
  if (newVal) {
    selectedParticipant.value = null
    error.value = ''
  }
})

watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
})

function handleClose() {
  visible.value = false
  error.value = ''
  selectedParticipant.value = null
}

function handleSubmit() {
  if (!selectedParticipant.value) {
    error.value = 'Выберите участника'
    return
  }

  const participant = availableParticipants.value.find(p => p.id === selectedParticipant.value)
  if (!participant) {
    error.value = 'Участник не найден'
    return
  }

  error.value = ''
  const payload = {
    id: participant.id || Date.now(),
    name: participant.name,
    phone: participant.phone,
    section: ''
  }
  visible.value = false
  ElMessage.success('Участник добавлен')
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

.add-participant-content {
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

  &__select {
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
      background: var(--blue);
      border-color: var(--blue);

      :deep(span) {
        color: var(--white);
      }
    }
  }
}
</style>

