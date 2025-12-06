<template>
  <div
    class="sticker position-absolute"
    :class="{ 
      selected: isSelected,
      dragging: isDragging,
    }"
    :style="stickerStyle"
    @mousedown="handleMouseDown"
    @dblclick="handleDoubleClick"
  >
    <!-- Ресайз-хэндлы -->
    <template v-if="isSelected">
      <div
        v-for="handle in resizeHandles"
        :key="handle.position"
        class="resize-handle"
        :class="`resize-${handle.position}`"
        :style="handle.style"
        @mousedown.stop="handleResizeStart(handle.position, $event)"
      ></div>
    </template>
    
    <!-- Контент стикера -->
    <div 
      v-if="!isEditing"
      class="sticker-content p-3 h-100"
      @mousedown="handleContentMouseDown"
    >
      <div v-if="sticker.content" class="content-text" v-html="formattedContent"></div>
      <div v-else class="placeholder text-muted opacity-50">
        Кликните дважды для редактирования
      </div>
    </div>
    
    <!-- Редактор текста -->
    <textarea
      v-else
      ref="textareaRef"
      v-model="editingContent"
      class="sticker-editor form-control h-100 border-0 p-3"
      @blur="saveContent"
      @keydown.ctrl.enter="saveContent"
      @keydown.esc="cancelEdit"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const props = defineProps<{
  sticker: any
  isSelected: boolean
  isDragging: boolean
  zoomLevel: number
}>()

const emit = defineEmits<{
  select: [id: string]
  dragStart: [sticker: any, event: MouseEvent]
  drag: [sticker: any, event: MouseEvent]
  dragEnd: [sticker: any]
  resize: [sticker: any, direction: string, delta: { x: number; y: number }]
  update: [stickerId: string, updates: any]
}>()

const isEditing = ref(false)
const editingContent = ref('')
const textareaRef = ref<HTMLTextAreaElement>()

const stickerStyle = computed(() => ({
  left: `${props.sticker.x}px`,
  top: `${props.sticker.y}px`,
  width: `${props.sticker.width}px`,
  height: `${props.sticker.height}px`,
  backgroundColor: props.sticker.color,
  transform: `scale(${props.zoomLevel})`,
  transformOrigin: '0 0',
  zIndex: props.sticker.zIndex,
  boxShadow: props.isSelected ? '0 0 0 2px #3b82f6, 0 8px 16px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.2)',
  borderRadius: '8px',
  cursor: props.isDragging ? 'grabbing' : 'grab',
  overflow: 'hidden',
  transition: props.isDragging ? 'none' : 'all 0.2s ease',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
}))

const formattedContent = computed(() => {
  return props.sticker.content?.replace(/\n/g, '<br>') || ''
})

const resizeHandles = computed(() => {
  const size = 8 / props.zoomLevel
  const offset = -size / 2
  
  const baseStyle = {
    width: `${size}px`,
    height: `${size}px`,
    position: 'absolute' as const,
    backgroundColor: '#3b82f6',
    border: '1px solid white',
    borderRadius: '50%',
    zIndex: 1000,
  }
  
  return [
    { position: 'n', style: { ...baseStyle, cursor: 'n-resize', top: `${offset}px`, left: '50%', transform: 'translateX(-50%)' } },
    { position: 's', style: { ...baseStyle, cursor: 's-resize', bottom: `${offset}px`, left: '50%', transform: 'translateX(-50%)' } },
    { position: 'w', style: { ...baseStyle, cursor: 'w-resize', top: '50%', left: `${offset}px`, transform: 'translateY(-50%)' } },
    { position: 'e', style: { ...baseStyle, cursor: 'e-resize', top: '50%', right: `${offset}px`, transform: 'translateY(-50%)' } },
    { position: 'nw', style: { ...baseStyle, cursor: 'nw-resize', top: `${offset}px`, left: `${offset}px` } },
    { position: 'ne', style: { ...baseStyle, cursor: 'ne-resize', top: `${offset}px`, right: `${offset}px` } },
    { position: 'sw', style: { ...baseStyle, cursor: 'sw-resize', bottom: `${offset}px`, left: `${offset}px` } },
    { position: 'se', style: { ...baseStyle, cursor: 'se-resize', bottom: `${offset}px`, right: `${offset}px` } },
  ]
})

const handleMouseDown = (e: MouseEvent) => {
  emit('select', props.sticker.id)
  
  if (!isEditing.value) {
    emit('dragStart', props.sticker, e)
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      emit('drag', props.sticker, moveEvent)
    }
    
    const onMouseUp = () => {
      emit('dragEnd', props.sticker)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }
}

const handleContentMouseDown = (e: MouseEvent) => {
  e.stopPropagation()
  emit('select', props.sticker.id)
}

const handleDoubleClick = () => {
  isEditing.value = true
  editingContent.value = props.sticker.content || ''
  
  nextTick(() => {
    textareaRef.value?.focus()
    textareaRef.value?.select()
  })
}

const saveContent = () => {
  isEditing.value = false
  if (editingContent.value !== props.sticker.content) {
    emit('update', props.sticker.id, { content: editingContent.value })
  }
}

const cancelEdit = () => {
  isEditing.value = false
  editingContent.value = props.sticker.content || ''
}

const handleResizeStart = (direction: string, e: MouseEvent) => {
  e.stopPropagation()
  e.preventDefault()
  
  const startX = e.clientX
  const startY = e.clientY
  
  const onMouseMove = (moveEvent: MouseEvent) => {
    const deltaX = moveEvent.clientX - startX
    const deltaY = moveEvent.clientY - startY
    emit('resize', props.sticker, direction, { x: deltaX, y: deltaY })
  }
  
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }
  
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}
</script>

<style scoped>
.sticker {
  user-select: none;
}

.sticker.selected {
  box-shadow: 0 0 0 2px #3b82f6, 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}

.sticker.dragging {
  opacity: 0.8;
}

.sticker-content {
  cursor: text;
  overflow-wrap: break-word;
  word-break: break-word;
  line-height: 1.5;
}

.sticker-editor {
  resize: none;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  line-height: 1.5;
  background: transparent;
  cursor: text;
}

.resize-handle {
  position: absolute;
  z-index: 10;
}

.resize-n { cursor: n-resize; }
.resize-s { cursor: s-resize; }
.resize-w { cursor: w-resize; }
.resize-e { cursor: e-resize; }
.resize-nw { cursor: nw-resize; }
.resize-ne { cursor: ne-resize; }
.resize-sw { cursor: sw-resize; }
.resize-se { cursor: se-resize; }

.placeholder {
  font-style: italic;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.content-text {
  white-space: pre-wrap;
}
</style>