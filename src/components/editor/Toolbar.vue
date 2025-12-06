<template>
  <div class="editor-toolbar d-flex align-items-center gap-2 p-3 bg-white border-bottom">
    <!-- Основные инструменты -->
    <div class="btn-group me-3">
      <button
        v-for="tool in tools"
        :key="tool.id"
        class="btn btn-sm"
        :class="activeTool === tool.id ? 'btn-primary' : 'btn-outline-secondary'"
        @click="setActiveTool(tool.id)"
        :title="tool.title"
      >
        <i :class="tool.icon"></i>
        <span class="d-none d-md-inline ms-1">{{ tool.title }}</span>
      </button>
    </div>

    <!-- Цвета -->
    <div class="dropdown me-3">
      <button 
        class="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center"
        type="button"
        data-bs-toggle="dropdown"
      >
        <div class="color-preview me-2" :style="{ backgroundColor: selectedColor }"></div>
        <span class="d-none d-md-inline">Цвет</span>
      </button>
      <div class="dropdown-menu p-2" style="min-width: 200px;">
        <div class="d-flex flex-wrap gap-2">
          <button
            v-for="color in colors"
            :key="color"
            class="color-option rounded border-0"
            :style="{ backgroundColor: color }"
            @click="selectColor(color)"
            :title="getColorName(color)"
          ></button>
        </div>
      </div>
    </div>

    <!-- Шрифты -->
    <div class="dropdown me-3">
      <button 
        class="btn btn-sm btn-outline-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
      >
        <span class="d-none d-md-inline">Шрифт</span>
        <span class="d-md-none">
          <i class="bi bi-fonts"></i>
        </span>
      </button>
      <div class="dropdown-menu">
        <a 
          v-for="font in fonts" 
          :key="font"
          href="#"
          class="dropdown-item"
          :style="{ fontFamily: font }"
          @click.prevent="selectFont(font)"
        >
          {{ font }}
        </a>
      </div>
    </div>

    <!-- Разделитель -->
    <div class="vr d-none d-lg-block"></div>

    <!-- Действия -->
    <div class="d-flex gap-2 ms-auto">
      <button 
        class="btn btn-sm btn-outline-secondary"
        @click="undo"
        :disabled="!canUndo"
        title="Отменить (Ctrl+Z)"
      >
        <i class="bi bi-arrow-counterclockwise"></i>
      </button>
      <button 
        class="btn btn-sm btn-outline-secondary"
        @click="redo"
        :disabled="!canRedo"
        title="Повторить (Ctrl+Y)"
      >
        <i class="bi bi-arrow-clockwise"></i>
      </button>
      
      <div class="vr"></div>
      
      <button 
        class="btn btn-sm btn-outline-secondary"
        @click="toggleGrid"
        :title="showGrid ? 'Скрыть сетку' : 'Показать сетку'"
      >
        <i class="bi" :class="showGrid ? 'bi-grid-3x3' : 'bi-grid'"></i>
      </button>
      
      <button 
        class="btn btn-sm btn-outline-secondary"
        @click="clearBoard"
        title="Очистить доску"
      >
        <i class="bi bi-trash"></i>
      </button>
      
      <button 
        class="btn btn-sm btn-success"
        @click="saveBoard"
        title="Сохранить (Ctrl+S)"
      >
        <i class="bi bi-save me-1"></i>
        <span class="d-none d-md-inline">Сохранить</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUIStore } from '@/store/ui.store'
import { useBoardStore } from '@/store/board.store'
import type { ActiveTool } from '@/types/index'

const uiStore = useUIStore()
const boardStore = useBoardStore()

const selectedColor = ref('#fff9c4')
const canUndo = ref(false)
const canRedo = ref(false)

const activeTool = computed(() => uiStore.activeTool)
const showGrid = computed(() => uiStore.showGrid)

const tools: { id: ActiveTool; icon: string; title: string }[] = [
  { id: 'select', icon: 'bi bi-cursor', title: 'Выделение' },
  { id: 'sticker', icon: 'bi bi-sticky', title: 'Стикер' },
  { id: 'text', icon: 'bi bi-type', title: 'Текст' },
  { id: 'shape', icon: 'bi bi-square', title: 'Фигура' },
]

const colors = [
  '#fff9c4', '#c8e6c9', '#bbdefb', '#e1bee7',
  '#ffccbc', '#f8bbd0', '#d7ccc8', '#f5f5f5',
  '#ffebee', '#e8f5e9', '#e3f2fd', '#f3e5f5'
]

const fonts = [
  'Arial, sans-serif',
  'Helvetica, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
  'Courier New, monospace',
  'Verdana, sans-serif'
]

const getColorName = (color: string) => {
  const colorMap: Record<string, string> = {
    '#fff9c4': 'Желтый',
    '#c8e6c9': 'Зеленый',
    '#bbdefb': 'Голубой',
    '#e1bee7': 'Фиолетовый',
    '#ffccbc': 'Оранжевый',
    '#f8bbd0': 'Розовый',
    '#d7ccc8': 'Коричневый',
    '#f5f5f5': 'Серый',
    '#ffebee': 'Красный',
  }
  return colorMap[color] || 'Цвет'
}

const setActiveTool = (tool: ActiveTool) => {
  uiStore.setActiveTool(tool)
}

const selectColor = (color: string) => {
  selectedColor.value = color
  // Эмитить событие для изменения цвета выделенного стикера
}

const selectFont = (font: string) => {
  // Эмитить событие для изменения шрифта
}

const toggleGrid = () => {
  uiStore.showGrid = !uiStore.showGrid
}

const undo = () => {
  // Логика отмены
}

const redo = () => {
  // Логика повтора
}

const clearBoard = () => {
  if (confirm('Очистить всю доску? Это действие нельзя отменить.')) {
    // Логика очистки
  }
}

const saveBoard = async () => {
  if (boardStore.currentBoard) {
    try {
      await boardStore.updateBoard(boardStore.currentBoard.id, {
        stickers: boardStore.currentBoard.stickers
      })
    } catch (error) {
      console.error('Failed to save board:', error)
    }
  }
}

// Горячие клавиши
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 'z':
        e.preventDefault()
        undo()
        break
      case 'y':
        e.preventDefault()
        redo()
        break
      case 's':
        e.preventDefault()
        saveBoard()
        break
    }
  }
}

// Добавить слушатель событий
window.addEventListener('keydown', handleKeyDown)
</script>

<style scoped>
.editor-toolbar {
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.color-option {
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
}

.btn-group .btn {
  border-radius: 6px !important;
}

.dropdown-toggle::after {
  margin-left: 0.5em;
}
</style>