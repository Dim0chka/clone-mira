<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div class="text-center">
      <h1 class="display-1 fw-bold text-primary">404</h1>
      <p class="fs-3">
        <span class="text-danger">Ой!</span> Страница не найдена.
      </p>
      <p class="lead mb-4">
        Страница, которую вы ищете, не существует.
      </p>
      <router-link to="/" class="btn btn-primary btn-lg">
        Вернуться на главную
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// Компонент не требует логики, но тег script setup желателен для единообразия
</script>