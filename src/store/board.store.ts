import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Board, Sticker } from '@/types'
import type { CreateBoardData, UpdateStickerData } from '@/types/board.types'
import { boardApi, stickerApi } from '@/api/boards'
import { useAuthStore } from './auth.store'

export const useBoardStore = defineStore('board', () => {
  const authStore = useAuthStore()
  
  const boards = ref<Board[]>([])
  const currentBoard = ref<Board | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Компьютеды для фильтрации
  const myBoards = computed(() => 
    boards.value.filter(board => board.ownerId === authStore.user?.id)
  )
  
  const sharedBoards = computed(() =>
    boards.value.filter(board => 
      board.sharedWith.includes(authStore.user?.id || '') && 
      board.ownerId !== authStore.user?.id
    )
  )
  
  const publicBoards = computed(() =>
    boards.value.filter(board => board.isPublic)
  )

  // Действия с досками
  const fetchBoards = async () => {
    isLoading.value = true
    try {
      boards.value = await boardApi.getAll()
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const fetchBoard = async (boardId: string) => {
    isLoading.value = true
    try {
      currentBoard.value = await boardApi.getById(boardId)
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const createBoard = async (data: CreateBoardData) => {
    isLoading.value = true
    try {
      const newBoard = await boardApi.create(data)
      boards.value.push(newBoard)
      return newBoard
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateBoard = async (boardId: string, data: Partial<Board>) => {
    try {
      const updatedBoard = await boardApi.update(boardId, data)
      const index = boards.value.findIndex(b => b.id === boardId)
      if (index !== -1) {
        boards.value[index] = updatedBoard
      }
      if (currentBoard.value?.id === boardId) {
        currentBoard.value = updatedBoard
      }
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const deleteBoard = async (boardId: string) => {
    try {
      await boardApi.delete(boardId)
      boards.value = boards.value.filter(b => b.id !== boardId)
      if (currentBoard.value?.id === boardId) {
        currentBoard.value = null
      }
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Действия со стикерами
  const createSticker = async (data: {
    boardId: string
    content?: string
    color?: string
    x: number
    y: number
    width?: number
    height?: number
  }) => {
    try {
      const sticker = await stickerApi.create(data)
      if (currentBoard.value?.id === data.boardId) {
        currentBoard.value.stickers.push(sticker)
      }
      return sticker
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const updateSticker = async (stickerId: string, data: UpdateStickerData) => {
    try {
      const updatedSticker = await stickerApi.update(stickerId, data)
      if (currentBoard.value) {
        const index = currentBoard.value.stickers.findIndex(s => s.id === stickerId)
        if (index !== -1) {
          currentBoard.value.stickers[index] = updatedSticker
        }
      }
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const deleteSticker = async (stickerId: string) => {
    try {
      await stickerApi.delete(stickerId)
      if (currentBoard.value) {
        currentBoard.value.stickers = currentBoard.value.stickers.filter(
          s => s.id !== stickerId
        )
      }
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Действия с совместным доступом
  const shareBoard = async (boardId: string, userId: string, permission: 'view' | 'edit') => {
    try {
      await boardApi.share(boardId, { userId, permission })
      await fetchBoard(boardId)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const unshareBoard = async (boardId: string, userId: string) => {
    try {
      await boardApi.unshare(boardId, userId)
      await fetchBoard(boardId)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  // Автосохранение
    const autoSaveSticker = async (stickerId: string, updates: Partial<Sticker>) => {
    try {
        await stickerApi.update(stickerId, { 
        id: stickerId, 
        ...updates 
        })
    } catch (err) {
        console.error('Auto-save failed:', err)
    }
    }

  return {
    boards,
    currentBoard,
    isLoading,
    error,
    myBoards,
    sharedBoards,
    publicBoards,
    fetchBoards,
    fetchBoard,
    createBoard,
    updateBoard,
    deleteBoard,
    createSticker,
    updateSticker,
    deleteSticker,
    shareBoard,
    unshareBoard,
    autoSaveSticker,
  }
})