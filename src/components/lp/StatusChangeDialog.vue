<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Сменить статус"
    width="320px"
  >
    <el-select
      :model-value="currentStatus"
      @update:model-value="$emit('update:currentStatus', $event)"
      placeholder="Выберите статус"
      style="width: 100%;"
    >
      <el-option
        v-for="option in statusOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>
    <template #footer>
      <el-button @click="$emit('update:modelValue', false)">Отмена</el-button>
      <el-button type="primary" @click="$emit('confirm')">Сохранить</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  currentStatus: {
    type: String,
    required: true
  },
  statusOptions: {
    type: Array,
    required: true
  }
})

defineEmits(['update:modelValue', 'update:currentStatus', 'confirm'])
</script>

