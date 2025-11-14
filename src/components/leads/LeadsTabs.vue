<template>
  <div class="leads-tabs">
    <el-tabs v-model="currentTab" class="leads-tabs__tabs">
      <el-tab-pane 
        v-for="tab in tabs" 
        :key="tab.value"
        :name="tab.value"
      >
        <template #label>
          <span class="leads-tabs__label">
            {{ tab.label }} <span class="leads-tabs__count">({{ tab.count }})</span>
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const currentTab = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<style scoped lang="scss">
.leads-tabs {
  margin-bottom: 30px;

  &__tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 0;
    }

    :deep(.el-tabs__nav-wrap::after) {
      height: 1px;
      background-color: var(--table-border);
    }

    :deep(.el-tabs__item) {
      padding: 13px 20px;
      font-size: 15px;
      color: var(--tabs-inactive);
      height: auto;

      &.is-active {
        color: var(--blue);
      }

      &:hover {
        color: var(--blue);
      }
    }

    :deep(.el-tabs__active-bar) {
      background-color: var(--blue);
      height: 2px;
    }
  }

  &__label {
    font-size: 15px;
  }

  &__count {
    font-size: 15px;
  }
}
</style>

