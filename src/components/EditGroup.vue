<template>
  <el-dialog
    :model-value="visibleLocal"
    width="640px"
    title="Редактировать программу"
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
        <el-button type="primary" :loading="loading" @click="onSubmit">Сохранить</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { http } from '@/lib/http' // axios инстанс

// props & emits
const props = defineProps({
  visible: { type: Boolean, default: false },
  group: { type: Object, default: null } // ожидаем { id, name, start_date, end_date, type, ... }
})
const emit = defineEmits(['update:visible', 'updated'])

// локальная видимость
const visibleLocal = ref(props.visible)
watch(() => props.visible, v => (visibleLocal.value = v))
watch(visibleLocal, v => emit('update:visible', v))

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
  endDate: [{ required: true, message: 'Выберите дату окончания', trigger: 'change' }]
}

// При открытии модалки — заполняем форму из props.group
watch(
  () => props.group,
  (g) => {
    if (g) {
      form.value.title = g.name ?? g.title ?? ''
      // приводим к Date-подобному значению, Element DatePicker понимает и Date, и ISO string
      form.value.startDate = parseDateSafe(g.start_date ?? g.startDate ?? g.start)
      form.value.endDate = parseDateSafe(g.end_date ?? g.endDate ?? g.end)
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

// helper: безопасно парсит дату, возвращает null если невалидна
function parseDateSafe(v) {
  if (!v) return null
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? null : d
}

function resetForm() {
  form.value.title = ''
  form.value.startDate = null
  form.value.endDate = null
  formRef.value?.clearValidate?.()
}

function onClose() {
  visibleLocal.value = false
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
    if (!props.group || !props.group.id) {
      ElMessage.error('Невозможно сохранить — не указана группа')
      return
    }

    loading.value = true

    const payload = {
      name: form.value.title,
      start_date: form.value.startDate ? formatDateToYMD(form.value.startDate) : null,
      end_date: form.value.endDate ? formatDateToYMD(form.value.endDate) : null,
      type: 'lp' // сохраняем тот же type
      // status не трогаем, сервер оставит текущее
    }

    try {
      const { data } = await http.put(`/api/groups/${props.group.id}`, payload)
      const updated = data?.data ?? data
      emit('updated', updated)
      ElMessage.success('Изменения сохранены')
      visibleLocal.value = false
      resetForm()
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : null) ||
        'Ошибка при сохранении'
      ElMessage.error(msg)
    }
  } catch (err) {
    // валидация показала ошибки
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
