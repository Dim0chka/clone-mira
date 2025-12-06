// Базовые типы
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

export type ActiveTool = 'select' | 'sticker' | 'text' | 'shape'

export interface Sticker {
  id: string
  boardId: string
  userId: string
  content: string
  color: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  createdAt: string
  updatedAt: string
}

export interface Board {
  id: string
  title: string
  description?: string
  ownerId: string
  isPublic: boolean
  backgroundColor?: string // Сделайте необязательным
  createdAt: string
  updatedAt: string
  stickers: Sticker[]
  sharedWith: string[]
}


export interface BoardShare {
  id: string
  boardId: string
  userId: string
  permission: 'view' | 'edit'
  createdAt: string
}

// API ответы
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest extends LoginRequest {
  name: string
}

// Store состояния
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface BoardState {
  boards: Board[]
  currentBoard: Board | null
  isLoading: boolean
}

// Компонентные пропсы
export interface StickerProps {
  sticker: Sticker
  isSelected: boolean
  isDragging: boolean
}

export interface BoardCardProps {
  board: Board
  isOwner: boolean
}