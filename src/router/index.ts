import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth.store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/board/:id',
      name: 'board',
      component: () => import('@/views/BoardEditor.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/shared/:id',
      name: 'shared-board',
      component: () => import('@/views/BoardEditor.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Проверяем токен в localStorage
  const hasToken = !!localStorage.getItem('access_token')

  if (to.meta.requiresAuth && !hasToken) {
    // Требуется авторизация, но нет токена
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresGuest && hasToken) {
    // Страница для гостей, но пользователь авторизован
    next('/dashboard')
  } else {
    next()
  }
})

export default router