import apiClient from './client'
import type { User } from '@/types'
import type { LoginCredentials, RegisterCredentials, LoginResponse, TokensResponse } from '@/types/auth.types'

export const authApi = {
  /**
   * Регистрация нового пользователя
   * POST /auth/register
   */
  async register(credentials: RegisterCredentials): Promise<void> {
    await apiClient.post('/auth/register', {
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
    })
    // Бэкенд возвращает 201 без body
  },

  /**
   * Вход в систему
   * POST /auth/login
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    })
    return response.data
  },

  /**
   * Обновление токенов
   * POST /auth/refresh
   */
  async refresh(refreshToken: string): Promise<TokensResponse> {
    const response = await apiClient.post<TokensResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    })
    return response.data
  },

  /**
   * Выход из системы
   * POST /auth/logout
   */
  async logout(refreshToken: string): Promise<void> {
    await apiClient.post('/auth/logout', {
      refresh_token: refreshToken,
    })
    // Бэкенд возвращает 204 без body
  },

  /**
   * Получение текущего пользователя
   * GET /users/me
   */
  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/users/me')
    return response.data
  },
}

export default authApi