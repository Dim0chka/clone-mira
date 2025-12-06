<template>
  <div class="board-list">
    <!-- Заголовок и кнопки -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="mb-1">{{ title }}</h3>
        <p class="text-muted mb-0 small" v-if="description">{{ description }}</p>
      </div>
      
      <div class="d-flex gap-2" v-if="showControls">
        <div class="btn-group" role="group">
          <button 
            class="btn btn-outline-secondary"
            :class="{ 'active': viewMode === 'grid' }"
            @click="viewMode = 'grid'"
            title="Сетка"
          >
            <i class="bi bi-grid-3x3"></i>
          </button>
          <button 
            class="btn btn-outline-secondary"
            :class="{ 'active': viewMode === 'list' }"
            @click="viewMode = 'list'"
            title="Список"
          >
            <i class="bi bi-list"></i>
          </button>
        </div>
        
        <div class="dropdown">
          <button 
            class="btn btn-outline-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            <i class="bi bi-funnel me-1"></i>
            Сортировка
          </button>
          <ul class="dropdown-menu">
            <li>
              <button 
                class="dropdown-item"
                :class="{ 'active': sortBy === 'updatedAt' }"
                @click="changeSort('updatedAt')"
              >
                По дате изменения
              </button>
            </li>
            <li>
              <button 
                class="dropdown-item"
                :class="{ 'active': sortBy === 'createdAt' }"
                @click="changeSort('createdAt')"
              >
                По дате создания
              </button>
            </li>
            <li>
              <button 
                class="dropdown-item"
                :class="{ 'active': sortBy === 'title' }"
                @click="changeSort('title')"
              >
                По названию
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Состояние загрузки -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
      <p class="mt-3 text-muted">Загрузка досок...</p>
    </div>
    
    <!-- Состояние ошибки -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle me-2"></i>
      {{ error }}
      <button class="btn btn-sm btn-outline-danger ms-3" @click="$emit('retry')">
        Повторить
      </button>
    </div>
    
    <!-- Пустое состояние -->
    <div v-else-if="filteredBoards.length === 0" class="empty-state text-center py-5">
      <div class="mb-4">
        <i class="bi bi-kanban display-1 text-muted"></i>
      </div>
      <h4 class="mb-3">{{ emptyTitle || 'Досок пока нет' }}</h4>
      <p class="text-muted mb-4" v-if="emptyDescription">
        {{ emptyDescription }}
      </p>
      <slot name="empty-action">
        <button 
          v-if="showCreateButton"
          class="btn btn-primary"
          @click="$emit('create')"
        >
          <i class="bi bi-plus-lg me-2"></i>
          Создать первую доску
        </button>
      </slot>
    </div>
    
    <!-- Список досок - сетка -->
    <div v-else-if="viewMode === 'grid'" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
      <div 
        v-for="board in sortedBoards"
        :key="board.id"
        class="col"
      >
        <BoardCard 
          :board="board"
          :is-owner="board.ownerId === authStore.user?.id"
          @delete="$emit('delete', board.id)"
          @share="$emit('share', board.id)"
          @duplicate="$emit('duplicate', board)"
        />
      </div>
    </div>
    
    <!-- Список досок - таблица -->
    <div v-else class="list-view">
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead>
            <tr>
              <th scope="col" style="width: 50px;"></th>
              <th scope="col">Название</th>
              <th scope="col">Описание</th>
              <th scope="col" class="text-center">Стикеры</th>
              <th scope="col">Дата изменения</th>
              <th scope="col" class="text-end">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="board in sortedBoards"
              :key="board.id"
              class="board-row"
              @click="$router.push({ name: 'board', params: { id: board.id } })"
            >
              <td>
                <div 
                  class="board-color-indicator rounded-circle"
                  :style="{ backgroundColor: board.backgroundColor }"
                ></div>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <strong>{{ board.title }}</strong>
                  <span 
                    v-if="board.isPublic"
                    class="badge bg-success ms-2"
                  >
                    <i class="bi bi-globe me-1"></i>
                  </span>
                </div>
              </td>
              <td>
                <small class="text-muted">
                  {{ board.description || '—' }}
                </small>
              </td>
              <td class="text-center">
                <span class="badge bg-light text-dark">
                  {{ board.stickers?.length || 0 }}
                </span>
              </td>
              <td>
                <small class="text-muted">
                  {{ formatDate(board.updatedAt) }}
                </small>
              </td>
              <td class="text-end">
                <div class="btn-group btn-group-sm" role="group">
                  <router-link 
                    :to="{ name: 'board', params: { id: board.id } }"
                    class="btn btn-outline-primary"
                    @click.stop
                  >
                    <i class="bi bi-box-arrow-in-right"></i>
                  </router-link>
                  <button 
                    class="btn btn-outline-secondary"
                    @click.stop="$emit('share', board.id)"
                  >
                    <i class="bi bi-share"></i>
                  </button>
                  <button 
                    class="btn btn-outline-danger"
                    @click.stop="$emit('delete', board.id)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Пагинация -->
    <div v-if="filteredBoards.length > itemsPerPage" class="mt-4">
      <nav aria-label="Пагинация досок">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="prevPage">
              <i class="bi bi-chevron-left"></i>
            </button>
          </li>
          
          <li 
            v-for="page in visiblePages"
            :key="page"
            class="page-item"
            :class="{ 
              active: page === currentPage,
              disabled: page === '...'
            }"
          >
            <button 
              v-if="page === '...'"
              class="page-link"
              disabled
            >
              {{ page }}
            </button>
            <button 
              v-else
              class="page-link"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </li>
          
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="nextPage">
              <i class="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/store/auth.store'
import { formatDate } from '@/utils/helpers'
import BoardCard from './BoardCard.vue'

interface Props {
  boards: any[]
  loading?: boolean
  error?: string
  title?: string
  description?: string
  emptyTitle?: string
  emptyDescription?: string
  showControls?: boolean
  showCreateButton?: boolean
  itemsPerPage?: number
  filter?: (board: any) => boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: '',
  title: 'Доски',
  description: '',
  emptyTitle: '',
  emptyDescription: '',
  showControls: true,
  showCreateButton: true,
  itemsPerPage: 12,
  filter: () => true
})

const emit = defineEmits<{
  create: []
  delete: [boardId: string]
  share: [boardId: string]
  duplicate: [board: any]
  retry: []
}>()

const authStore = useAuthStore()

const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref<'updatedAt' | 'createdAt' | 'title'>('updatedAt')
const sortDirection = ref<'asc' | 'desc'>('desc')
const currentPage = ref(1)

const filteredBoards = computed(() => {
  return props.boards.filter(props.filter)
})

const sortedBoards = computed(() => {
  const sorted = [...filteredBoards.value]
  
  sorted.sort((a, b) => {
    let valueA: any, valueB: any
    
    switch (sortBy.value) {
      case 'updatedAt':
        valueA = new Date(a.updatedAt).getTime()
        valueB = new Date(b.updatedAt).getTime()
        break
      case 'createdAt':
        valueA = new Date(a.createdAt).getTime()
        valueB = new Date(b.createdAt).getTime()
        break
      case 'title':
        valueA = a.title.toLowerCase()
        valueB = b.title.toLowerCase()
        break
      default:
        return 0
    }
    
    const direction = sortDirection.value === 'asc' ? 1 : -1
    
    if (valueA < valueB) return -1 * direction
    if (valueA > valueB) return 1 * direction
    return 0
  })
  
  // Пагинация
  const start = (currentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return sorted.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredBoards.value.length / props.itemsPerPage)
)

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const delta = 2
  
  if (totalPages.value <= 7) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
    return pages
  }
  
  pages.push(1)
  
  if (currentPage.value > delta + 2) {
    pages.push('...')
  }
  
  const left = Math.max(2, currentPage.value - delta)
  const right = Math.min(totalPages.value - 1, currentPage.value + delta)
  
  for (let i = left; i <= right; i++) {
    pages.push(i)
  }
  
  if (currentPage.value < totalPages.value - delta - 1) {
    pages.push('...')
  }
  
  if (totalPages.value > 1) {
    pages.push(totalPages.value)
  }
  
  return pages
})

const changeSort = (field: typeof sortBy.value) => {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortDirection.value = 'desc'
  }
}

const goToPage = (page: number | string) => {
  if (typeof page === 'number' && page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Сброс пагинации при изменении фильтров
watch(() => props.boards, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.board-list {
  min-height: 400px;
}

.empty-state {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 3rem 2rem;
}

.board-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.board-row:hover {
  background-color: #f8f9fa;
}

.board-color-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid #e9ecef;
}

.list-view .btn-group {
  opacity: 0.7;
  transition: opacity 0.2s;
}

.list-view tr:hover .btn-group {
  opacity: 1;
}

.pagination .page-item.active .page-link {
  background-color: #4361ee;
  border-color: #4361ee;
}

.pagination .page-link {
  color: #4361ee;
  border-radius: 6px;
  margin: 0 3px;
}

.pagination .page-link:hover {
  background-color: #e9ecef;
  border-color: #dee2e6;
}
</style>