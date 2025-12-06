<template>
  <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
    <div class="row">
      <div class="col-md-6 mb-3">
        <label for="name" class="form-label">Имя *</label>
        <input
          v-model="form.name"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.name }"
          id="name"
          required
          placeholder="Введите ваше имя"
        >
        <div class="invalid-feedback" v-if="errors.name">
          {{ errors.name }}
        </div>
      </div>
      
      <div class="col-md-6 mb-3">
        <label for="email" class="form-label">Email *</label>
        <input
          v-model="form.email"
          type="email"
          class="form-control"
          :class="{ 'is-invalid': errors.email }"
          id="email"
          required
          placeholder="Введите email"
        >
        <div class="invalid-feedback" v-if="errors.email">
          {{ errors.email }}
        </div>
      </div>
    </div>
    
    <div class="row">
      <div class="col-md-6 mb-3">
        <label for="password" class="form-label">Пароль *</label>
        <input
          v-model="form.password"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.password }"
          id="password"
          required
          placeholder="Введите пароль"
        >
        <div class="invalid-feedback" v-if="errors.password">
          {{ errors.password }}
        </div>
      </div>
      
      <div class="col-md-6 mb-3">
        <label for="confirmPassword" class="form-label">Подтверждение пароля *</label>
        <input
          v-model="form.confirmPassword"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.confirmPassword }"
          id="confirmPassword"
          required
          placeholder="Подтвердите пароль"
        >
        <div class="invalid-feedback" v-if="errors.confirmPassword">
          {{ errors.confirmPassword }}
        </div>
      </div>
    </div>
    
    <div class="mb-3">
      <div class="form-check">
        <input
          v-model="form.agreeToTerms"
          class="form-check-input"
          type="checkbox"
          id="agreeToTerms"
          :class="{ 'is-invalid': errors.agreeToTerms }"
        >
        <label class="form-check-label" for="agreeToTerms">
          Я согласен с <a href="#" class="text-decoration-none">условиями использования</a>
        </label>
        <div class="invalid-feedback" v-if="errors.agreeToTerms">
          {{ errors.agreeToTerms }}
        </div>
      </div>
    </div>
    
    <div class="d-grid gap-2">
      <button 
        type="submit" 
        class="btn btn-primary btn-lg"
        :disabled="isLoading"
      >
        <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
        Зарегистрироваться
      </button>
      
      <button 
        type="button" 
        class="btn btn-outline-secondary"
        @click="handleDemoRegister"
        :disabled="isLoading"
      >
        Создать демо-аккаунт
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
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: '',
})

const isLoading = ref(false)

const validateForm = () => {
  let isValid = true
  
  // Имя
  if (!form.name.trim()) {
    errors.name = 'Имя обязательно'
    isValid = false
  } else if (form.name.trim().length < 2) {
    errors.name = 'Имя должно быть не менее 2 символов'
    isValid = false
  } else {
    errors.name = ''
  }
  
  // Email
  if (!form.email.trim()) {
    errors.email = 'Email обязателен'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Введите корректный email'
    isValid = false
  } else {
    errors.email = ''
  }
  
  // Пароль
  if (!form.password) {
    errors.password = 'Пароль обязателен'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Пароль должен быть не менее 6 символов'
    isValid = false
  } else {
    errors.password = ''
  }
  
  // Подтверждение пароля
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Подтверждение пароля обязательно'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают'
    isValid = false
  } else {
    errors.confirmPassword = ''
  }
  
  // Согласие с условиями
  if (!form.agreeToTerms) {
    errors.agreeToTerms = 'Необходимо согласие с условиями'
    isValid = false
  } else {
    errors.agreeToTerms = ''
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword
    })
  } catch (error) {
    console.error('Registration failed:', error)
  } finally {
    isLoading.value = false
  }
}

const handleDemoRegister = async () => {
  form.name = 'Демо пользователь'
  form.email = `demo-${Date.now()}@example.com`
  form.password = 'demo123'
  form.confirmPassword = 'demo123'
  form.agreeToTerms = true
  
  await handleSubmit()
}
</script>