import { ref, onMounted, onUnmounted, Ref } from 'vue'

export function useResizable(elementRef: Ref<HTMLElement | null>, options?: {
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  onResizeStart?: (event: MouseEvent, direction: string) => void
  onResize?: (event: MouseEvent, width: number, height: number, direction: string) => void
  onResizeEnd?: (event: MouseEvent) => void
}) {
  const isResizing = ref(false)
  const direction = ref('')
  const startWidth = ref(0)
  const startHeight = ref(0)
  const startX = ref(0)
  const startY = ref(0)

  const handleMouseDown = (event: MouseEvent, dir: string) => {
    if (!elementRef.value) return
    
    event.stopPropagation()
    event.preventDefault()
    
    isResizing.value = true
    direction.value = dir
    
    const rect = elementRef.value.getBoundingClientRect()
    startWidth.value = rect.width
    startHeight.value = rect.height
    startX.value = event.clientX
    startY.value = event.clientY
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    options?.onResizeStart?.(event, dir)
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizing.value || !elementRef.value) return
    
    let newWidth = startWidth.value
    let newHeight = startHeight.value
    
    const deltaX = event.clientX - startX.value
    const deltaY = event.clientY - startY.value
    
    switch (direction.value) {
      case 'e':
        newWidth = startWidth.value + deltaX
        break
      case 'w':
        newWidth = startWidth.value - deltaX
        break
      case 's':
        newHeight = startHeight.value + deltaY
        break
      case 'n':
        newHeight = startHeight.value - deltaY
        break
      case 'se':
        newWidth = startWidth.value + deltaX
        newHeight = startHeight.value + deltaY
        break
      case 'sw':
        newWidth = startWidth.value - deltaX
        newHeight = startHeight.value + deltaY
        break
      case 'ne':
        newWidth = startWidth.value + deltaX
        newHeight = startHeight.value - deltaY
        break
      case 'nw':
        newWidth = startWidth.value - deltaX
        newHeight = startHeight.value - deltaY
        break
    }
    
    // Ограничения
    newWidth = Math.max(options?.minWidth || 50, newWidth)
    newHeight = Math.max(options?.minHeight || 30, newHeight)
    
    if (options?.maxWidth) {
      newWidth = Math.min(options.maxWidth, newWidth)
    }
    
    if (options?.maxHeight) {
      newHeight = Math.min(options.maxHeight, newHeight)
    }
    
    elementRef.value.style.width = `${newWidth}px`
    elementRef.value.style.height = `${newHeight}px`
    
    options?.onResize?.(event, newWidth, newHeight, direction.value)
  }

  const handleMouseUp = (event: MouseEvent) => {
    isResizing.value = false
    direction.value = ''
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    
    options?.onResizeEnd?.(event)
  }

  const createResizeHandle = (dir: string, element: HTMLElement) => {
    const handle = document.createElement('div')
    handle.className = `resize-handle resize-${dir}`
    handle.style.cssText = `
      position: absolute;
      width: 8px;
      height: 8px;
      background-color: #3b82f6;
      border: 1px solid white;
      border-radius: 50%;
      z-index: 1000;
      cursor: ${dir}-resize;
    `
    
    switch (dir) {
      case 'n':
        handle.style.top = '-4px'
        handle.style.left = '50%'
        handle.style.transform = 'translateX(-50%)'
        break
      case 's':
        handle.style.bottom = '-4px'
        handle.style.left = '50%'
        handle.style.transform = 'translateX(-50%)'
        break
      case 'w':
        handle.style.top = '50%'
        handle.style.left = '-4px'
        handle.style.transform = 'translateY(-50%)'
        break
      case 'e':
        handle.style.top = '50%'
        handle.style.right = '-4px'
        handle.style.transform = 'translateY(-50%)'
        break
      case 'nw':
        handle.style.top = '-4px'
        handle.style.left = '-4px'
        break
      case 'ne':
        handle.style.top = '-4px'
        handle.style.right = '-4px'
        break
      case 'sw':
        handle.style.bottom = '-4px'
        handle.style.left = '-4px'
        break
      case 'se':
        handle.style.bottom = '-4px'
        handle.style.right = '-4px'
        break
    }
    
    handle.addEventListener('mousedown', (e) => handleMouseDown(e as MouseEvent, dir))
    element.appendChild(handle)
    
    return handle
  }

  onMounted(() => {
    if (!elementRef.value) return
    
    const directions = ['n', 's', 'w', 'e', 'nw', 'ne', 'sw', 'se']
    const handles: HTMLElement[] = []
    
    directions.forEach(dir => {
      const handle = createResizeHandle(dir, elementRef.value!)
      handles.push(handle)
    })
    
    // Очистка при демонтаже
    onUnmounted(() => {
      handles.forEach(handle => {
        handle.removeEventListener('mousedown', (e) => handleMouseDown(e as MouseEvent, ''))
        handle.remove()
      })
    })
  })

  return {
    isResizing,
    direction,
    startResizing: handleMouseDown
  }
}