<template>
  <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5)">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Создать новую доску</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        
        <div class="modal-body">
          <div class="row">
            <!-- Левая часть - форма -->
            <div class="col-md-6">
              <form @submit.prevent="handleSubmit">
                <!-- Название -->
                <div class="mb-4">
                  <label for="boardTitle" class="form-label">
                    Название доски *
                  </label>
                  <input
                    v-model="form.title"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.title }"
                    id="boardTitle"
                    placeholder="Введите название доски"
                    required
                    autofocus
                  >
                  <div class="form-text">
                    Например: "План проекта", "Мозговой штурм", "Заметки"
                  </div>
                  <div class="invalid-feedback" v-if="errors.title">
                    {{ errors.title }}
                  </div>
                </div>
                
                <!-- Описание -->
                <div class="mb-4">
                  <label for="boardDescription" class="form-label">
                    Описание
                  </label>
                  <textarea
                    v-model="form.description"
                    class="form-control"
                    id="boardDescription"
                    rows="3"
                    placeholder="Необязательное описание"
                  ></textarea>
                  <div class="form-text">
                    Краткое описание цели или содержания доски
                  </div>
                </div>
                
                <!-- Настройки -->
                <div class="mb-4">
                  <h6 class="mb-3">Настройки доски</h6>
                  
                  <div class="form-check form-switch mb-3">
                    <input
                      v-model="form.isPublic"
                      class="form-check-input"
                      type="checkbox"
                      id="isPublic"
                    >
                    <label class="form-check-label" for="isPublic">
                      Публичная доска
                    </label>
                    <div class="form-text">
                      Публичные доски видны всем пользователям
                    </div>
                  </div>
                  
                  <div class="form-check form-switch">
                    <input
                      v-model="form.showGrid"
                      class="form-check-input"
                      type="checkbox"
                      id="showGrid"
                    >
                    <label class="form-check-label" for="showGrid">
                      Показывать сетку
                    </label>
                    <div class="form-text">
                      Отображать сетку на фоне доски
                    </div>
                  </div>
                </div>
                
                <!-- Шаблоны -->
                <div class="mb-4">
                  <h6 class="mb-3">Шаблоны</h6>
                  <div class="d-flex flex-wrap gap-2">
                    <button
                      v-for="template in templates"
                      :key="template.id"
                      type="button"
                      class="btn btn-outline-secondary btn-sm"
                      :class="{ 'active': selectedTemplate === template.id }"
                      @click="selectTemplate(template)"
                    >
                      {{ template.name }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            <!-- Правая часть - предпросмотр -->
            <div class="col-md-6">
              <div class="preview-container">
                <h6 class="mb-3">Предпросмотр</h6>
                
                <!-- Превью доски -->
                <div 
                  class="board-preview rounded border"
                  :style="{ 
                    backgroundColor: form.backgroundColor,
                    backgroundImage: form.showGrid ? previewGrid : 'none'
                  }"
                >
                  <!-- Пример стикеров в превью -->
                  <div 
                    v-for="sticker in previewStickers"
                    :key="sticker.id"
                    class="preview-sticker position-absolute rounded"
                    :style="sticker.style"
                  >
                    <div class="preview-sticker-content"></div>
                  </div>
                  
                  <!-- Название в превью -->
                  <div class="position-absolute top-0 start-0 w-100 p-3">
                    <h6 class="mb-0 text-dark">{{ form.title || 'Название доски' }}</h6>
                  </div>
                </div>
                
                <!-- Выбор цвета -->
                <div class="mt-4">
                  <label class="form-label mb-2">Цвет фона</label>
                  <div class="d-flex flex-wrap gap-2">
                    <button
                      v-for="color in backgroundColors"
                      :key="color"
                      class="color-option rounded border"
                      :style="{ backgroundColor: color }"
                      :class="{ 'selected': form.backgroundColor === color }"
                      @click="form.backgroundColor = color"
                      :title="getColorName(color)"
                    >
                      <i v-if="form.backgroundColor === color" class="bi bi-check text-white"></i>
                    </button>
                  </div>
                </div>
                
                <!-- Выбранный шаблон -->
                <div v-if="selectedTemplate" class="mt-4">
                  <div class="alert alert-info small mb-0">
                    <i class="bi bi-info-circle me-2"></i>
                    Выбран шаблон: <strong>{{ getTemplateName(selectedTemplate) }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-outline-secondary"
            @click="$emit('close')"
          >
            Отмена
          </button>
          
          <button 
            type="button" 
            class="btn btn-primary"
            :disabled="isSubmitting || !form.title.trim()"
            @click="handleSubmit"
          >
            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-plus-lg me-2"></i>
            Создать доску
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useBoardStore } from '@/store/board.store'

interface Props {
  initialData?: Partial<{
    title: string
    description: string
    backgroundColor: string
    isPublic: boolean
  }>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  created: [board: any]
}>()

const boardStore = useBoardStore()

const form = reactive({
  title: props.initialData?.title || '',
  description: props.initialData?.description || '',
  backgroundColor: props.initialData?.backgroundColor || '#ffffff',
  isPublic: props.initialData?.isPublic || false,
  showGrid: true,
})

const errors = reactive({
  title: '',
})

const isSubmitting = ref(false)
const selectedTemplate = ref<string | null>(null)

const backgroundColors = [
  '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6',
  '#fff9c4', '#c8e6c9', '#bbdefb', '#e1bee7',
  '#ffebee', '#e8f5e9', '#e3f2fd', '#f3e5f5',
]

const templates = [
  { id: 'blank', name: 'Пустая', color: '#ffffff', stickers: [] },
  { id: 'brainstorm', name: 'Мозговой штурм', color: '#e8f5e9', stickers: 3 },
  { id: 'project', name: 'Проект', color: '#e3f2fd', stickers: 4 },
  { id: 'todo', name: 'To-Do', color: '#fff9c4', stickers: 2 },
  { id: 'meeting', name: 'Совещание', color: '#f3e5f5', stickers: 3 },
]

const previewGrid = `
  linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px) 0 0 / 20px 20px,
  linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px) 0 0 / 20px 20px
`

const previewStickers = [
  {
    id: 1,
    style: {
      backgroundColor: '#fff9c4',
      left: '20%',
      top: '30%',
      width: '100px',
      height: '80px',
      transform: 'rotate(-5deg)',
    }
  },
  {
    id: 2,
    style: {
      backgroundColor: '#c8e6c9',
      left: '50%',
      top: '40%',
      width: '120px',
      height: '90px',
      transform: 'rotate(3deg)',
    }
  },
  {
    id: 3,
    style: {
      backgroundColor: '#bbdefb',
      left: '30%',
      top: '60%',
      width: '110px',
      height: '70px',
      transform: 'rotate(-2deg)',
    }
  },
]

const getColorName = (color: string) => {
  const colorMap: Record<string, string> = {
    '#ffffff': 'Белый',
    '#f8f9fa': 'Светло-серый',
    '#e9ecef': 'Серый',
    '#dee2e6': 'Темно-серый',
    '#fff9c4': 'Желтый',
    '#c8e6c9': 'Зеленый',
    '#bbdefb': 'Голубой',
    '#e1bee7': 'Фиолетовый',
    '#ffebee': 'Красный',
    '#e8f5e9': 'Светло-зеленый',
    '#e3f2fd': 'Светло-голубой',
    '#f3e5f5': 'Светло-фиолетовый',
  }
  return colorMap[color] || 'Цвет'
}

const getTemplateName = (templateId: string) => {
  const template = templates.find(t => t.id === templateId)
  return template?.name || 'Неизвестный шаблон'
}

const selectTemplate = (template: any) => {
  selectedTemplate.value = template.id
  form.backgroundColor = template.color
  
  // Можно добавить логику для предустановленных стикеров шаблона
  switch (template.id) {
    case 'brainstorm':
      form.title = 'Мозговой штурм'
      form.description = 'Сбор идей и мыслей'
      break
    case 'project':
      form.title = 'План проекта'
      form.description = 'Планирование задач и сроков'
      break
    case 'todo':
      form.title = 'Список задач'
      form.description = 'To-Do список'
      break
    case 'meeting':
      form.title = 'Совещание'
      form.description = 'Заметки с совещания'
      break
  }
}

const validateForm = () => {
  let isValid = true
  
  if (!form.title.trim()) {
    errors.title = 'Название обязательно'
    isValid = false
  } else if (form.title.trim().length < 2) {
    errors.title = 'Название должно быть не менее 2 символов'
    isValid = false
  } else {
    errors.title = ''
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    const boardData = {
      title: form.title.trim(),
      description: form.description.trim(),
      isPublic: form.isPublic,
      backgroundColor: form.backgroundColor,
    }
    
    const newBoard = await boardStore.createBoard(boardData)
    
    emit('created', newBoard)
    emit('close')
    
  } catch (error) {
    console.error('Failed to create board:', error)
    alert('Ошибка при создании доски')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-content {
  border-radius: 16px;
  border: none;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.preview-container {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  height: 100%;
}

.board-preview {
  height: 250px;
  background-size: 20px 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-sticker {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.preview-sticker:hover {
  transform: scale(1.05);
}

.preview-sticker-content {
  width: 100%;
  height: 100%;
  border-radius: 6px;
}

.color-option {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent !important;
  transition: transform 0.2s, box-shadow 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.selected {
  border-color: #4361ee !important;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
}

.btn.active {
  background-color: #4361ee;
  border-color: #4361ee;
  color: white;
}

.form-control:focus {
  border-color: #4361ee;
  box-shadow: 0 0 0 0.25rem rgba(67, 97, 238, 0.25);
}

.form-check-input:checked {
  background-color: #4361ee;
  border-color: #4361ee;
}
</style>