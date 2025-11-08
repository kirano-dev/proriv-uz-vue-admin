<template>
  <el-dialog
    :model-value="visibleLocal"
    width="640px"
    title="Создать лидерскую программу"
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
import { http } from '@/lib/http' // axios инстанс

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
  emit('update:visible', v)
})

const formRef = ref(null)
const loading = ref(false)

const form = ref({
  title: '',
  startDate: null,
  endDate: null
})

const rules = {
  title: [{ required: true, message: 'Введите название', trigger: 'blur' }],
  startDate: [{ required: true, message: 'Выберите дату старта', trigger: 'change' }],
  endDate: [{ required: true, message: 'Выберите дату окончания', trigger: 'change' }],
}

function resetForm() {
  form.value.title = ''
  form.value.startDate = null
  form.value.endDate = null
  formRef.value?.clearValidate?.()
}

function onClose() {
  visibleLocal.value = false
  // небольшой таймаут для плавности, затем ресетим форму
  setTimeout(() => resetForm(), 150)
}

function formatDateToYMD(date) {
  if (!date) return null
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return null
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

async function onSubmit() {
  try {
    await formRef.value.validate()
    loading.value = true

    const payload = {
      name: form.value.title,
      start_date: form.value.startDate ? formatDateToYMD(form.value.startDate) : null,
      end_date: form.value.endDate ? formatDateToYMD(form.value.endDate) : null,
      type: 'lp'
      // status не отправляем — backend выставит 'active' по умолчанию
    }

    try {
      const { data } = await http.post('/groups', payload)
      const created = data?.data ?? data
      emit('created', created)
      ElMessage.success('Лидерская программа создана')
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : null) ||
        'Ошибка при создании'
      ElMessage.error(msg)
      return
    }

    visibleLocal.value = false
    resetForm()
  } catch (err) {
    // если валидация не прошла — Element покажет ошибки
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
