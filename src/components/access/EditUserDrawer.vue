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
        <h3 class="drawer-header__title">Редактировать пользователя</h3>
        <el-icon class="drawer-header__close" @click="handleClose">
          <Close />
        </el-icon>
      </div>
    </template>

    <div class="edit-user-content">
      <div class="edit-user-content__body">
        <div class="edit-user-content__field">
          <label class="edit-user-content__label">Ф.И.*</label>
          <el-input
            v-model="formData.fullName"
            placeholder="Введите Ф.И."
            class="edit-user-content__input"
            size="large"
          />
        </div>

        <div class="edit-user-content__field">
          <label class="edit-user-content__label">Логин*</label>
          <el-input
            v-model="formData.login"
            placeholder="Введите логин"
            class="edit-user-content__input"
            size="large"
          />
        </div>

        <div class="edit-user-content__field">
          <label class="edit-user-content__label">Роль*</label>
          <el-select
            v-model="formData.role"
            placeholder="Выберите роль"
            class="edit-user-content__select"
            size="large"
          >
            <el-option label="МОП" value="МОП" />
            <el-option label="Финансист" value="Финансист" />
            <el-option label="Менеджер" value="Менеджер" />
            <el-option label="Администратор" value="Администратор" />
          </el-select>
        </div>

        <div class="edit-user-content__field">
          <label class="edit-user-content__label">Электронная почта для входа*</label>
          <el-input
            v-model="formData.email"
            placeholder="Введите email"
            class="edit-user-content__input"
            size="large"
            type="email"
          />
        </div>

        <div class="edit-user-content__field">
          <label class="edit-user-content__label">Пароль</label>
          <el-input
            v-model="formData.password"
            placeholder="Оставьте пустым, чтобы не менять"
            class="edit-user-content__input"
            size="large"
            type="password"
            show-password
          />
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
          @click="handleSave"
        >
          Сохранить
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
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const formData = ref({
  fullName: '',
  login: '',
  role: null,
  email: '',
  password: ''
})

watch(() => props.modelValue, (newVal) => {
  if (newVal && props.user) {
    formData.value = {
      fullName: props.user.fullName || '',
      login: props.user.login || '',
      role: props.user.role || null,
      email: props.user.email || '',
      password: ''
    }
  }
})

function handleClose() {
  emit('update:modelValue', false)
}

function handleSave() {
  if (!formData.value.fullName || !formData.value.login || !formData.value.role || !formData.value.email) {
    ElMessage.warning('Заполните все обязательные поля')
    return
  }

  const updatedData = {
    id: props.user.id,
    fullName: formData.value.fullName,
    login: formData.value.login,
    role: formData.value.role,
    email: formData.value.email
  }

  if (formData.value.password) {
    updatedData.password = formData.value.password
  }

  emit('success', updatedData)
  ElMessage.success('Пользователь успешно обновлен')
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

.edit-user-content {
  &__body {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

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

  &__input,
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

