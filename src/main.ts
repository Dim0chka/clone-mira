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

// Инициализируем демо-данные в localStorage если их нет
const initDemoData = () => {
  if (!localStorage.getItem('stub_boards')) {
    const demoBoards = [
      {
        id: 'board-1',
        title: 'Демо доска',
        description: 'Тестовая доска для демонстрации',
        ownerId: 'demo-user-123',
        isPublic: true,
        backgroundColor: '#ffffff',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stickers: [
          {
            id: 'sticker-1',
            boardId: 'board-1',
            userId: 'demo-user-123',
            content: 'Привет! Это демо-стикер.\n\nПеретаскивайте меня и меняйте размер!',
            color: '#fff9c4',
            x: 100,
            y: 100,
            width: 250,
            height: 180,
            zIndex: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'sticker-2',
            boardId: 'board-1',
            userId: 'demo-user-123',
            content: 'Дважды кликните чтобы редактировать текст',
            color: '#c8e6c9',
            x: 400,
            y: 200,
            width: 220,
            height: 160,
            zIndex: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        sharedWith: [],
      },
    ]
    
    localStorage.setItem('stub_boards', JSON.stringify(demoBoards))
  }
  
  if (!localStorage.getItem('stub_user')) {
    const demoUser = {
      id: 'demo-user-123',
      email: 'demo@example.com',
      name: 'Демо пользователь',
      avatar: undefined,
      createdAt: new Date().toISOString(),
    }
    
    localStorage.setItem('stub_user', JSON.stringify(demoUser))
    localStorage.setItem('stub_token', 'demo-token')
  }
}

initDemoData()

app.mount('#app')