<template>
  <div class="proriv-gallery-block">
    <div class="proriv-gallery-block__head">
      <h3>Галерея потока</h3>
      <el-button type="primary" @click="$emit('add')">
        Добавить
      </el-button>
    </div>

    <div class="proriv-gallery-grid">
      <div
        v-for="item in items"
        :key="item.id"
        class="proriv-gallery-card"
      >
        <div class="proriv-gallery-card__image">
          <img :src="item.src" :alt="item.title" />
          <div class="proriv-gallery-card__actions">
            <button
              class="proriv-gallery-card__action"
              type="button"
              @click="$emit('edit', item)"
            >
              <EditIcon />
            </button>
            <button
              class="proriv-gallery-card__action proriv-gallery-card__action--danger"
              type="button"
              @click="$emit('delete', item)"
            >
              <DeleteIcon />
            </button>
          </div>
        </div>
        <div class="proriv-gallery-card__title">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import EditIcon from '@/assets/icons/edit.svg'
import DeleteIcon from '@/assets/icons/delete.svg'

defineProps({
  items: {
    type: Array,
    required: true
  }
})

defineEmits(['add', 'edit', 'delete'])
</script>

<style scoped lang="scss">
.proriv-gallery-block {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 800;
      color: var(--black);
    }

    :deep(.el-button--primary) {
      padding: 8px 16px;

      span {
        color: var(--white);
      }
    }
  }
}

.proriv-gallery-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.proriv-gallery-card {
  width: 148px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__image {
    position: relative;
    width: 148px;
    height: 148px;
    border-radius: 10px;
    overflow: hidden;
    background: #F5F7FA;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__actions {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    gap: 5px;
  }

  &__action {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
    cursor: pointer;

    svg {
      width: 100%;
      height: 100%;
    }

    &--danger {
      background: rgba(255, 0, 0, 0.12);
    }
  }

  &__title {
    font-size: 12px;
    color: #3B3B3B;
    line-height: 1.4;
  }
}
</style>

