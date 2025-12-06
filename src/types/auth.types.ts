import type { User } from './index'

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
  confirmPassword: string
}

export interface AuthResponse {
  user: User
  token: string
  expiresIn: number
}