import apiClient from './client'
import type { Sticker } from '@/types'
import type { UpdateStickerData } from '@/types/board.types'

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
        const { data: sticker } = await apiClient.post(
            `/desks/${data.boardId}/stickers`,
            data
        )
        return sticker
    },

    async update(stickerId: string, data: UpdateStickerData): Promise<Sticker> {
        const { data: sticker } = await apiClient.patch(
            `/stickers/${stickerId}`,
            data
        )
        return sticker
    },

    async delete(stickerId: string): Promise<{ success: boolean }> {
        await apiClient.delete(`/stickers/${stickerId}`)
        return { success: true }
    },

}