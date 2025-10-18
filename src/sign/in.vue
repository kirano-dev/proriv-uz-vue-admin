<template>
  <div class="auth-wrap">
    <div class="card">
      <h2 class="title">Grow Up</h2>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @keyup.enter.native="onSubmit"
      >
        <el-form-item label="Логин" prop="login">
          <el-input v-model="form.login" placeholder="Введите логин" clearable />
        </el-form-item>

        <el-form-item label="Пароль" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="Введите пароль"
            show-password
          />
        </el-form-item>

        <div class="row-between">
          <el-checkbox v-model="form.remember">Запомнить меня</el-checkbox>
          <!-- <router-link class="muted" to="/sign/up">Регистрация</router-link> -->
        </div>

        <el-button
          type="primary"
          :loading="loading"
          class="w-full mt-2"
          @click="onSubmit"
        >
          Войти
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { http } from '@/lib/http'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const formRef = ref()
const loading = ref(false)
const form = ref({
  login: '',
  password: '',
  remember: true
})

const rules = {
  login: [{ required: true, message: 'Введите логин', trigger: 'blur' }],
  password: [{ required: true, message: 'Введите пароль', trigger: 'blur' }]
}

async function onSubmit() {
  try {
    await formRef.value.validate()
    loading.value = true

    // ⚙️ запрос к бэку
    const { data } = await http.post('/auth/login', {
      login: form.value.login,
      password: form.value.password
    })

    // ожидаем { access_token: '...' }
    auth.setToken(data.access_token)

    ElMessage.success('Добро пожаловать!')
    router.replace(route.query.redirect || { name: 'admin' })
  } catch (e) {
    if (e && e.response && e.response.data && e.response.data.message) {
      ElMessage.error(e.response.data.message)
    } else if (e?.message && e.message.includes('validation')) {
      // валидация формы — ничего
    } else if (e?.message) {
      ElMessage.error(e.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f7f8fa;
}
.card {
  width: 380px;
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0,0,0,.06);
}
.title {
  text-align: center;
  margin: 0 0 16px;
  color: #303133;
}
.row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.w-full { width: 100%; }
.mt-2 { margin-top: 12px; }
.muted { color: #909399; text-decoration: none; }
.muted:hover { color: #606266; }
</style>
