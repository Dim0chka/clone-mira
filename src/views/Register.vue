<template>
  <div class="auth-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h1 class="h3 mb-3 font-weight-normal">Регистрация</h1>
                <p class="text-muted">Создайте новый аккаунт</p>
              </div>
              
              <RegisterForm />
              
              <div class="text-center mt-4">
                <p class="mb-0">
                  Уже есть аккаунт?
                  <router-link to="/login" class="text-decoration-none">
                    Войти
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RegisterForm from '@/components/auth/RegisterForm.vue'
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  border-radius: 15px;
}
</style>