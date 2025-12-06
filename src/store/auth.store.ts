import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import type { LoginCredentials, RegisterCredentials } from '@/types/auth.types'
import { authApi } from '@/api/auth'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  
  // Загружаем пользователя из localStorage при инициализации
  const storedUser = localStorage.getItem('stub_user')
  const user = ref<User | null>(storedUser ? JSON.parse(storedUser) : null)
  
  const token = ref<string | null>(localStorage.getItem('stub_token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  const initAuth = () => {
    // При запуске пытаемся получить пользователя
    if (!user.value && token.value) {
      fetchUser()
    }
  }

  const fetchUser = async () => {
    try {
      const userData = await authApi.getMe()
      user.value = userData
      localStorage.setItem('stub_user', JSON.stringify(userData))
    } catch (err) {
      console.error('Failed to fetch user:', err)
      // В случае ошибки остаемся без пользователя
      user.value = null
      token.value = null
      localStorage.removeItem('stub_token')
      localStorage.removeItem('stub_user')
    }
  }

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null
    
    try {
      const { user: userData, token: authToken } = await authApi.login(credentials)
      
      user.value = userData
      token.value = authToken
      
      // Сохраняем в localStorage для сохранения состояния
      localStorage.setItem('stub_token', authToken)
      localStorage.setItem('stub_user', JSON.stringify(userData))
      
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      }
      
      await router.push('/dashboard')
    } catch (err: any) {
      error.value = err.message || 'Ошибка авторизации'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    isLoading.value = true
    error.value = null
    
    try {
      const { user: userData, token: authToken } = await authApi.register(credentials)
      
      user.value = userData
      token.value = authToken
      
      localStorage.setItem('stub_token', authToken)
      localStorage.setItem('stub_user', JSON.stringify(userData))
      
      await router.push('/dashboard')
    } catch (err: any) {
      error.value = err.message || 'Ошибка регистрации'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('stub_token')
    localStorage.removeItem('stub_user')
    localStorage.removeItem('rememberMe')
    router.push('/login')
  }

  const updateUser = (updatedUser: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...updatedUser }
      localStorage.setItem('stub_user', JSON.stringify(user.value))
    }
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    initAuth,
    login,
    register,
    logout,
    updateUser,
    fetchUser,
  }
})