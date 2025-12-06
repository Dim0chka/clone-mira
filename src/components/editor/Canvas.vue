<template>
  <div 
    class="canvas"
    ref="canvasRef"
    :style="{
      backgroundColor: board?.backgroundColor || '#ffffff',
      backgroundImage: showGrid ? gridStyle : 'none',
      transform: `scale(${zoomLevel})`,
      transformOrigin: '0 0',
      width: `${canvasWidth}px`,
      height: `${canvasHeight}px`,
    }"
    @click="handleCanvasClick"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @contextmenu.prevent="handleContextMenu"
  >
    <!-- Стикеры -->
    <Sticker
      v-for="sticker in stickers"
      :key="sticker.id"
      :sticker="sticker"
      :is-selected="selectedStickerId === sticker.id"
      :is-dragging="uiStore.isDragging"
      :zoom-level="zoomLevel"
      @select="handleStickerSelect"
      @drag-start="handleDragStart"
      @drag="handleDrag"
      @drag-end="handleDragEnd"
      @resize="handleResize"
      @update="handleStickerUpdate"
    />
    
    <!-- Сетка координат -->
    <div 
      v-if="showCoordinates"
      class="coordinates position-fixed bottom-0 end-0 bg-dark text-white px-2 py-1 rounded-top-start small"
    >
      X: {{ mouseX }}, Y: {{ mouseY }}
    </div>
    
    <!-- Подсказка при выборе инструмента -->
    <div 
      v-if="uiStore.activeTool === 'sticker'"
      class="tool-hint position-fixed bottom-0 start-0 bg-primary text-white px-3 py-2 rounded-top-end small"
    >
      <i class="bi bi-mouse me-2"></i>
      Кликните на холсте, чтобы добавить стикер
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/store/ui.store'
import Sticker from './Sticker.vue'

const props = defineProps<{
  board: any
  selectedStickerId: string | null
}>()

const emit = defineEmits<{
  stickerSelect: [stickerId: string | null]
  stickerCreate: [position: { x: number; y: number }]
  stickerUpdate: [stickerId: string, updates: any]
}>()

const canvasRef = ref<HTMLElement>()
const uiStore = useUIStore()

const mouseX = ref(0)
const mouseY = ref(0)
const showCoordinates = ref(false)
const dragStart = ref<{ x: number; y: number } | null>(null)
const dragOffset = ref<{ x: number; y: number } | null>(null)
const resizeDirection = ref<string | null>(null)

const canvasWidth = ref(2000)
const canvasHeight = ref(2000)

const zoomLevel = computed(() => uiStore.zoomLevel)
const showGrid = computed(() => uiStore.showGrid)

const stickers = computed(() => 
  props.board?.stickers?.sort((a: any, b: any) => a.zIndex - b.zIndex) || []
)

const gridStyle = computed(() => {
  const size = 20 * zoomLevel.value
  const color = 'rgba(0, 0, 0, 0.1)'
  return `
    linear-gradient(90deg, ${color} 1px, transparent 1px) 0 0 / ${size}px ${size}px,
    linear-gradient(${color} 1px, transparent 1px) 0 0 / ${size}px ${size}px
  `
})

const handleCanvasClick = (e: MouseEvent) => {
  if (uiStore.activeTool === 'sticker') {
    const rect = canvasRef.value?.getBoundingClientRect()
    if (rect) {
      const x = (e.clientX - rect.left) / zoomLevel.value
      const y = (e.clientY - rect.top) / zoomLevel.value
      emit('stickerCreate', { x, y })
    }
  } else {
    emit('stickerSelect', null)
  }
}

const handleMouseMove = (e: MouseEvent) => {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (rect) {
    mouseX.value = Math.round((e.clientX - rect.left) / zoomLevel.value)
    mouseY.value = Math.round((e.clientY - rect.top) / zoomLevel.value)
    showCoordinates.value = true
  }

  if (uiStore.isDragging && dragStart.value && dragOffset.value && props.selectedStickerId) {
    const newX = mouseX.value - dragOffset.value.x
    const newY = mouseY.value - dragOffset.value.y
    
    emit('stickerUpdate', props.selectedStickerId, { x: newX, y: newY })
  }
}

const handleMouseUp = () => {
  if (uiStore.isDragging) {
    uiStore.isDragging = false
    dragStart.value = null
    dragOffset.value = null
  }
  
  if (uiStore.isResizing) {
    uiStore.isResizing = false
    resizeDirection.value = null
  }
}

const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  // Можно добавить контекстное меню для стикеров
}

const handleStickerSelect = (stickerId: string) => {
  emit('stickerSelect', stickerId)
}

const handleDragStart = (sticker: any, e: MouseEvent) => {
  uiStore.isDragging = true
  const rect = canvasRef.value?.getBoundingClientRect()
  if (rect) {
    dragStart.value = { x: mouseX.value, y: mouseY.value }
    dragOffset.value = {
      x: mouseX.value - sticker.x,
      y: mouseY.value - sticker.y,
    }
  }
  
  // Поднять стикер на передний план
  const maxZIndex = Math.max(...stickers.value.map((s: any) => s.zIndex), 0)
  if (sticker.zIndex < maxZIndex) {
    emit('stickerUpdate', sticker.id, { zIndex: maxZIndex + 1 })
  }
}

const handleDrag = (sticker: any, e: MouseEvent) => {
  if (!uiStore.isDragging || !dragStart.value || !dragOffset.value) return
  
  const newX = mouseX.value - dragOffset.value.x
  const newY = mouseY.value - dragOffset.value.y
  
  emit('stickerUpdate', sticker.id, { x: newX, y: newY })
}

const handleDragEnd = (sticker: any) => {
  uiStore.isDragging = false
  dragStart.value = null
  dragOffset.value = null
}

const handleResize = (sticker: any, direction: string, delta: { x: number; y: number }) => {
  const updates: any = {}
  
  const scaleX = delta.x / zoomLevel.value
  const scaleY = delta.y / zoomLevel.value
  
  switch (direction) {
    case 'n':
      updates.y = sticker.y + scaleY
      updates.height = Math.max(50, sticker.height - scaleY)
      break
    case 's':
      updates.height = Math.max(50, sticker.height + scaleY)
      break
    case 'w':
      updates.x = sticker.x + scaleX
      updates.width = Math.max(100, sticker.width - scaleX)
      break
    case 'e':
      updates.width = Math.max(100, sticker.width + scaleX)
      break
    case 'nw':
      updates.x = sticker.x + scaleX
      updates.y = sticker.y + scaleY
      updates.width = Math.max(100, sticker.width - scaleX)
      updates.height = Math.max(50, sticker.height - scaleY)
      break
    case 'ne':
      updates.y = sticker.y + scaleY
      updates.width = Math.max(100, sticker.width + scaleX)
      updates.height = Math.max(50, sticker.height - scaleY)
      break
    case 'sw':
      updates.x = sticker.x + scaleX
      updates.width = Math.max(100, sticker.width - scaleX)
      updates.height = Math.max(50, sticker.height + scaleY)
      break
    case 'se':
      updates.width = Math.max(100, sticker.width + scaleX)
      updates.height = Math.max(50, sticker.height + scaleY)
      break
  }
  
  emit('stickerUpdate', sticker.id, updates)
}

const handleStickerUpdate = (stickerId: string, updates: any) => {
  emit('stickerUpdate', stickerId, updates)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Delete' && props.selectedStickerId) {
    // Удаление будет обработано в BoardEditor
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.canvas {
  position: relative;
  overflow: auto;
  transition: transform 0.2s ease;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.05);
  min-width: 100%;
  min-height: 100%;
}

.coordinates {
  z-index: 1000;
  font-family: monospace;
  opacity: 0.8;
  backdrop-filter: blur(2px);
}

.tool-hint {
  z-index: 1000;
  opacity: 0.9;
  backdrop-filter: blur(2px);
}

.canvas::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

.canvas::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 6px;
}

.canvas::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 6px;
}

.canvas::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>