export const stickerColors = [
  '#fff9c4', // Светло-желтый
  '#c8e6c9', // Светло-зеленый
  '#bbdefb', // Светло-голубой
  '#e1bee7', // Светло-фиолетовый
  '#ffccbc', // Светло-оранжевый
  '#f8bbd0', // Светло-розовый
  '#d7ccc8', // Светло-коричневый
  '#f5f5f5', // Светло-серый
  '#ffebee', // Светло-красный
  '#e8f5e9', // Светло-зеленый 2
  '#e3f2fd', // Светло-голубой 2
  '#f3e5f5', // Светло-фиолетовый 2
]

export const getRandomColor = (): string => {
  return stickerColors[Math.floor(Math.random() * stickerColors.length)]
}

export const getContrastColor = (hexColor: string): string => {
  const rgb = hexToRgb(hexColor)
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}

export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}