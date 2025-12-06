import type { User } from './index'

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
  confirmPassword?: string // только для валидации на фронте
}

// Ответ от POST /auth/login
export interface LoginResponse {
  user: User
  access_token: string
  refresh_token: string
}

// Ответ от POST /auth/refresh
export interface TokensResponse {
  access_token: string
  refresh_token: string
}