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
        </div>

        <el-button type="primary" :loading="loading" class="w-full mt-2" @click="onSubmit">
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

const formRef = ref(null)
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

/**
 * onSubmit:
 * - валидируем форму (Element Plus validate возвращает Promise)
 * - отправляем POST /auth/login (http.baseURL задан в lib/http.js через VITE_API_BASE)
 * - получаем access_token в data.access_token (подстрой под свой бэк, если поле другое)
 * - сохраняем токен через auth.setToken и подгружаем профиль
 * - редиректим пользователя в админку или на redirect
 */
async function onSubmit() {
  try {
    // валидируем форму
    await formRef.value.validate()
    loading.value = true

    // запрос на авторизацию
    const { data } = await http.post('/auth/login', {
      login: form.value.login,
      password: form.value.password
    })

    // ожидаем access_token (адаптируй, если бэк возвращает другое поле)
    const token = data?.access_token || data?.token || data?.accessToken
    if (!token) {
      throw new Error('Токен не получен от сервера')
    }

    // сохраним токен (store обновит localStorage и axios header)
    auth.setToken(token)

    // опционально — подгрузим профиль пользователя
    try {
      await auth.fetchUser()
    } catch (_) {
      // если профиль не загрузился — не критично, просто продолжим
    }

    ElMessage.success('Добро пожаловать!')
    // редиректим на requested route или в админку
    const redirect = route.query.redirect || { name: 'admin' }
    router.replace(redirect)
  } catch (e) {
    // ошибки от API (axios)
    if (e?.response?.data?.message) {
      ElMessage.error(e.response.data.message)
    } else if (e?.message && e.message.includes('validation')) {
      // ошибку валидации формы не показываем глобально
    } else if (e?.message) {
      ElMessage.error(e.message)
    } else {
      ElMessage.error('Ошибка входа')
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
  background: var(--ultra-light-grey);
}

.card {
  width: 380px;
  background: var(--white);
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .06);
}

.title {
  text-align: center;
  margin: 0 0 16px;
  color: var(--black);
}

.row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.w-full {
  width: 100%;
}

.mt-2 {
  margin-top: 12px;
}

.muted {
  color: #909399;
  text-decoration: none;
}

.muted:hover {
  color: #606266;
}
</style>
