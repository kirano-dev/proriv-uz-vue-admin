<template>
  <div class="habits-block">
    <h3>Привычки</h3>
    <div class="habits-table">
      <div class="habits-table__header">
        <div class="habits-table__header-title">Привычки</div>
        <div class="habits-table__header-result">Результат</div>
      </div>

      <div
        v-for="(participant, index) in habits"
        :key="participant.id"
        class="habits-table__participant-block"
      >
        <div class="habits-table__participant-title">
          {{ index + 1 }}. {{ participant.name }}
        </div>

        <template v-if="participant.habits && participant.habits.length">
          <div
            v-for="habit in participant.habits"
            :key="habit.id"
            class="habits-table__row"
          >
            <div class="habits-table__habit">{{ habit.title }}</div>
            <div class="habits-table__result">
              {{ habit.completed }} / {{ habit.total }} ({{ formatPercent(habit.completed, habit.total) }})
            </div>
          </div>
        </template>
        <div v-else class="habits-table__row habits-table__row--warning">
          <div class="habits-table__habit habits-table__habit--warning">
            <WarningIcon class="habits-table__warning-icon" />
            <span>Привычки не добавлены</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import WarningIcon from '@/assets/icons/warning.svg'

defineProps({
  habits: {
    type: Array,
    required: true
  }
})

function formatPercent(completed, total) {
  if (!total) return '0%'
  const percent = Math.round((completed / total) * 100)
  return `${percent}%`
}
</script>

<style scoped lang="scss">
.habits-block {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    color: var(--black);
  }
}

.habits-table {
  width: 100%;
  background: var(--white);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--table-border);

  &__header {
    display: grid;
    grid-template-columns: 7fr 3fr;
    align-items: center;
    background: var(--table-header-bg);
    color: var(--table-text);
    font-size: 12px;
    font-weight: 600;
    height: 33px;
    text-align: center;
    padding: 0 16px;
  }

  &__header-title {
    text-align: center;
  }

  &__header-result {
    text-align: center;
  }

  &__participant-block {
    border-top: 1px solid var(--table-border);
  }

  &__participant-title {
    background: var(--table-row-bg);
    font-weight: 700;
    font-size: 12px;
    padding: 0 16px;
    height: 31px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--table-border);
  }

  &__row {
    display: grid;
    grid-template-columns: 7fr 3fr;
    align-items: stretch;
    min-height: 31px;
    border-bottom: 1px solid var(--table-border);
    background: var(--white);

    &--warning {
      background: var(--white);
    }
  }

  &__habit {
    grid-column: 1 / 2;
    padding: 0 16px;
    font-size: 12px;
    color: var(--table-text);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    text-align: left;

    &--warning {
      justify-content: flex-start;
      text-align: left;
      grid-column: 1 / -1;
    }
  }

  &__result {
    grid-column: 2 / 3;
    padding: 0 16px;
    font-size: 12px;
    color: var(--table-text);
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: 1px solid var(--table-border);
  }
}
</style>

