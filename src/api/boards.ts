import type { Board, Sticker } from '@/types'
import type { CreateBoardData, UpdateStickerData } from '@/types/board.types'

// Создаем заглушку для хранения данных в localStorage
const getStubBoards = (): Board[] => {
  const stored = localStorage.getItem('stub_boards')
  if (stored) {
    return JSON.parse(stored)
  }
  
  // Начальные тестовые данные
  const initialBoards: Board[] = [
    {
      id: 'board-1',
      title: 'Добро пожаловать!',
      description: 'Первая тестовая доска',
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
          content: '🎉 Добро пожаловать в Miro Clone!\n\nЭто демо-версия приложения.',
          color: '#fff9c4',
          x: 100,
          y: 100,
          width: 300,
          height: 200,
          zIndex: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'sticker-2',
          boardId: 'board-1',
          userId: 'demo-user-123',
          content: '🔄 Перетаскивайте стикеры',
          color: '#c8e6c9',
          x: 450,
          y: 150,
          width: 250,
          height: 180,
          zIndex: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'sticker-3',
          boardId: 'board-1',
          userId: 'demo-user-123',
          content: '🎨 Меняйте цвет и размер',
          color: '#bbdefb',
          x: 150,
          y: 350,
          width: 280,
          height: 170,
          zIndex: 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      sharedWith: [],
    },
    {
      id: 'board-2',
      title: 'План проекта',
      description: 'Планирование задач и идей',
      ownerId: 'demo-user-123',
      isPublic: false,
      backgroundColor: '#f8f9fa',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stickers: [
        {
          id: 'sticker-4',
          boardId: 'board-2',
          userId: 'demo-user-123',
          content: '📋 Основные задачи\n\n✅ Регистрация\n✅ Редактор доски\n🔄 Совместный доступ\n⚙️ Настройки',
          color: '#ffebee',
          x: 50,
          y: 50,
          width: 320,
          height: 250,
          zIndex: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      sharedWith: ['user-2'],
    },
    {
      id: 'board-3',
      title: 'Мозговой штурм',
      description: 'Сбор идей и мыслей',
      ownerId: 'demo-user-123',
      isPublic: true,
      backgroundColor: '#e8f5e9',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stickers: [
        {
          id: 'sticker-5',
          boardId: 'board-3',
          userId: 'demo-user-123',
          content: '💡 Идея 1\nНовая функция',
          color: '#e1bee7',
          x: 100,
          y: 100,
          width: 200,
          height: 150,
          zIndex: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'sticker-6',
          boardId: 'board-3',
          userId: 'demo-user-123',
          content: '💡 Идея 2\nУлучшение UI',
          color: '#ffccbc',
          x: 350,
          y: 120,
          width: 200,
          height: 150,
          zIndex: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      sharedWith: [],
    },
  ]
  
  localStorage.setItem('stub_boards', JSON.stringify(initialBoards))
  return initialBoards
}

const saveStubBoards = (boards: Board[]) => {
  localStorage.setItem('stub_boards', JSON.stringify(boards))
}

export const boardApi = {
  async getAll(): Promise<Board[]> {
    console.log('[STUB] getAll boards')
    await new Promise(resolve => setTimeout(resolve, 300))
    return getStubBoards()
  },

  async getById(boardId: string): Promise<Board> {
    console.log('[STUB] get board:', boardId)
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const boards = getStubBoards()
    const board = boards.find(b => b.id === boardId)
    
    if (!board) {
      // Если доска не найдена, создаем новую
      const newBoard: Board = {
        id: boardId,
        title: 'Новая доска',
        description: '',
        ownerId: 'demo-user-123',
        isPublic: false,
        backgroundColor: '#ffffff',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stickers: [
          {
            id: 'sticker-' + Date.now(),
            boardId,
            userId: 'demo-user-123',
            content: 'Добавьте свои заметки здесь!',
            color: '#fff9c4',
            x: 100,
            y: 100,
            width: 250,
            height: 180,
            zIndex: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ],
        sharedWith: [],
      }
      
      boards.push(newBoard)
      saveStubBoards(boards)
      return newBoard
    }
    
    return board
  },

  async create(data: CreateBoardData): Promise<Board> {
    console.log('[STUB] create board:', data)
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const boards = getStubBoards()
    const newBoard: Board = {
      id: 'board-' + Date.now(),
      ...data,
      ownerId: 'demo-user-123',
      stickers: [],
      sharedWith: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    boards.push(newBoard)
    saveStubBoards(boards)
    return newBoard
  },

  async update(boardId: string, data: Partial<Board>): Promise<Board> {
    console.log('[STUB] update board:', boardId, data)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const boards = getStubBoards()
    const index = boards.findIndex(b => b.id === boardId)
    
    if (index === -1) {
      throw new Error('Доска не найдена')
    }
    
    const updatedBoard = {
      ...boards[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    
    boards[index] = updatedBoard
    saveStubBoards(boards)
    return updatedBoard
  },

  async delete(boardId: string): Promise<{ success: boolean }> {
    console.log('[STUB] delete board:', boardId)
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const boards = getStubBoards()
    const filteredBoards = boards.filter(b => b.id !== boardId)
    saveStubBoards(filteredBoards)
    
    return { success: true }
  },

  async share(boardId: string, data: { userId: string; permission: 'view' | 'edit' }): Promise<Board> {
    console.log('[STUB] share board:', boardId, data)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const boards = getStubBoards()
    const board = boards.find(b => b.id === boardId)
    
    if (!board) {
      throw new Error('Доска не найдена')
    }
    
    if (!board.sharedWith.includes(data.userId)) {
      board.sharedWith.push(data.userId)
      board.updatedAt = new Date().toISOString()
      saveStubBoards(boards)
    }
    
    return board
  },

  async unshare(boardId: string, userId: string): Promise<Board> {
    console.log('[STUB] unshare board:', boardId, userId)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const boards = getStubBoards()
    const board = boards.find(b => b.id === boardId)
    
    if (!board) {
      throw new Error('Доска не найдена')
    }
    
    board.sharedWith = board.sharedWith.filter(id => id !== userId)
    board.updatedAt = new Date().toISOString()
    saveStubBoards(boards)
    
    return board
  },
}

export const stickerApi = {
  async create(data: {
    boardId: string
    content?: string
    color?: string
    x: number
    y: number
    width?: number
    height?: number
  }): Promise<Sticker> {
    console.log('[STUB] create sticker:', data)
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const boards = getStubBoards()
    const board = boards.find(b => b.id === data.boardId)
    
    if (!board) {
      throw new Error('Доска не найдена')
    }
    
    const newSticker: Sticker = {
      id: 'sticker-' + Date.now(),
      boardId: data.boardId,
      userId: 'demo-user-123',
      content: data.content || 'Новый стикер',
      color: data.color || '#fff9c4',
      x: data.x,
      y: data.y,
      width: data.width || 200,
      height: data.height || 150,
      zIndex: (board.stickers.length > 0 ? 
        Math.max(...board.stickers.map(s => s.zIndex)) : 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    board.stickers.push(newSticker)
    board.updatedAt = new Date().toISOString()
    saveStubBoards(boards)
    
    return newSticker
  },

  async update(stickerId: string, data: UpdateStickerData): Promise<Sticker> {
    console.log('[STUB] update sticker:', stickerId, data)
    await new Promise(resolve => setTimeout(resolve, 150))
    
    const boards = getStubBoards()
    
    for (const board of boards) {
      const stickerIndex = board.stickers.findIndex(s => s.id === stickerId)
      if (stickerIndex !== -1) {
        const updatedSticker = {
          ...board.stickers[stickerIndex],
          ...data,
          updatedAt: new Date().toISOString(),
        }
        
        board.stickers[stickerIndex] = updatedSticker
        board.updatedAt = new Date().toISOString()
        saveStubBoards(boards)
        
        return updatedSticker
      }
    }
    
    throw new Error('Стикер не найден')
  },

  async delete(stickerId: string): Promise<{ success: boolean }> {
    console.log('[STUB] delete sticker:', stickerId)
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const boards = getStubBoards()
    
    for (const board of boards) {
      const stickerIndex = board.stickers.findIndex(s => s.id === stickerId)
      if (stickerIndex !== -1) {
        board.stickers.splice(stickerIndex, 1)
        board.updatedAt = new Date().toISOString()
        saveStubBoards(boards)
        return { success: true }
      }
    }
    
    return { success: false }
  },

  async batchUpdate(stickers: Array<{ id: string; updates: Partial<Sticker> }>) {
    console.log('[STUB] batch update stickers:', stickers)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const boards = getStubBoards()
    
    for (const { id, updates } of stickers) {
      for (const board of boards) {
        const stickerIndex = board.stickers.findIndex(s => s.id === id)
        if (stickerIndex !== -1) {
          board.stickers[stickerIndex] = {
            ...board.stickers[stickerIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
          }
        }
      }
    }
    
    saveStubBoards(boards)
    return { success: true }
  },
}