<template>
  <header class="app-header navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
    <div class="container-fluid">
      <!-- Логотип и бренд -->
      <router-link to="/dashboard" class="navbar-brand d-flex align-items-center">
        <div class="logo-icon bg-primary rounded-circle p-2 me-2">
          <i class="bi bi-kanban text-white"></i>
        </div>
        <span class="fw-bold text-primary">Miro Clone</span>
      </router-link>

      <!-- Кнопка для мобильного меню -->
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarContent"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Контент навигации -->
      <div class="collapse navbar-collapse" id="navbarContent">
        <!-- Поиск -->
        <div class="navbar-nav me-auto">
          <div class="nav-item search-container" style="max-width: 400px;">
            <div class="input-group">
              <span class="input-group-text bg-light border-0">
                <i class="bi bi-search text-muted"></i>
              </span>
              <input
                type="search"
                class="form-control border-0 bg-light"
                placeholder="Поиск досок, стикеров..."
              >
            </div>
          </div>
        </div>

        <!-- Действия -->
        <div class="navbar-nav align-items-center">
          <!-- Уведомления -->
          <div class="nav-item dropdown me-3">
            <button 
              class="btn btn-link nav-link p-0 position-relative"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-bell fs-5"></i>
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </button>
            <div class="dropdown-menu dropdown-menu-end" style="min-width: 300px;">
              <h6 class="dropdown-header">Уведомления</h6>
              <div class="dropdown-item">
                <div class="d-flex">
                  <div class="flex-shrink-0">
                    <i class="bi bi-person-plus text-primary"></i>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <p class="mb-0 small">Вас добавили к доске "План проекта"</p>
                    <small class="text-muted">10 минут назад</small>
                  </div>
                </div>
              </div>
              <hr class="dropdown-divider">
              <a href="#" class="dropdown-item text-center small">
                Показать все уведомления
              </a>
            </div>
          </div>

          <!-- Профиль пользователя -->
          <div class="nav-item dropdown">
            <button 
              class="btn btn-link nav-link d-flex align-items-center p-0"
              data-bs-toggle="dropdown"
            >
              <div class="avatar me-2">
                <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" 
                     style="width: 36px; height: 36px;">
                  {{ userInitials }}
                </div>
              </div>
              <span class="d-none d-md-inline">{{ authStore.user?.name }}</span>
              <i class="bi bi-chevron-down ms-1"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <router-link to="/dashboard" class="dropdown-item">
                  <i class="bi bi-speedometer2 me-2"></i> Мои доски
                </router-link>
              </li>
              <li>
                <router-link to="/profile" class="dropdown-item">
                  <i class="bi bi-person me-2"></i> Профиль
                </router-link>
              </li>
              <li>
                <a href="#" class="dropdown-item">
                  <i class="bi bi-gear me-2"></i> Настройки
                </a>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button @click="handleLogout" class="dropdown-item text-danger">
                  <i class="bi bi-box-arrow-right me-2"></i> Выйти
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const userInitials = computed(() => {
  if (!authStore.user?.name) return '?'
  return authStore.user.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  height: 60px;
  z-index: 1030;
}

.logo-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-container {
  width: 100%;
}

@media (min-width: 992px) {
  .search-container {
    width: 400px;
  }
}

.avatar {
  transition: transform 0.2s;
}

.avatar:hover {
  transform: scale(1.05);
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}
</style>