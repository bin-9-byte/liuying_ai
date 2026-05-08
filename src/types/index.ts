// ── Generation Types ──
export type GenerationStatus = 'idle' | 'thinking' | 'generating' | 'done' | 'error'

export interface GeneratedItem {
  id: string
  url: string
  prompt: string
  createdAt: number
  width: number
  height: number
  seed?: number
}

export interface StyleParams {
  style: 'realistic' | 'illustration' | 'abstract' | 'minimal' | 'cinematic'
  quality: 'draft' | 'standard' | 'hd'
  format: 'square' | 'landscape' | 'portrait' | 'banner' | 'thumbnail'
  colorTone: 'auto' | 'warm' | 'cool' | 'monochrome' | 'vibrant'
  strength: number  // 0–100, image reference influence
}

export interface UploadedImage {
  id: string
  file: File
  previewUrl: string
  role: 'reference' | 'subject' | 'style'
}

// ── User Types ──
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: 'free' | 'pro' | 'enterprise'
  credits: number
}

// ── UI Types ──
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  description?: string
}

export interface HistoryItem {
  id: string
  prompt: string
  thumbnail: string
  results: GeneratedItem[]
  createdAt: number
}
