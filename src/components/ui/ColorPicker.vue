<template>
  <div class="color-picker">
    <!-- Выбранный цвет -->
    <div class="selected-color mb-3">
      <div 
        class="color-preview rounded border"
        :style="{ backgroundColor: modelValue }"
        @click="showPicker = !showPicker"
      ></div>
      <input
        v-model="colorValue"
        type="text"
        class="form-control form-control-sm mt-2"
        placeholder="#000000"
        @input="handleInput"
      >
    </div>
    
    <!-- Палитра цветов -->
    <div v-if="showPicker" class="color-palette">
      <div class="d-flex flex-wrap gap-2 mb-3">
        <button
          v-for="color in palette"
          :key="color"
          class="color-swatch rounded border"
          :style="{ backgroundColor: color }"
          @click="selectColor(color)"
          :title="color"
        ></button>
      </div>
      
      <!-- Пользовательский выбор -->
      <div class="custom-color">
        <label class="form-label small text-muted">Пользовательский цвет</label>
        <input
          v-model="customColor"
          type="color"
          class="form-control form-control-color w-100"
          @input="selectColor(customColor)"
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string
  palette?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  palette: () => [
    '#fff9c4', '#c8e6c9', '#bbdefb', '#e1bee7',
    '#ffccbc', '#f8bbd0', '#d7ccc8', '#f5f5f5',
    '#ffebee', '#e8f5e9', '#e3f2fd', '#f3e5f5',
    '#000000', '#333333', '#666666', '#999999',
    '#cccccc', '#ffffff'
  ]
})

const emit = defineEmits<{
  'update:modelValue': [color: string]
  change: [color: string]
}>()

const showPicker = ref(false)
const colorValue = ref(props.modelValue)
const customColor = ref('#000000')

watch(() => props.modelValue, (newColor) => {
  colorValue.value = newColor
})

const selectColor = (color: string) => {
  colorValue.value = color
  emit('update:modelValue', color)
  emit('change', color)
  showPicker.value = false
}

const handleInput = () => {
  // Проверка на валидность hex цвета
  const hexRegex = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
  if (hexRegex.test(colorValue.value)) {
    const color = colorValue.value.startsWith('#') ? colorValue.value : `#${colorValue.value}`
    emit('update:modelValue', color)
    emit('change', color)
  }
}
</script>

<style scoped>
.color-picker {
  max-width: 200px;
}

.color-preview {
  width: 100%;
  height: 40px;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-preview:hover {
  transform: scale(1.02);
}

.color-swatch {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid transparent !important;
}

.color-swatch:hover {
  transform: scale(1.2);
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.form-control-color {
  height: 40px;
  padding: 0;
  cursor: pointer;
}

.custom-color {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}
</style>