import { ref, onMounted, onUnmounted, Ref } from 'vue'

export function useDraggable(elementRef: Ref<HTMLElement | null>, options?: {
  onDragStart?: (event: MouseEvent) => void
  onDrag?: (event: MouseEvent, deltaX: number, deltaY: number) => void
  onDragEnd?: (event: MouseEvent) => void
}) {
  const isDragging = ref(false)
  const startX = ref(0)
  const startY = ref(0)
  const elementX = ref(0)
  const elementY = ref(0)

  const handleMouseDown = (event: MouseEvent) => {
    if (!elementRef.value) return
    
    isDragging.value = true
    startX.value = event.clientX
    startY.value = event.clientY
    
    const rect = elementRef.value.getBoundingClientRect()
    elementX.value = rect.left
    elementY.value = rect.top
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    options?.onDragStart?.(event)
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging.value || !elementRef.value) return
    
    const deltaX = event.clientX - startX.value
    const deltaY = event.clientY - startY.value
    
    options?.onDrag?.(event, deltaX, deltaY)
  }

  const handleMouseUp = (event: MouseEvent) => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    
    options?.onDragEnd?.(event)
  }

  onMounted(() => {
    if (elementRef.value) {
      elementRef.value.addEventListener('mousedown', handleMouseDown)
    }
  })

  onUnmounted(() => {
    if (elementRef.value) {
      elementRef.value.removeEventListener('mousedown', handleMouseDown)
    }
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })

  return {
    isDragging,
    elementX,
    elementY,
    startDragging: handleMouseDown
  }
}