export interface StickerData {
  id: string
  boardId: string
  userId: string
  content: string
  color: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  createdAt: string
  updatedAt: string
}

export type PartialStickerData = Partial<StickerData>