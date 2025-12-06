export type ActiveTool = 'select' | 'sticker' | 'text' | 'shape'

export interface Tool {
  id: ActiveTool
  icon: string
  title: string
}

export type Permission = 'view' | 'edit'