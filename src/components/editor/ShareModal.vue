<template>
  <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5)">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Поделиться доской</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        
        <div class="modal-body">
          <!-- Публичная ссылка -->
          <div class="mb-4" v-if="board?.isPublic">
            <label class="form-label small text-muted mb-2">Публичная ссылка</label>
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                :value="publicUrl"
                readonly
              >
              <button 
                class="btn btn-outline-secondary"
                @click="copyToClipboard(publicUrl)"
                :title="copySuccess ? 'Скопировано!' : 'Копировать'"
              >
                <i class="bi" :class="copySuccess ? 'bi-check' : 'bi-clipboard'"></i>
              </button>
            </div>
            <div class="form-text">
              Любой, у кого есть эта ссылка, может просматривать доску
            </div>
          </div>

          <!-- Приглашение по email -->
          <div class="mb-4">
            <label class="form-label small text-muted mb-2">Пригласить пользователей</label>
            <div class="input-group mb-2">
              <input
                v-model="inviteEmail"
                type="email"
                class="form-control"
                placeholder="Введите email"
                @keyup.enter="inviteUser"
              >
              <select v-model="invitePermission" class="form-select" style="max-width: 120px;">
                <option value="view">Просмотр</option>
                <option value="edit">Редактирование</option>
              </select>
              <button 
                class="btn btn-primary"
                @click="inviteUser"
                :disabled="!isValidEmail(inviteEmail)"
              >
                Пригласить
              </button>
            </div>
          </div>

          <!-- Список пользователей -->
          <div>
            <h6 class="small text-muted mb-3">Доступные пользователи</h6>
            
            <!-- Владелец -->
            <div class="d-flex align-items-center justify-content-between mb-2 p-2 bg-light rounded">
              <div class="d-flex align-items-center">
                <div class="avatar me-3">
                  <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" 
                       style="width: 32px; height: 32px;">
                    {{ getInitials(board?.ownerId || '') }}
                  </div>
                </div>
                <div>
                  <div class="fw-medium">Владелец</div>
                  <small class="text-muted">{{ board?.ownerId }}</small>
                </div>
              </div>
              <span class="badge bg-secondary">Владелец</span>
            </div>

            <!-- Совместные пользователи -->
            <div 
              v-for="user in sharedUsers" 
              :key="user.id"
              class="d-flex align-items-center justify-content-between mb-2 p-2 border rounded"
            >
              <div class="d-flex align-items-center">
                <div class="avatar me-3">
                  <div class="rounded-circle bg-info text-white d-flex align-items-center justify-content-center" 
                       style="width: 32px; height: 32px;">
                    {{ getInitials(user.email) }}
                  </div>
                </div>
                <div>
                  <div class="fw-medium">{{ user.email }}</div>
                  <small class="text-muted">Добавлен {{ formatDate(user.createdAt) }}</small>
                </div>
              </div>
              
              <div class="d-flex align-items-center gap-2">
                <select 
                  v-model="user.permission"
                  class="form-select form-select-sm"
                  style="width: auto;"
                  @change="updatePermission(user.id, user.permission)"
                >
                  <option value="view">Просмотр</option>
                  <option value="edit">Редактирование</option>
                </select>
                
                <button 
                  class="btn btn-sm btn-outline-danger border-0"
                  @click="removeUser(user.id)"
                  title="Удалить доступ"
                >
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            <!-- Пустой список -->
            <div 
              v-if="sharedUsers.length === 0"
              class="text-center py-4 text-muted"
            >
              <i class="bi bi-people display-6"></i>
              <p class="mt-2 mb-0">Пока никого не пригласили</p>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <div class="form-check">
            <input
              v-model="isPublic"
              class="form-check-input"
              type="checkbox"
              id="makePublic"
              @change="togglePublic"
            >
            <label class="form-check-label" for="makePublic">
              Сделать публичной
            </label>
          </div>
          
          <button type="button" class="btn btn-secondary" @click="$emit('close')">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Board } from '@/types'

interface Props {
  board: Board | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  share: [userId: string, permission: 'view' | 'edit']
  unshare: [userId: string]
}>()

const inviteEmail = ref('')
const invitePermission = ref<'view' | 'edit'>('view')
const copySuccess = ref(false)
const isPublic = ref(props.board?.isPublic || false)

// Моковые данные для демонстрации
const sharedUsers = ref([
  { id: 'user1', email: 'user1@example.com', permission: 'edit' as const, createdAt: new Date().toISOString() },
  { id: 'user2', email: 'user2@example.com', permission: 'view' as const, createdAt: new Date().toISOString() },
])

const publicUrl = computed(() => {
  if (!props.board) return ''
  return `${window.location.origin}/shared/${props.board.id}`
})

const getInitials = (email: string) => {
  if (!email) return '?'
  return email.charAt(0).toUpperCase()
}

const isValidEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const inviteUser = () => {
  if (!isValidEmail(inviteEmail.value)) {
    alert('Введите корректный email')
    return
  }

  // В реальном приложении здесь будет запрос к API
  sharedUsers.value.push({
    id: `new-${Date.now()}`,
    email: inviteEmail.value,
    permission: invitePermission.value,
    createdAt: new Date().toISOString()
  })

  emit('share', inviteEmail.value, invitePermission.value)
  
  inviteEmail.value = ''
  invitePermission.value = 'view'
}

const updatePermission = (userId: string, permission: string) => {
  const user = sharedUsers.value.find(u => u.id === userId)
  if (user && (permission === 'view' || permission === 'edit')) {
    user.permission = permission
    emit('share', user.email, permission)
  }
}

const removeUser = (userId: string) => {
  const user = sharedUsers.value.find(u => u.id === userId)
  if (user) {
    sharedUsers.value = sharedUsers.value.filter(u => u.id !== userId)
    emit('unshare', user.email)
  }
}

const togglePublic = () => {
  if (props.board) {
    // Обновить публичный статус доски
    console.log('Toggle public:', isPublic.value)
  }
}

watch(() => props.board, (newBoard) => {
  if (newBoard) {
    isPublic.value = newBoard.isPublic
  }
})
</script>

<style scoped>
.modal-content {
  border-radius: 12px;
  border: none;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.avatar {
  flex-shrink: 0;
}

.form-select-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.badge {
  font-size: 0.75em;
}
</style>