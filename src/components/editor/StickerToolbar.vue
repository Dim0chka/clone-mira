<template>
  <div class="sticker-toolbar">
    <!-- Цвета -->
    <div class="mb-4">
      <label class="form-label small text-muted mb-2">Цвет стикера</label>
      <div class="d-flex flex-wrap gap-2">
        <button
          v-for="color in colors"
          :key="color"
          class="color-btn rounded-circle border"
          :style="{ backgroundColor: color }"
          :class="{ 'selected': props.sticker.color === color }"
          @click="updateColor(color)"
          :title="getColorName(color)"
        >
          <i v-if="props.sticker.color === color" class="bi bi-check text-white"></i>
        </button>
      </div>
    </div>

    <!-- Размер -->
    <div class="mb-4">
      <label class="form-label small text-muted mb-2">Размер</label>
      <div class="row g-2">
        <div class="col-6">
          <label class="small text-muted">Ширина</label>
          <div class="input-group input-group-sm">
            <input
              v-model.number="width"
              type="number"
              class="form-control"
              min="100"
              max="1000"
              @change="updateSize"
            >
            <span class="input-group-text">px</span>
          </div>
        </div>
        <div class="col-6">
          <label class="small text-muted">Высота</label>
          <div class="input-group input-group-sm">
            <input
              v-model.number="height"
              type="number"
              class="form-control"
              min="50"
              max="800"
              @change="updateSize"
            >
            <span class="input-group-text">px</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Действия -->
    <div class="d-grid gap-2">
      <button
        class="btn btn-outline-danger btn-sm"
        @click="$emit('delete')"
      >
        <i class="bi bi-trash me-1"></i> Удалить стикер
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PartialStickerData } from '@/types/sticker.types'

interface Props {
  sticker: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  update: [updates: PartialStickerData]
  delete: []
}>()

const width = ref(props.sticker.width)
const height = ref(props.sticker.height)
const fontSize = ref(16)
const isBold = ref(false)
const isItalic = ref(false)
const isUnderline = ref(false)

const colors = [
  '#fff9c4', // Желтый
  '#c8e6c9', // Зеленый
  '#bbdefb', // Голубой
  '#e1bee7', // Фиолетовый
  '#ffccbc', // Оранжевый
  '#f8bbd0', // Розовый
  '#d7ccc8', // Коричневый
  '#f5f5f5', // Серый
  '#ffebee', // Красный
  '#e8f5e9', // Зеленый 2
  '#e3f2fd', // Голубой 2
  '#f3e5f5', // Фиолетовый 2
]

const fontSizes = [12, 14, 16, 18, 20, 24, 32]

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

watch(() => props.sticker, (newSticker) => {
  width.value = newSticker.width
  height.value = newSticker.height
})

const updateColor = (color: string) => {
  emit('update', { color })
}

const updateSize = () => {
  if (width.value >= 100 && width.value <= 1000 && height.value >= 50 && height.value <= 800) {
    emit('update', {
      width: width.value,
      height: height.value
    })
  }
}

const updateFontSize = (size: number) => {
  fontSize.value = size
  // Здесь можно добавить логику обновления стилей текста
}

const toggleBold = () => {
  isBold.value = !isBold.value
}

const toggleItalic = () => {
  isItalic.value = !isItalic.value
}

const toggleUnderline = () => {
  isUnderline.value = !isUnderline.value
}

const bringToFront = () => {
  emit('update', { zIndex: (props.sticker.zIndex || 0) + 100 })
}

const sendToBack = () => {
  emit('update', { zIndex: (props.sticker.zIndex || 0) - 100 })
}
</script>

<style scoped>
.sticker-toolbar {
  padding: 0.5rem;
}

.color-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid transparent !important;
}

.color-btn:hover {
  transform: scale(1.1);
}

.color-btn.selected {
  border-color: #4361ee !important;
  box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.3);
}

.btn-group .btn.active {
  background-color: #4361ee;
  border-color: #4361ee;
  color: white;
}
</style>