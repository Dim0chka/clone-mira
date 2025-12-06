<template>
  <div class="loading-spinner" :class="{ 'overlay': overlay }">
    <div class="spinner-container">
      <div class="spinner-border" :class="sizeClass" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
      <p v-if="message" class="mt-2 mb-0 text-muted small">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  overlay?: boolean
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  overlay: false,
  size: 'md',
  message: ''
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'spinner-border-sm'
    case 'lg': return ''
    default: return ''
  }
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}

.loading-spinner.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
  min-height: auto;
}

.spinner-container {
  text-align: center;
}

.spinner-border {
  color: #4361ee;
}
</style>