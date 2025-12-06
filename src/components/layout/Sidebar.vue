<template>
  <aside 
    class="sidebar d-flex flex-column border-end bg-white"
    :class="{ 'sidebar-collapsed': !isOpen }"
  >
    <!-- Заголовок -->
    <div class="sidebar-header p-3 border-bottom">
      <div class="d-flex align-items-center justify-content-between">
        <h6 class="mb-0 fw-semibold" v-if="isOpen">Быстрый доступ</h6>
        <button 
          class="btn btn-sm btn-outline-secondary border-0 p-1"
          @click="toggleSidebar"
          :title="isOpen ? 'Скрыть' : 'Показать'"
        >
          <i class="bi" :class="isOpen ? 'bi-chevron-left' : 'bi-chevron-right'"></i>
        </button>
      </div>
    </div>

    <!-- Навигация -->
    <nav class="sidebar-nav flex-grow-1 p-3">
      <ul class="nav flex-column gap-2">
        <li class="nav-item">
          <router-link 
            to="/dashboard" 
            class="nav-link d-flex align-items-center"
            :class="{ 'justify-content-center': !isOpen }"
            active-class="active"
          >
            <i class="bi bi-house me-3" :class="{ 'me-0': !isOpen }"></i>
            <span v-if="isOpen">Главная</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link 
            to="/recent" 
            class="nav-link d-flex align-items-center"
            :class="{ 'justify-content-center': !isOpen }"
            active-class="active"
          >
            <i class="bi bi-clock me-3" :class="{ 'me-0': !isOpen }"></i>
            <span v-if="isOpen">Недавние</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link 
            to="/starred" 
            class="nav-link d-flex align-items-center"
            :class="{ 'justify-content-center': !isOpen }"
            active-class="active"
          >
            <i class="bi bi-star me-3" :class="{ 'me-0': !isOpen }"></i>
            <span v-if="isOpen">Избранное</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link 
            to="/shared" 
            class="nav-link d-flex align-items-center"
            :class="{ 'justify-content-center': !isOpen }"
            active-class="active"
          >
            <i class="bi bi-people me-3" :class="{ 'me-0': !isOpen }"></i>
            <span v-if="isOpen">Совместные</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link 
            to="/templates" 
            class="nav-link d-flex align-items-center"
            :class="{ 'justify-content-center': !isOpen }"
            active-class="active"
          >
            <i class="bi bi-grid me-3" :class="{ 'me-0': !isOpen }"></i>
            <span v-if="isOpen">Шаблоны</span>
          </router-link>
        </li>
      </ul>

      <!-- Разделитель -->
      <hr class="my-4">

      <!-- Теги/категории -->
      <div v-if="isOpen">
        <h6 class="small text-muted mb-3">Теги</h6>
        <div class="d-flex flex-wrap gap-1">
          <span 
            v-for="tag in tags" 
            :key="tag.id"
            class="badge rounded-pill mb-1"
            :style="{ 
              backgroundColor: tag.color,
              color: getContrastColor(tag.color)
            }"
          >
            {{ tag.name }}
          </span>
        </div>
      </div>
    </nav>

    <!-- Футер сайдбара -->
    <div class="sidebar-footer p-3 border-top">
      <div class="d-flex align-items-center" :class="{ 'justify-content-center': !isOpen }">
        <button 
          class="btn btn-primary"
          :class="{ 'btn-sm': !isOpen }"
          @click="createNewBoard"
          :title="!isOpen ? 'Новая доска' : ''"
        >
          <i class="bi bi-plus-lg"></i>
          <span v-if="isOpen" class="ms-2">Новая доска</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBoardStore } from '@/store/board.store'
import { useUIStore } from '@/store/ui.store'
import { useRouter } from 'vue-router'

const boardStore = useBoardStore()
const uiStore = useUIStore()
const router = useRouter()

const isOpen = computed(() => uiStore.sidebarOpen)

const tags = ref([
  { id: 1, name: 'Работа', color: '#3b82f6' },
  { id: 2, name: 'Личное', color: '#10b981' },
  { id: 3, name: 'Обучение', color: '#8b5cf6' },
  { id: 4, name: 'Проект', color: '#f59e0b' },
])

const toggleSidebar = () => {
  uiStore.toggleSidebar()
}

const getContrastColor = (hexColor: string) => {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}

const createNewBoard = async () => {
  try {
    const newBoard = await boardStore.createBoard({
      title: 'Новая доска',
      description: 'Описание',
      isPublic: false,
      backgroundColor: '#ffffff'
    })
    
    if (newBoard) {
      router.push(`/board/${newBoard.id}`)
    }
  } catch (error) {
    console.error('Failed to create board:', error)
  }
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  min-height: calc(100vh - 60px);
  transition: width 0.3s ease;
}

.sidebar-collapsed {
  width: 70px;
}

.nav-link {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: #495057;
  transition: all 0.2s;
}

.nav-link:hover {
  background-color: #f8f9fa;
  color: #0d6efd;
}

.nav-link.active {
  background-color: #e7f1ff;
  color: #0d6efd;
  font-weight: 500;
}

.nav-link i {
  font-size: 1.1rem;
}

.sidebar-header h6 {
  transition: opacity 0.3s;
}

.sidebar-collapsed .sidebar-header h6 {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.sidebar-nav span {
  transition: opacity 0.3s;
}

.sidebar-collapsed .sidebar-nav span {
  opacity: 0;
  width: 0;
  overflow: hidden;
}
</style>