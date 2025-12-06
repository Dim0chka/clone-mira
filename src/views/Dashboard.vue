<template>
  <div class="dashboard">
    <!-- Шапка -->
    <div class="container-fluid py-4 bg-white border-bottom">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="h2 mb-1">Мои доски</h1>
            <p class="text-muted mb-0">
              Создавайте, редактируйте и делитесь досками
            </p>
          </div>
          <div class="d-flex gap-2">
            <button 
              class="btn btn-primary"
              @click="showCreateModal = true"
            >
              <i class="bi bi-plus-lg me-2"></i>
              Новая доска
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Контент -->
    <div class="container py-4">
      <!-- Фильтры и поиск -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex flex-wrap gap-3 align-items-center">
            <!-- Поиск -->
            <div class="flex-grow-1">
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0">
                  <i class="bi bi-search"></i>
                </span>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control border-start-0"
                  placeholder="Поиск досок..."
                  @input="handleSearch"
                >
              </div>
            </div>
            
            <!-- Вкладки -->
            <div class="btn-group" role="group">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                class="btn"
                :class="activeTab === tab.id ? 'btn-primary' : 'btn-outline-primary'"
                @click="activeTab = tab.id"
              >
                {{ tab.label }}
                <span class="badge bg-secondary ms-1">
                  {{ getTabCount(tab.id) }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Список досок -->
      <BoardList
        :boards="filteredBoards"
        :loading="boardStore.isLoading"
        :title="activeTabTitle"
        :show-create-button="filteredBoards.length === 0"
        @create="showCreateModal = true"
        @delete="handleDeleteBoard"
        @share="handleShareBoard"
        @duplicate="handleDuplicateBoard"
        @retry="boardStore.fetchBoards"
      />
    </div>
    
    <!-- Модальное окно создания доски -->
    <CreateBoardModal 
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleBoardCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBoardStore } from '@/store/board.store'
import { useAuthStore } from '@/store/auth.store'
import BoardList from '@/components/boards/BoardList.vue'
import CreateBoardModal from '@/components/boards/CreateBoardModal.vue'

const boardStore = useBoardStore()
const authStore = useAuthStore()

const activeTab = ref<'all' | 'my' | 'shared' | 'public'>('all')
const searchQuery = ref('')
const showCreateModal = ref(false)

const isDemo = computed(() => 
  authStore.user?.email?.includes('demo') || 
  authStore.user?.email?.includes('example')
)

const tabs = [
  { id: 'all' as const, label: 'Все доски' },
  { id: 'my' as const, label: 'Мои доски' },
  { id: 'shared' as const, label: 'Доступные мне' },
  { id: 'public' as const, label: 'Публичные' },
]

const activeTabTitle = computed(() => {
  const tab = tabs.find(t => t.id === activeTab.value)
  return tab?.label || 'Доски'
})

const getTabCount = (tabId: string) => {
  switch (tabId) {
    case 'my': return boardStore.myBoards.length
    case 'shared': return boardStore.sharedBoards.length
    case 'public': return boardStore.publicBoards.length
    default: return boardStore.boards.length
  }
}

const filteredBoards = computed(() => {
  let boards = []
  
  switch (activeTab.value) {
    case 'my':
      boards = boardStore.myBoards
      break
    case 'shared':
      boards = boardStore.sharedBoards
      break
    case 'public':
      boards = boardStore.publicBoards
      break
    default:
      boards = boardStore.boards
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    boards = boards.filter(board =>
      board.title.toLowerCase().includes(query) ||
      board.description?.toLowerCase().includes(query)
    )
  }
  
  return boards
})

const handleSearch = () => {
  // Дебаунс можно добавить при необходимости
  console.log('Search:', searchQuery.value)
}

const handleBoardCreated = (board: any) => {
  showCreateModal.value = false
  boardStore.fetchBoards()
}

const handleDeleteBoard = async (boardId: string) => {
  if (confirm('Вы уверены, что хотите удалить эту доску?')) {
    await boardStore.deleteBoard(boardId)
  }
}

const handleShareBoard = (boardId: string) => {
  console.log('Share board:', boardId)
  // Здесь можно открыть модальное окно для общего доступа
  alert(`Функция общего доступа для доски ${boardId} (в разработке)`)
}

const handleDuplicateBoard = async (board: any) => {
  if (confirm(`Дублировать доску "${board.title}"?`)) {
    try {
      const newBoard = await boardStore.createBoard({
        title: `${board.title} (Копия)`,
        description: board.description,
        isPublic: board.isPublic,
        backgroundColor: board.backgroundColor,
      })
      
      // Копируем стикеры
      if (board.stickers && board.stickers.length > 0) {
        for (const sticker of board.stickers) {
          await boardStore.createSticker({
            boardId: newBoard.id,
            content: sticker.content,
            color: sticker.color,
            x: sticker.x + 20, // Смещаем немного
            y: sticker.y + 20,
            width: sticker.width,
            height: sticker.height,
          })
        }
      }
      
      boardStore.fetchBoards()
      
    } catch (error) {
      console.error('Failed to duplicate board:', error)
      alert('Ошибка при дублировании доски')
    }
  }
}

const resetStubData = () => {
  if (confirm('Сбросить все демо-данные? Все доски будут восстановлены к начальному состоянию.')) {
    localStorage.removeItem('stub_boards')
    
    // Перезагружаем страницу
    window.location.reload()
  }
}

onMounted(async () => {
  await boardStore.fetchBoards()
})
</script>

<style scoped>
.dashboard {
  min-height: calc(100vh - 60px);
  background-color: #f8f9fa;
}

.input-group-text {
  background-color: white;
}

.btn-group .btn {
  border-radius: 6px !important;
}

.badge {
  font-size: 0.7em;
  padding: 0.25em 0.5em;
}
</style>