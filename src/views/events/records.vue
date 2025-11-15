<template>
  <div class="event-records-layout">
    <Sidebar />
    
    <main class="event-records">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/events' }">События</el-breadcrumb-item>
        <el-breadcrumb-item>Записаны</el-breadcrumb-item>
      </el-breadcrumb>

      <h1 class="event-records__title">Записи на событие: {{ eventTitle }}</h1>

      <div class="event-records__table-wrapper">
        <el-table :data="records" border class="event-records__table">
          <el-table-column 
            type="index" 
            label="№" 
            width="60"
            align="center"
            header-align="center"
          />

          <el-table-column 
            prop="phone" 
            label="Телефон участника" 
            align="left"
            header-align="center"
            min-width="150"
          >
            <template #default="{ row }">
              <span class="event-records__phone">{{ row.phone }}</span>
            </template>
          </el-table-column>

          <el-table-column 
            prop="tariff" 
            label="Тариф" 
            align="left"
            header-align="center"
            min-width="200"
          >
            <template #default="{ row }">
              <span class="event-records__tariff">{{ formatTariff(row) }}</span>
            </template>
          </el-table-column>

          <el-table-column 
            prop="price" 
            label="Стоимость" 
            align="left"
            header-align="center"
            min-width="150"
          >
            <template #default="{ row }">
              <span class="event-records__price">{{ formatPrice(row.price) }}</span>
            </template>
          </el-table-column>

          <el-table-column 
            prop="payment_method" 
            label="Способ оплаты" 
            align="left"
            header-align="center"
            min-width="150"
          >
            <template #default="{ row }">
              <span class="event-records__payment">{{ row.payment_method }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

const route = useRoute()
const eventTitle = ref('')
const records = ref([])

const loadEventData = () => {
  const eventId = route.params.id
  
  eventTitle.value = 'Выступление бизнес - аналитика компании Google'
  
  records.value = [
    {
      id: 1,
      phone: '+998 99 999 99 99',
      tariff_name: 'Тариф Light',
      tariff_people: 1,
      price: 500000,
      payment_method: 'PayMe'
    },
    {
      id: 2,
      phone: '+998 99 999 99 99',
      tariff_name: 'Тариф Light',
      tariff_people: 1,
      price: 500000,
      payment_method: 'PayMe'
    },
    {
      id: 3,
      phone: '+998 99 999 99 99',
      tariff_name: 'Тариф Light',
      tariff_people: 1,
      price: 500000,
      payment_method: 'PayMe'
    },
    {
      id: 4,
      phone: '+998 99 999 99 99',
      tariff_name: 'Тариф Light',
      tariff_people: 1,
      price: 500000,
      payment_method: 'PayMe'
    }
  ]
}

const formatTariff = (record) => {
  const people = record.tariff_people === 1 ? '1 человек' : `${record.tariff_people} человека`
  return `${record.tariff_name}, ${people}`
}

const formatPrice = (price) => {
  return `${price.toLocaleString('ru-RU')} UZS`
}

onMounted(() => {
  loadEventData()
})
</script>

<style scoped lang="scss">
.event-records-layout {
  display: flex;
  min-height: 100vh;
  background: var(--grey-bg);
}

.event-records {
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

  &__table-wrapper {
    margin-top: 30px;
  }

  &__table {
    width: 100%;
    font-size: 14px;

    :deep(.el-table__header-wrapper th) {
      background: var(--table-header-bg);
      color: var(--table-text);
      font-weight: 700;
      height: 40px;
    }

    :deep(.el-table__row) {
      height: 32px;
    }

    :deep(.el-table__cell) {
      border-color: var(--table-border);
    }
  }

  &__phone,
  &__tariff,
  &__payment {
    color: var(--table-text);
    font-size: 14px;
  }

  &__price {
    color: var(--table-price);
    font-size: 14px;
  }
}
</style>

