import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import type { LoginCredentials, RegisterCredentials } from '@/types/auth.types'
import { authApi } from '@/api/auth'
import { useRouter } from 'vue-router'
import type { AxiosError } from 'axios'

interface ApiErrorResponse {
  error: string
  message: string
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const accessToken = computed(() => localStorage.getItem('access_token'))

  /**
   * Инициализация auth state при загрузке приложения
   */
  const initAuth = async () => {
    const token = localStorage.getItem('access_token')
    const storedUser = localStorage.getItem('user')

    if (token && storedUser) {
      try {
        user.value = JSON.parse(storedUser)
        // Валидируем токен получением актуальных данных пользователя
        await fetchUser()
      } catch {
        clearAuth()
      }
    }
  }

  /**
   * Получение данных текущего пользователя
   */
  const fetchUser = async () => {
    try {
      const userData = await authApi.getMe()
      user.value = userData
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (err) {
      console.error('Failed to fetch user:', err)
      clearAuth()
      throw err
    }
  }

  /**
   * Вход в систему
   */
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authApi.login(credentials)

      // Сохраняем токены
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)
      localStorage.setItem('user', JSON.stringify(response.user))

      user.value = response.user

      await router.push('/dashboard')
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>
      error.value = axiosError.response?.data?.message || 'Ошибка авторизации'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Регистрация нового пользователя
   */
  const register = async (credentials: RegisterCredentials) => {
    isLoading.value = true
    error.value = null

    try {
      // Регистрация не возвращает токены - нужно залогиниться после
      await authApi.register(credentials)

      // Автоматический вход после регистрации
      await login({
        email: credentials.email,
        password: credentials.password,
      })
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>
      error.value = axiosError.response?.data?.message || 'Ошибка регистрации'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Выход из системы
   */
  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token')

    try {
      if (refreshToken) {
        await authApi.logout(refreshToken)
      }
    } catch (err) {
      // Игнорируем ошибки logout - всё равно очищаем локальное состояние
      console.warn('Logout request failed:', err)
    } finally {
      clearAuth()
      router.push('/login')
    }
  }

  /**
   * Очистка auth состояния
   */
  const clearAuth = () => {
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }

  /**
   * Обновление данных пользователя (локально)
   */
  const updateUser = (updatedUser: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...updatedUser }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  return {
    // State
    user,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    accessToken,

    // Actions
    initAuth,
    fetchUser,
    login,
    register,
    logout,
    updateUser,
    clearAuth,
  }
})