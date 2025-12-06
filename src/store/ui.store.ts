import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ActiveTool } from '@/types/ui.types'

export const useUIStore = defineStore('ui', () => {
  const sidebarOpen = ref(true)
  const activeTool = ref<ActiveTool>('select')
  const selectedStickerId = ref<string | null>(null)
  const isDragging = ref(false)
  const isResizing = ref(false)
  const showGrid = ref(true)
  const zoomLevel = ref(1)

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const setActiveTool = (tool: ActiveTool) => {
    activeTool.value = tool
    selectedStickerId.value = null
  }

  const selectSticker = (stickerId: string | null) => {
    selectedStickerId.value = stickerId
    if (stickerId) {
      activeTool.value = 'select'
    }
  }

  const setZoom = (level: number) => {
    zoomLevel.value = Math.max(0.1, Math.min(3, level))
  }

  const resetZoom = () => {
    zoomLevel.value = 1
  }

  return {
    sidebarOpen,
    activeTool,
    selectedStickerId,
    isDragging,
    isResizing,
    showGrid,
    zoomLevel,
    toggleSidebar,
    setActiveTool,
    selectSticker,
    setZoom,
    resetZoom,
  }
})