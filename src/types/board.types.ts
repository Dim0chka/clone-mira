export interface CreateBoardData {
  title: string
  description?: string
  isPublic: boolean
  backgroundColor?: string
}

export interface UpdateBoardData extends Partial<CreateBoardData> {
  id: string
}

export interface CreateStickerData {
  boardId: string
  content?: string
  color?: string
  x: number
  y: number
  width?: number
  height?: number
}

export interface UpdateStickerData {
  id: string
  content?: string
  color?: string
  x?: number
  y?: number
  width?: number
  height?: number
  zIndex?: number
}

export interface BoardFilter {
  search?: string
  isPublic?: boolean
  ownedOnly?: boolean
  sharedOnly?: boolean
}