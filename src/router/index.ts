import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'

const router = createRouter({
  history: createWebHistory('http://localhost:3000/'),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
    //   meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
    //   meta: { requiresGuest: false },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
    //   meta: { requiresAuth: false },
    },
    {
      path: '/board/:id',
      name: 'board',
      component: () => import('@/views/BoardEditor.vue'),
    //   meta: { requiresAuth: true },
    },
    {
      path: '/shared/:id',
      name: 'shared-board',
      component: () => import('@/views/BoardEditor.vue'),
    //   meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

// Навигационные хуки
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Инициализация аутентификации если нужно
  if (!authStore.user && authStore.token) {
    try {
      await authStore.fetchUser()
    } catch {
      authStore.logout()
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router