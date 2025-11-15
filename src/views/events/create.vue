<template>
  <div class="create-event-layout">
    <Sidebar />
    
    <main class="create-event">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/events' }">События</el-breadcrumb-item>
        <el-breadcrumb-item>Добавить событие</el-breadcrumb-item>
      </el-breadcrumb>

    <h1 class="create-event__title">Добавить событие</h1>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <div class="create-event__form-row">
        <el-form-item label="Название" prop="name" class="create-event__form-item">
          <el-input v-model="form.name" placeholder="Введите название" />
        </el-form-item>

        <el-form-item label="Дата проведения" prop="date" class="create-event__form-item">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="дд/мм/гггг"
            format="DD.MM.YYYY"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="Время проведения" prop="time" class="create-event__form-item">
          <el-time-picker
            v-model="form.time"
            placeholder="HH:mm"
            format="HH:mm"
            value-format="HH:mm"
            style="width: 100%"
          />
        </el-form-item>
      </div>

      <div class="create-event__form-row">
        <el-form-item label="Адрес проведения" prop="address" class="create-event__form-item">
          <el-input v-model="form.address" placeholder="Введите адрес" />
        </el-form-item>

        <el-form-item label="Локация Yandex" class="create-event__form-item">
          <el-input v-model="form.yandexLocation" placeholder="Вставьте ссылку" />
        </el-form-item>

        <el-form-item class="create-event__form-item create-event__form-item--upload">
          <div class="create-event__upload-wrapper">
            <el-button type="primary" @click="handleUploadClick">
              Загрузить превью
            </el-button>
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleFileChange"
            />
            
            <div class="create-event__preview" @click="handleUploadClick">
              <div class="create-event__preview-image">
                <img v-if="previewUrl" :src="previewUrl" alt="Preview" />
                <component v-else :is="UploadIcon" />
              </div>
              <div class="create-event__preview-info">
                <span class="create-event__preview-name">{{ previewFile ? previewFile.name : 'превью.jpeg' }}</span>
              </div>
              <div v-if="previewFile" class="create-event__preview-ribbon">
                <component :is="SuccessIcon" />
              </div>
            </div>
          </div>
        </el-form-item>
      </div>

      <el-form-item label="Полное описание события" class="create-event__form-item create-event__form-item--editor">
        <ckeditor
          v-model="form.description"
          :editor="ClassicEditor"
          :config="editorConfig"
        />
      </el-form-item>

      <div class="create-event__pricing">
        <h3 class="create-event__pricing-title">Стоимость участия *</h3>
        <el-radio-group v-model="form.pricingType" class="create-event__radio-group">
          <el-radio value="free">Бесплатно</el-radio>
          <el-radio value="paid">Платно</el-radio>
        </el-radio-group>
      </div>

      <div class="create-event__tariffs">
        <template v-if="form.tariffs.length > 0">
          <div class="create-event__tariff-headers">
            <div class="create-event__tariff-header">Название тарифа</div>
            <div class="create-event__tariff-header">Стоимость (UZS)</div>
          </div>

          <div
            v-for="(tariff, index) in form.tariffs"
            :key="index"
            class="create-event__tariff-row"
          >
            <el-form-item class="create-event__tariff-name">
              <el-input v-model="tariff.name" placeholder="Введите название" />
            </el-form-item>
            <el-form-item class="create-event__tariff-price">
              <el-input v-model="tariff.price" placeholder="Введите стоимость" />
            </el-form-item>
            <button
              type="button"
              class="create-event__tariff-delete"
              @click="removeTariff(index)"
            >
              <component :is="DeleteIcon" />
            </button>
          </div>
        </template>

        <button
          type="button"
          class="create-event__add-tariff"
          @click="addTariff"
        >
          Добавить тариф +
        </button>
      </div>

      <div class="create-event__actions">
        <el-button @click="handleCancel">Отмена</el-button>
        <el-button type="primary" @click="handleSubmit">Добавить</el-button>
      </div>
    </el-form>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Underline, Strikethrough, List, Link, Heading, BlockQuote, Table, TableToolbar, Alignment, Font } from 'ckeditor5'
import { Ckeditor } from '@ckeditor/ckeditor5-vue'
import Sidebar from '@/components/Sidebar.vue'
import DeleteIcon from '@/assets/icons/delete2.svg'
import SuccessIcon from '@/assets/icons/success.svg'
import UploadIcon from '@/assets/icons/upload.svg'

import 'ckeditor5/ckeditor5.css'

const router = useRouter()
const formRef = ref(null)
const fileInputRef = ref(null)
const previewFile = ref(null)
const previewUrl = ref(null)

const form = ref({
  name: '',
  date: '',
  time: '',
  address: '',
  yandexLocation: '',
  description: '',
  pricingType: 'free',
  tariffs: []
})

const rules = {
  name: [
    { required: true, message: 'Введите название', trigger: 'blur' }
  ],
  date: [
    { required: true, message: 'Выберите дату', trigger: 'change' }
  ],
  time: [
    { required: true, message: 'Выберите время', trigger: 'change' }
  ],
  address: [
    { required: true, message: 'Введите адрес', trigger: 'blur' }
  ]
}

const editorConfig = computed(() => {
  return {
    licenseKey: 'GPL',
    plugins: [
      Essentials, 
      Paragraph, 
      Heading,
      Bold, 
      Italic, 
      Underline,
      Strikethrough,
      List, 
      Link,
      BlockQuote,
      Table,
      TableToolbar,
      Alignment,
      Font
    ],
    toolbar: [
      'undo', 'redo', '|',
      'heading', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'fontSize', 'fontColor', '|',
      'alignment', '|',
      'bulletedList', 'numberedList', '|',
      'blockQuote', 'insertTable', '|',
      'link'
    ],
    heading: {
      options: [
        { model: 'paragraph', title: 'Параграф', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Заголовок 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Заголовок 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Заголовок 3', class: 'ck-heading_heading3' }
      ]
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
    }
  }
})

const handleUploadClick = () => {
  fileInputRef.value?.click()
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    previewFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const addTariff = () => {
  form.value.tariffs.push({ name: '', price: '' })
}

const removeTariff = (index) => {
  form.value.tariffs.splice(index, 1)
}

const handleCancel = () => {
  router.push('/events')
}

const handleSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      console.log('Form data:', form.value)
      router.push('/events')
    }
  })
}
</script>

<style scoped lang="scss">
.create-event-layout {
  display: flex;
  min-height: 100vh;
  background: var(--grey-bg);
}

.create-event {
  flex: 1;
  padding: 20px;

  :deep(.el-breadcrumb) {
    margin-bottom: 30px;
    font-size: 14px;

    .el-breadcrumb__item {
      .el-breadcrumb__inner {
        color: var(--light-grey);
        font-weight: normal;

        &.is-link:hover {
          color: var(--blue);
        }
      }

      &:last-child .el-breadcrumb__inner {
        color: var(--light-grey);
      }
    }

    .el-breadcrumb__separator {
      color: var(--light-grey);
    }
  }

  &__title {
    font-size: 28px;
    font-weight: 800;
    color: var(--black);
    margin: 0 0 25px;
  }

  &__form-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 25px;
    margin-bottom: 25px;
  }

  &__form-item {
    margin-bottom: 0;

    :deep(.el-form-item__label) {
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--black);
    }

    :deep(.el-input__wrapper) {
      height: 40px;
      border-radius: 6px;
    }

    :deep(.el-date-editor) {
      height: 40px;
      border-radius: 6px;
    }

    :deep(.el-input-number) {
      height: 40px;
      
      .el-input__wrapper {
        border-radius: 6px;
      }
    }

    &--upload {
      :deep(.el-form-item__label) {
        display: none;
      }
    }

    &--editor {
      grid-column: 1 / -1;
      margin-bottom: 25px;
    }
  }

  &__upload-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__preview {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    border: 1px solid var(--table-border);
    border-radius: 6px;
    background: var(--white);
    cursor: pointer;
    overflow: hidden;

    &:hover {
      border-color: var(--blue);
    }
  }

  &__preview-image {
    width: 70px;
    height: 70px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--ultra-light-grey);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
  }

  &__preview-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__preview-name {
    font-size: 14px;
    color: var(--black);
    word-break: break-all;
  }

  &__preview-ribbon {
    position: absolute;
    top: 0;
    right: 0;
    width: 45px;
    height: 45px;
    overflow: hidden;
    pointer-events: none;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 45px 45px 0;
      border-color: transparent var(--green-success) transparent transparent;
    }

    svg {
      position: absolute;
      top: 10px;
      right: 5px;
      width: 12px;
      height: 12px;
      display: block;
      z-index: 1;

      path {
        fill: var(--white);
      }
    }
  }

  :deep(.ck-editor) {
    width: 100%;

    .ck-editor__top {
      border-radius: 6px 6px 0 0;
    }

    .ck-toolbar {
      border-color: var(--tabs-inactive);
      background: var(--white);
    }

    .ck-content {
      border-color: var(--tabs-inactive);
      background: var(--white);
      border-radius: 0 0 6px 6px;
    }

    .ck-editor__editable {
      min-height: 200px;
      max-height: 500px;
      height: 200px;
      resize: vertical;
      overflow-y: auto;
    }
  }

  &__pricing {
    margin-bottom: 25px;
  }

  &__pricing-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--black);
    margin: 0 0 12px;
  }

  &__radio-group {
    :deep(.el-radio) {
      margin-right: 30px;

      .el-radio__label {
        font-size: 14px;
        color: var(--black);
      }
    }
  }

  &__tariffs {
    margin-bottom: 25px;
  }

  &__tariff-headers {
    display: grid;
    grid-template-columns: 365px 365px auto;
    gap: 15px;
    margin-bottom: 8px;
  }

  &__tariff-header {
    font-size: 14px;
    font-weight: 600;
    color: var(--black);
  }

  &__tariff-row {
    display: grid;
    grid-template-columns: 365px 365px auto;
    gap: 15px;
    align-items: start;
    margin-bottom: 15px;
  }

  &__tariff-name,
  &__tariff-price {
    margin-bottom: 0;

    :deep(.el-form-item__label) {
      display: none;
    }
  }

  &__tariff-delete {
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2px;

    svg {
      width: 34px;
      height: 34px;
    }

    &:hover {
      opacity: 0.8;
    }
  }

  &__add-tariff {
    border: none;
    background: transparent;
    color: var(--blue);
    font-size: 14px;
    cursor: pointer;
    padding: 0;
    margin-top: 10px;

    &:hover {
      opacity: 0.8;
    }
  }

  &__actions {
    display: flex;
    gap: 15px;
    margin-top: 40px;

    :deep(.el-button) {
      padding: 8px 20px;
      border-radius: 6px;

      &:not(.el-button--primary) {
        border-color: var(--table-border);
        color: var(--table-text);
        background: var(--white);
      }

      &.el-button--primary {
        background: var(--blue);
        color: var(--white);
        border-color: var(--blue);
      }
    }
  }
}
</style>

