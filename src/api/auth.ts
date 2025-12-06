import type { User } from '@/types'
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth.types'

// Создаем заглушку API
export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('[STUB] Login called with:', credentials)
    
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const user: User = {
      id: 'user-' + Date.now(),
      email: credentials.email,
      name: credentials.email.split('@')[0],
      avatar: undefined,
      createdAt: new Date().toISOString(),
    }
    
    return {
      user,
      token: 'stub-token-' + Date.now(),
      expiresIn: 3600,
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    console.log('[STUB] Register called with:', credentials)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const user: User = {
      id: 'user-' + Date.now(),
      email: credentials.email,
      name: credentials.name,
      avatar: undefined,
      createdAt: new Date().toISOString(),
    }
    
    return {
      user,
      token: 'stub-token-' + Date.now(),
      expiresIn: 3600,
    }
  },

  async getMe(): Promise<User> {
    console.log('[STUB] getMe called')
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Возвращаем тестового пользователя из localStorage или создаем нового
    const storedUser = localStorage.getItem('stub_user')
    if (storedUser) {
      return JSON.parse(storedUser)
    }
    
    const user: User = {
      id: 'demo-user-123',
      email: 'demo@example.com',
      name: 'Демо пользователь',
      avatar: undefined,
      createdAt: new Date().toISOString(),
    }
    
    localStorage.setItem('stub_user', JSON.stringify(user))
    return user
  },

  async logout(): Promise<{ success: boolean }> {
    console.log('[STUB] logout called')
    
    await new Promise(resolve => setTimeout(resolve, 200))
    localStorage.removeItem('stub_user')
    localStorage.removeItem('stub_token')
    
    return { success: true }
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    console.log('[STUB] updateProfile called:', userId, data)
    
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const storedUser = localStorage.getItem('stub_user')
    const user = storedUser ? JSON.parse(storedUser) : {
      id: userId,
      email: '',
      name: '',
      createdAt: new Date().toISOString(),
    }
    
    const updatedUser = { ...user, ...data }
    localStorage.setItem('stub_user', JSON.stringify(updatedUser))
    
    return updatedUser
  },
}