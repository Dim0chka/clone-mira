import apiClient from './client'

import type { Board } from '@/types'
import type { CreateBoardData } from '@/types/board.types'

export const boardApi = {
  async getAll(): Promise<Board[]> {
    const { data } = await apiClient.get('/desks')
    return data.desks     // FastAPI returns {desks: [...], total: number}
  },

  async getById(boardId: string): Promise<Board> {
    const { data } = await apiClient.get(`/desks/${boardId}`)
    return data
  },

  async create(data: CreateBoardData): Promise<Board> {
    const { data: board } = await apiClient.post('/desks', {
      name: data.title,       // ⚠️ если FastAPI принимает другое поле — адаптируй
    })
    return board
  },

  async update(boardId: string, data: Partial<Board>): Promise<Board> {
    const { data: board } = await apiClient.patch(`/desks/${boardId}`, {
      name: data.title,
    })
    return board
  },

  async delete(boardId: string): Promise<{ success: boolean }> {
    await apiClient.delete(`/desks/${boardId}`)
    return { success: true }
  },

  async share(boardId: string, data: { userId: string }): Promise<any> {
    const { data: share } = await apiClient.post(`/desks/${boardId}/shares`, {
      user_id: data.userId,
    })
    return share
  },

  async unshare(boardId: string, userId: string): Promise<any> {
    await apiClient.delete(`/desks/${boardId}/shares/${userId}`)
    return { success: true }
  },
}