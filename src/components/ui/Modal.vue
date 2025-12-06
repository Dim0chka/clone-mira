<template>
  <div 
    v-if="props.visible" 
    class="modal fade show d-block"
    :style="{ backgroundColor: 'rgba(0,0,0,0.5)' }"
    @click.self="handleBackdropClick"
  >
    <div 
      class="modal-dialog"
      :class="{
        'modal-dialog-centered': props.centered,
        'modal-lg': props.size === 'lg',
        'modal-sm': props.size === 'sm'
      }"
    >
      <div class="modal-content">
        <!-- Заголовок -->
        <div v-if="props.title || props.showClose" class="modal-header">
          <h5 v-if="props.title" class="modal-title">{{ props.title }}</h5>
          <button 
            v-if="props.showClose"
            type="button" 
            class="btn-close" 
            @click="close"
          ></button>
        </div>
        
        <!-- Контент -->
        <div class="modal-body">
          <slot></slot>
        </div>
        
        <!-- Футер -->
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  visible: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg'
  centered?: boolean
  showClose?: boolean
  backdropClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  size: 'md',
  centered: true,
  showClose: true,
  backdropClose: true
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

const close = () => {
  emit('update:visible', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.backdropClose) {
    close()
  }
}

// Блокировка скролла на body при открытом модальном окне
watch(() => props.visible, (isVisible) => {
  if (isVisible) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 1.5rem;
}

.modal-title {
  margin-bottom: 0;
  font-weight: 600;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
  padding: 1rem 1.5rem;
}
</style>