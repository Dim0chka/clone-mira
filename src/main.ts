import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'

// Глобальные стили
import './assets/styles/main.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Инициализация auth state при загрузке
import { useAuthStore } from '@/store/auth.store'

router.isReady().then(() => {
  const authStore = useAuthStore()
  authStore.initAuth()
})

app.mount('#app')