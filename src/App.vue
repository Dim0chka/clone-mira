<template>
  <div id="app" class="min-vh-100 d-flex flex-column">
    <AppHeader v-if="!isAuthPage" />

    <div class="d-flex">
      
      <main class="flex-grow-1">
        <router-view v-slot="{ Component }">
          <suspense>
            <component :is="Component" />
            <template #fallback>
              <div class="d-flex justify-content-center align-items-center min-vh-100">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Загрузка...</span>
                </div>
              </div>
            </template>
          </suspense>
        </router-view>
      </main>
    </div>
    
    <footer class="bg-light border-top py-3">
      <div class="container">
        <div class="text-center text-muted small">
          © 2024 Miro Clone. Все права защищены.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'

const route = useRoute()

const isAuthPage = computed(() => 
  route.name === 'login' || route.name === 'register'
)
</script>

<style scoped>
#app {
  background-color: #f8f9fa;
}
</style>