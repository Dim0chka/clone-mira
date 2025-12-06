<template>
  <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <input
          v-model="form.email"
          type="email"
          class="form-control"
          :class="{ 'is-invalid': errors.email }"
          id="email"
          required
          placeholder="Введите email"
          :disabled="isLoading"
      >
      <div class="invalid-feedback" v-if="errors.email">
        {{ errors.email }}
      </div>
    </div>

    <div class="mb-3">
      <label for="password" class="form-label">Пароль</label>
      <input
          v-model="form.password"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.password }"
          id="password"
          required
          placeholder="Введите пароль"
          :disabled="isLoading"
      >
      <div class="invalid-feedback" v-if="errors.password">
        {{ errors.password }}
      </div>
    </div>

    <div class="mb-3 form-check">
      <input
          v-model="form.rememberMe"
          type="checkbox"
          class="form-check-input"
          id="rememberMe"
          :disabled="isLoading"
      >
      <label class="form-check-label" for="rememberMe">
        Запомнить меня
      </label>
    </div>

    <div class="d-grid gap-2">
      <button
          type="submit"
          class="btn btn-primary btn-lg"
          :disabled="isLoading"
      >
        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
        {{ isLoading ? 'Вход...' : 'Войти' }}
      </button>
    </div>

    <div v-if="authStore.error" class="alert alert-danger mt-3 mb-0">
      {{ authStore.error }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/store/auth.store'

const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  rememberMe: false,
})

const errors = reactive({
  email: '',
  password: '',
})

const isLoading = ref(false)

const validateForm = (): boolean => {
  let isValid = true
  errors.email = ''
  errors.password = ''

  if (!form.email.trim()) {
    errors.email = 'Email обязателен'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Введите корректный email'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Пароль обязателен'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Пароль должен быть не менее 6 символов'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true

  try {
    await authStore.login({
      email: form.email,
      password: form.password,
      rememberMe: form.rememberMe,
    })
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script>