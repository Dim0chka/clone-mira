<template>
  <div class="board-card card h-100 shadow-sm border-0 hover-effect">
    <!-- Превью доски -->
    <div 
      class="board-preview position-relative overflow-hidden rounded-top"
      :style="{ 
        backgroundColor: board.backgroundColor || '#ffffff',
        height: '180px',
        backgroundImage: showGrid ? gridBackground : 'none'
      }"
    >
      <!-- Миниатюры стикеров -->
      <div 
        v-for="sticker in visibleStickers" 
        :key="sticker.id"
        class="sticker-mini position-absolute"
        :style="getStickerStyle(sticker)"
      >
        <div class="sticker-content-mini"></div>
      </div>
      
      <!-- Бейджи -->
      <div class="position-absolute top-0 end-0 m-2">
        <span 
          v-if="board.isPublic" 
          class="badge bg-success badge-sm"
        >
          <i class="bi bi-globe me-1"></i> Публичная
        </span>
        <span 
          v-else 
          class="badge bg-secondary badge-sm"
        >
          <i class="bi bi-lock me-1"></i> Приватная
        </span>
      </div>
      
      <!-- Количество стикеров -->
      <div class="position-absolute bottom-0 start-0 m-2">
        <span class="badge bg-dark bg-opacity-50 text-white">
          <i class="bi bi-sticky me-1"></i>
          {{ board.stickers?.length || 0 }}
        </span>
      </div>
      
      <!-- Обложка -->
      <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-10"></div>
    </div>
    
    <!-- Тело карточки -->
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div class="flex-grow-1 me-2">
          <h5 class="card-title mb-1 text-truncate">{{ board.title }}</h5>
          <p class="card-text text-muted small mb-2 text-truncate-2">
            {{ board.description || 'Без описания' }}
          </p>
        </div>
        
        <!-- Меню действий -->
        <div class="dropdown">
          <button 
            class="btn btn-sm btn-outline-secondary border-0 dropdown-toggle-no-caret"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-three-dots-vertical"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <router-link 
                :to="{ name: 'board', params: { id: board.id } }"
                class="dropdown-item"
              >
                <i class="bi bi-pencil me-2"></i> Открыть
              </router-link>
            </li>
            <li>
              <button 
                class="dropdown-item"
                @click="handleDuplicate"
              >
                <i class="bi bi-copy me-2"></i> Дублировать
              </button>
            </li>
            <li v-if="isOwner">
              <button 
                class="dropdown-item"
                @click="handleShare"
              >
                <i class="bi bi-share me-2"></i> Поделиться
              </button>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li v-if="isOwner">
              <button 
                class="dropdown-item text-danger"
                @click="handleDelete"
              >
                <i class="bi bi-trash me-2"></i> Удалить
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Информация -->
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <div class="user-avatar me-2">
            <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" 
                 style="width: 24px; height: 24px; font-size: 0.7rem;">
              {{ userInitials }}
            </div>
          </div>
          <small class="text-muted">
            {{ isOwner ? 'Вы' : 'Владелец' }}
          </small>
        </div>
        
        <small class="text-muted">
          {{ formatDate(board.updatedAt) }}
        </small>
      </div>
    </div>
    
    <!-- Футер -->
    <div class="card-footer bg-transparent border-top-0 pt-0">
      <div class="d-grid">
        <router-link 
          :to="{ name: 'board', params: { id: board.id } }"
          class="btn btn-outline-primary btn-sm"
        >
          <i class="bi bi-box-arrow-in-right me-1"></i>
          Открыть доску
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth.store'
import { formatDate } from '@/utils/helpers'

interface Props {
  board: any
  isOwner: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  delete: [boardId: string]
  share: [boardId: string]
  duplicate: [board: any]
}>()

const authStore = useAuthStore()

const userInitials = computed(() => {
  const name = authStore.user?.name || 'Демо'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

const showGrid = computed(() => true)

const gridBackground = computed(() => {
  const size = 15
  const color = 'rgba(0, 0, 0, 0.05)'
  return `
    linear-gradient(90deg, ${color} 1px, transparent 1px) 0 0 / ${size}px ${size}px,
    linear-gradient(${color} 1px, transparent 1px) 0 0 / ${size}px ${size}px
  `
})

const visibleStickers = computed(() => {
  if (!props.board.stickers || props.board.stickers.length === 0) {
    return []
  }
  
  // Берем первые 4 стикера для превью
  return props.board.stickers.slice(0, 4)
})

const getStickerStyle = (sticker: any) => {
  // Масштабируем координаты для превью
  const scale = 0.15
  const maxX = 800
  const maxY = 600
  
  const x = (sticker.x / maxX) * 100
  const y = (sticker.y / maxY) * 100
  
  return {
    left: `${Math.min(x, 80)}%`,
    top: `${Math.min(y, 80)}%`,
    width: `${Math.max(sticker.width * scale, 20)}px`,
    height: `${Math.max(sticker.height * scale, 20)}px`,
    backgroundColor: sticker.color,
    transform: `rotate(${Math.random() * 10 - 5}deg)`,
    zIndex: sticker.zIndex || 1,
  }
}

const handleDelete = () => {
  if (confirm('Вы уверены, что хотите удалить эту доску?')) {
    emit('delete', props.board.id)
  }
}

const handleShare = () => {
  emit('share', props.board.id)
}

const handleDuplicate = () => {
  emit('duplicate', props.board)
}
</script>

<style scoped>
.board-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.board-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important;
}

.board-preview {
  position: relative;
  background-size: 15px 15px;
}

.sticker-mini {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.board-card:hover .sticker-mini {
  transform: scale(1.1) rotate(0deg);
}

.sticker-content-mini {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

.badge-sm {
  font-size: 0.65rem;
  padding: 0.25rem 0.5rem;
}

.dropdown-toggle-no-caret::after {
  display: none !important;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-avatar {
  flex-shrink: 0;
}

.hover-effect {
  cursor: pointer;
}
</style>