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
        <h3 class="drawer-header__title">{{ props.editItem ? 'Редактировать фото' : 'Добавить фото в галерею потока' }}</h3>
        <el-icon class="drawer-header__close" @click="handleClose">
          <Close />
        </el-icon>
      </div>
    </template>

    <div class="add-gallery-content">
      <div class="add-gallery-content__body">
      <div
        class="add-gallery-content__upload"
        :class="{ 'add-gallery-content__upload--dragover': isDragover }"
        @click="triggerFileInput"
        @dragover.prevent="isDragover = true"
        @dragleave.prevent="isDragover = false"
        @drop.prevent="handleDrop"
      >
        <input
          ref="fileInputRef"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="add-gallery-content__file-input"
          @change="handleFileSelect"
        />
        <div class="add-gallery-content__upload-content">
          <div class="add-gallery-content__upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7 20H17C18.1046 20 19 19.1046 19 18V6C19 4.89543 18.1046 4 17 4H7C5.89543 4 5 4.89543 5 6V18C5 19.1046 5.89543 20 7 20Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="add-gallery-content__upload-text">Загрузить файл</div>
        </div>
        <div v-if="selectedFile" class="add-gallery-content__upload-preview">
          <img :src="previewUrl" alt="Preview" />
        </div>
      </div>
      <div class="add-gallery-content__upload-info">
        до 1 мб, jpg/png/webp
      </div>
      <div v-if="errorFile" class="add-gallery-content__error">
        {{ errorFile }}
      </div>

      <label class="add-gallery-content__label add-gallery-content__label--second">
        Название
      </label>
      <el-input
        v-model="title"
        placeholder="Введите название"
        class="add-gallery-content__input"
        @keyup.enter="handleSubmit"
      />
      <div v-if="errorTitle" class="add-gallery-content__error">
        {{ errorTitle }}
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
          {{ props.editItem ? 'Сохранить' : 'Добавить' }}
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
  editItem: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success', 'update'])

const visible = ref(props.modelValue)
const fileInputRef = ref(null)
const selectedFile = ref(null)
const previewUrl = ref('')
const title = ref('')
const isDragover = ref(false)
const errorFile = ref('')
const errorTitle = ref('')

const isFormValid = computed(() => {
  const titleValid = title.value.trim().length > 0
  const fileValid = props.editItem ? true : selectedFile.value !== null
  return titleValid && fileValid && !errorFile.value && !errorTitle.value
})

function loadEditData() {
  if (props.editItem) {
    // Режим редактирования - заполняем форму данными карточки
    title.value = props.editItem.title || ''
    if (props.editItem.src) {
      previewUrl.value = props.editItem.src
      selectedFile.value = null // В режиме редактирования файл может быть не выбран
    }
  } else {
    resetForm()
  }
}

watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
  if (newVal) {
    loadEditData()
  }
})

watch(() => props.editItem, () => {
  if (visible.value && props.editItem) {
    loadEditData()
  }
})

watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
})

function resetForm() {
  selectedFile.value = null
  previewUrl.value = ''
  title.value = ''
  errorFile.value = ''
  errorTitle.value = ''
  isDragover.value = false
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function handleClose() {
  visible.value = false
  resetForm()
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

function validateFile(file) {
  const maxSize = 1 * 1024 * 1024 // 1 MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  
  if (!allowedTypes.includes(file.type)) {
    return 'Разрешены только форматы jpg, png, webp'
  }
  
  if (file.size > maxSize) {
    return 'Размер файла не должен превышать 1 МБ'
  }
  
  return null
}

function handleFileSelect(event) {
  const file = event.target.files?.[0]
  if (file) {
    processFile(file)
  }
}

function handleDrop(event) {
  isDragover.value = false
  const file = event.dataTransfer.files?.[0]
  if (file) {
    processFile(file)
  }
}

function processFile(file) {
  errorFile.value = ''
  
  const validationError = validateFile(file)
  if (validationError) {
    errorFile.value = validationError
    return
  }
  
  selectedFile.value = file
  
  // Создаем preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function handleSubmit() {
  errorFile.value = ''
  errorTitle.value = ''
  
  if (!props.editItem) {
    // Режим добавления - файл обязателен
    if (!selectedFile.value) {
      errorFile.value = 'Выберите файл'
      return
    }
  }
  
  if (!title.value.trim()) {
    errorTitle.value = 'Введите название'
    return
  }
  
  if (props.editItem) {
    // Режим редактирования
    const payload = {
      id: props.editItem.id,
      title: title.value.trim(),
      // Если файл не был изменен, используем старый src
      src: selectedFile.value ? previewUrl.value : props.editItem.src,
      file: selectedFile.value || null
    }
    
    visible.value = false
    ElMessage.success('Фото обновлено')
    emit('update', payload)
  } else {
    // Режим добавления
    const payload = {
      id: Date.now(),
      file: selectedFile.value,
      src: previewUrl.value,
      title: title.value.trim()
    }
    
    visible.value = false
    ElMessage.success('Фото добавлено в галерею')
    emit('success', payload)
  }
  
  resetForm()
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

.add-gallery-content {
  &__upload {
    width: 360px;
    height: 180px;
    border: 2px dashed #D1D5DB;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    background: #F9FAFB;
    transition: all 0.2s;

    &:hover {
      border-color: var(--blue);
      background: #F0F9FF;
    }

    &--dragover {
      border-color: var(--blue);
      background: #E0F2FE;
    }
  }

  &__file-input {
    display: none;
  }

  &__upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    z-index: 1;
  }

  &__upload-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__upload-text {
    font-size: 14px;
    color: #6B7280;
    font-weight: 500;
  }

  &__upload-preview {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 6px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__upload-info {
    text-align: left;
    margin-top: 8px;
    font-size: 12px;
    color: #9CA3AF;
  }

  &__label {
    display: block;
    font-size: 14px;
    color: #374151;
    margin-bottom: 8px;
    margin-top: 24px;

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

