<template>
  <div class="board-editor" ref="editorRef">
    <!-- Шапка редактора -->
    <div class="editor-header bg-white border-bottom py-2 px-3">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-3">
          <button 
            class="btn btn-outline-secondary btn-sm"
            @click="goBack"
          >
            <i class="bi bi-arrow-left"></i>
          </button>
          
          <div>
            <input
              v-if="isEditingTitle"
              ref="titleInputRef"
              v-model="boardTitle"
              type="text"
              class="form-control form-control-sm"
              @blur="saveBoardTitle"
              @keyup.enter="saveBoardTitle"
            >
            <h2 v-else class="h5 mb-0 cursor-pointer" @click="startEditingTitle">
              {{ boardStore.currentBoard?.title || 'Загрузка...' }}
            </h2>
            
            <small class="text-muted">
              Последнее изменение: {{ lastUpdated }}
            </small>
          </div>
        </div>
        
        <div class="d-flex align-items-center gap-2">
          <!-- Панель инструментов -->
          <div class="btn-group me-3">
            <button
              v-for="tool in tools"
              :key="tool.id"
              class="btn btn-sm"
              :class="uiStore.activeTool === tool.id ? 'btn-primary' : 'btn-outline-secondary'"
              @click="uiStore.setActiveTool(tool.id)"
              :title="tool.title"
            >
              <i :class="tool.icon"></i>
            </button>
          </div>
          
          <!-- Действия с доской -->
          <button 
            class="btn btn-outline-secondary btn-sm me-2"
            @click="uiStore.toggleSidebar"
          >
            <i class="bi bi-layout-sidebar"></i>
          </button>
          
          <div class="btn-group">
            <button 
              class="btn btn-success btn-sm"
              @click="handleShare"
            >
              <i class="bi bi-share me-1"></i>
              Поделиться
            </button>
            
            <button 
              v-if="isOwner"
              class="btn btn-danger btn-sm"
              @click="handleDelete"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Основной контент -->
    <div class="editor-content d-flex h-100">
      <!-- Боковая панель -->
      <div 
        v-if="uiStore.sidebarOpen"
        class="sidebar bg-light border-end"
        style="width: 300px;"
      >
        <div class="p-3">
          <h6 class="text-muted mb-3">Свойства стикера</h6>
          
          <StickerToolbar 
            v-if="selectedSticker"
            :sticker="selectedSticker"
            @update="handleToolbarUpdate"
            @delete="handleToolbarDelete"
          />
          
          <div v-else class="text-center py-4 text-muted">
            <i class="bi bi-sticky display-6"></i>
            <p class="mt-2">Выберите стикер для редактирования</p>
          </div>
          
          <hr class="my-4">
          
          <div class="mb-3">
            <label class="form-label small text-muted">Цвет фона доски</label>
            <input
              v-model="boardBackground"
              type="color"
              class="form-control form-control-color"
              @change="updateBoardBackground"
            >
          </div>
        </div>
      </div>
      
      <!-- Холст -->
      <div class="canvas-container flex-grow-1 position-relative">
        <Canvas 
          ref="canvasRef"
          :board="boardStore.currentBoard"
          :selected-sticker-id="uiStore.selectedStickerId"
          @sticker-select="uiStore.selectSticker"
          @sticker-create="handleStickerCreate"
          @sticker-update="handleStickerUpdate"
        />
      </div>
    </div>
    
    <!-- Футер редактора -->
    <div class="editor-footer bg-white border-top py-2 px-3">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <small class="text-muted">
            Автосохранение: {{ autoSaveStatus }}
          </small>
        </div>
        
        <div class="d-flex align-items-center gap-3">
          <div class="zoom-controls">
            <button 
              class="btn btn-sm btn-outline-secondary"
              @click="zoomOut"
              :disabled="uiStore.zoomLevel <= 0.2"
            >
              <i class="bi bi-dash-lg"></i>
            </button>
            <span class="mx-2 small">{{ Math.round(uiStore.zoomLevel * 100) }}%</span>
            <button 
              class="btn btn-sm btn-outline-secondary"
              @click="zoomIn"
              :disabled="uiStore.zoomLevel >= 3"
            >
              <i class="bi bi-plus-lg"></i>
            </button>
            <button 
              class="btn btn-sm btn-outline-secondary ms-2"
              @click="uiStore.resetZoom"
            >
              Сбросить
            </button>
          </div>
          
          <div v-if="boardStore.currentBoard" class="text-muted small">
            Стикеров: {{ boardStore.currentBoard.stickers.length }}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Модальное окно общего доступа -->
  <ShareModal 
    v-if="showShareModal"
    :board="boardStore.currentBoard"
    @close="showShareModal = false"
    @share="handleBoardShare"
    @unshare="handleBoardUnshare"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBoardStore } from '@/store/board.store'
import { useUIStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import type { ActiveTool, Tool } from '../types/ui.types'
import type { PartialStickerData } from '../types/sticker.types'
import Canvas from '@/components/editor/Canvas.vue'
import StickerToolbar from '@/components/editor/StickerToolbar.vue'
import ShareModal from '@/components/editor/ShareModal.vue'

const route = useRoute()
const router = useRouter()
const boardStore = useBoardStore()
const uiStore = useUIStore()
const authStore = useAuthStore()

const editorRef = ref<HTMLElement>()
const canvasRef = ref()
const titleInputRef = ref<HTMLInputElement>()
const boardTitle = ref('')
const isEditingTitle = ref(false)
const showShareModal = ref(false)
const autoSaveStatus = ref('Сохранено')

const tools: Tool[] = [
  { id: 'select', icon: 'bi bi-cursor', title: 'Выделение' },
  { id: 'sticker', icon: 'bi bi-sticky', title: 'Стикер' },
]

const selectedSticker = computed(() => {
  if (!boardStore.currentBoard || !uiStore.selectedStickerId) return null
  return boardStore.currentBoard.stickers.find(
    (s: any) => s.id === uiStore.selectedStickerId
  )
})

const isOwner = computed(() => 
  boardStore.currentBoard?.ownerId === authStore.user?.id
)

const boardBackground = computed({
  get: () => boardStore.currentBoard?.backgroundColor || '#ffffff',
  set: (value) => {
    if (boardStore.currentBoard) {
      boardStore.currentBoard.backgroundColor = value
    }
  }
})

const lastUpdated = computed(() => {
  if (!boardStore.currentBoard?.updatedAt) return ''
  const date = new Date(boardStore.currentBoard.updatedAt)
  return date.toLocaleString('ru-RU')
})

const goBack = () => {
  router.push('/dashboard')
}

const startEditingTitle = () => {
  if (!isOwner.value) return
  
  isEditingTitle.value = true
  boardTitle.value = boardStore.currentBoard?.title || ''
  
  nextTick(() => {
    titleInputRef.value?.focus()
    titleInputRef.value?.select()
  })
}

const saveBoardTitle = async () => {
  if (!boardStore.currentBoard || !boardTitle.value.trim()) return
  
  isEditingTitle.value = false
  
  try {
    await boardStore.updateBoard(boardStore.currentBoard.id, {
      title: boardTitle.value.trim()
    })
    autoSaveStatus.value = 'Название сохранено'
  } catch (error) {
    console.error('Failed to update board title:', error)
    autoSaveStatus.value = 'Ошибка сохранения'
  }
}

const updateBoardBackground = async () => {
  if (!boardStore.currentBoard) return
  
  try {
    await boardStore.updateBoard(boardStore.currentBoard.id, {
      backgroundColor: boardBackground.value
    })
    autoSaveStatus.value = 'Фон сохранен'
  } catch (error) {
    console.error('Failed to update board background:', error)
    autoSaveStatus.value = 'Ошибка сохранения'
  }
}

const handleToolbarUpdate = (updates: PartialStickerData) => {
  if (selectedSticker.value) {
    handleStickerUpdate(selectedSticker.value.id, updates)
  }
}

const handleToolbarDelete = () => {
  if (selectedSticker.value) {
    handleStickerDelete(selectedSticker.value.id)
  }
}

const handleStickerCreate = async (position: { x: number; y: number }) => {
  if (!boardStore.currentBoard) return
  
  try {
    await boardStore.createSticker({
      boardId: boardStore.currentBoard.id,
      x: position.x,
      y: position.y,
      content: 'Новый стикер',
      color: '#fff9c4',
      width: 200,
      height: 150,
    })
    autoSaveStatus.value = 'Стикер создан'
  } catch (error) {
    console.error('Failed to create sticker:', error)
    autoSaveStatus.value = 'Ошибка создания'
  }
}

const handleStickerUpdate = async (stickerId: string, updates: PartialStickerData) => {
  try {
    await boardStore.updateSticker(stickerId, { id: stickerId, ...updates })
    autoSaveStatus.value = 'Изменения сохранены'
  } catch (error) {
    console.error('Failed to update sticker:', error)
    autoSaveStatus.value = 'Ошибка сохранения'
  }
}

const handleStickerDelete = async (stickerId: string) => {
  if (confirm('Удалить этот стикер?')) {
    try {
      await boardStore.deleteSticker(stickerId)
      uiStore.selectSticker(null)
      autoSaveStatus.value = 'Стикер удален'
    } catch (error) {
      console.error('Failed to delete sticker:', error)
      autoSaveStatus.value = 'Ошибка удаления'
    }
  }
}

const handleShare = () => {
  showShareModal.value = true
}

const handleBoardShare = async (userId: string, permission: 'view' | 'edit') => {
  if (!boardStore.currentBoard) return
  
  try {
    await boardStore.shareBoard(boardStore.currentBoard.id, userId, permission)
    autoSaveStatus.value = 'Доступ предоставлен'
  } catch (error) {
    console.error('Failed to share board:', error)
    autoSaveStatus.value = 'Ошибка предоставления доступа'
  }
}

const handleBoardUnshare = async (userId: string) => {
  if (!boardStore.currentBoard) return
  
  try {
    await boardStore.unshareBoard(boardStore.currentBoard.id, userId)
    autoSaveStatus.value = 'Доступ отозван'
  } catch (error) {
    console.error('Failed to unshare board:', error)
    autoSaveStatus.value = 'Ошибка отзыва доступа'
  }
}

const handleDelete = async () => {
  if (!boardStore.currentBoard || !confirm('Удалить эту доску?')) return
  
  try {
    await boardStore.deleteBoard(boardStore.currentBoard.id)
    router.push('/dashboard')
  } catch (error) {
    console.error('Failed to delete board:', error)
    alert('Ошибка при удалении доски')
  }
}

const zoomIn = () => {
  uiStore.setZoom(uiStore.zoomLevel + 0.1)
}

const zoomOut = () => {
  uiStore.setZoom(uiStore.zoomLevel - 0.1)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Delete' && uiStore.selectedStickerId) {
    handleStickerDelete(uiStore.selectedStickerId)
  }
  
  if (e.key === 'Escape') {
    uiStore.selectSticker(null)
  }
  
  // Горячие клавиши для инструментов
  if (e.key === 'v' || e.key === 'V') {
    uiStore.setActiveTool('select')
  }
  if (e.key === 's' || e.key === 'S') {
    uiStore.setActiveTool('sticker')
  }
  if (e.key === 't' || e.key === 'T') {
    uiStore.setActiveTool('text')
  }
}

onMounted(async () => {
  const boardId = route.params.id as string
  await boardStore.fetchBoard(boardId)
  
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.board-editor {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.editor-header {
  height: 60px;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.editor-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.sidebar {
  z-index: 90;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.canvas-container {
  overflow: auto;
  background-color: #e9ecef;
}

.editor-footer {
  height: 40px;
  z-index: 100;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.cursor-pointer {
  cursor: pointer;
}

.zoom-controls {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 2px 8px;
  border-radius: 20px;
  border: 1px solid #dee2e6;
}

.zoom-controls button {
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-control-color {
  width: 100%;
  height: 40px;
  padding: 0;
  cursor: pointer;
}

.btn-group .btn {
  border-radius: 6px !important;
}
</style>