<template>
  <el-dialog
    :model-value="visibleLocal"
    width="640px"
    title="Создать поток"
    @close="onClose"
    :destroy-on-close="true"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" label-width="0">
      <el-form-item label="Название" prop="title">
        <el-input v-model="form.title" placeholder="Лидерская программа 1" />
      </el-form-item>

      <div style="display:flex; gap:16px;">
        <el-form-item label="Дата старта" prop="startDate" style="flex:1;">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            placeholder="Выберите дату"
            style="width:100%"
          />
        </el-form-item>

        <el-form-item label="Дата окончания" prop="endDate" style="flex:1;">
          <el-date-picker
            v-model="form.endDate"
            type="date"
            placeholder="Выберите дату"
            style="width:100%"
          />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
        <el-button @click="onClose">Отмена</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit">Создать</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { http } from '@/lib/http' // axios инстанс, если нужен

// Props / Emits — поддерживаем v-model:visible
const props = defineProps({
  visible: { type: Boolean, default: false }
})
const emit = defineEmits(['update:visible', 'created'])

// локальная видимость диалога (синхронизируется с props.visible)
const visibleLocal = ref(props.visible)
watch(() => props.visible, v => {
  visibleLocal.value = v
})
watch(visibleLocal, v => {
  // при изменении локальной видимости — эмитим в родителя
  emit('update:visible', v)
})

const formRef = ref(null)
const loading = ref(false)

let sectionId = 1
function makeSection(name = '') {
  return { id: sectionId++, name }
}

const form = ref({
  title: '',
  startDate: null,
  endDate: null,
})

const rules = {
  title: [{ required: true, message: 'Введите название', trigger: 'blur' }],
  startDate: [{ required: true, message: 'Выберите дату старта', trigger: 'change' }],
  endDate: [{ required: true, message: 'Выберите дату окончания', trigger: 'change' }],
}

function addSection() {
  form.value.sections.push(makeSection())
}

function removeSection(i) {
  if (form.value.sections.length === 1) {
    form.value.sections.splice(0, 1, makeSection())
  } else {
    form.value.sections.splice(i, 1)
  }
}

function resetForm() {
  form.value.title = ''
  form.value.startDate = null
  form.value.endDate = null
  form.value.sections = [makeSection()]
  formRef.value?.clearValidate?.()
}

function onClose() {
  visibleLocal.value = false
  // небольшой таймаут для плавности, затем ресетим форму
  setTimeout(() => resetForm(), 150)
}

function validateSections() {
  const invalidIndex = form.value.sections.findIndex(s => !s.name || !s.name.trim())
  if (invalidIndex !== -1) {
    ElMessage.error('Заполните все названия секций')
    return false
  }
  return true
}

async function onSubmit() {
  try {
    await formRef.value.validate()
    if (!validateSections()) return

    loading.value = true

    const payload = {
      title: form.value.title,
      start_date: form.value.startDate ? new Date(form.value.startDate).toISOString().slice(0,10) : null,
      end_date: form.value.endDate ? new Date(form.value.endDate).toISOString().slice(0,10) : null,
      sections: form.value.sections.map(s => ({ name: s.name }))
    }

    // Попробуем отправить на сервер (если API нет — можно просто эмитить)
    try {
      const { data } = await http.post('/flows', payload)
      emit('created', data || payload)
      ElMessage.success('Поток создан')
    } catch (err) {
      // если API недоступен — эмитим локально
      emit('created', payload)
      ElMessage.success('Поток создан (локально)')
    }

    // Закрываем модалку
    visibleLocal.value = false
    resetForm()
  } catch (err) {
    // валидация формы покажет ошибки
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.section-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
</style>
