import { create } from 'zustand'
import type { GenerationStatus, GeneratedItem, StyleParams, UploadedImage, HistoryItem } from '@/types'
import { generateId, fileToDataUrl } from '@/lib/utils'

interface StudioStore {
  // 输入状态
  prompt: string
  setPrompt: (prompt: string) => void

  uploadedImages: UploadedImage[]
  addImage: (file: File) => Promise<void>
  removeImage: (id: string) => void

  // 生成状态
  generationStatus: GenerationStatus
  progressMessage: string
  results: GeneratedItem[]
  selectedResultId: string | null
  selectResult: (id: string | null) => void

  // 样式参数
  styleParams: StyleParams
  updateStyleParams: (params: Partial<StyleParams>) => void

  // 历史记录
  history: HistoryItem[]

  // 动作
  generate: () => Promise<void>
  cancelGeneration: () => void
  clearResults: () => void
}

const DEFAULT_STYLE_PARAMS: StyleParams = {
  style: 'realistic',
  quality: 'standard',
  format: 'square',
  colorTone: 'auto',
  strength: 60,
}

export const useStudioStore = create<StudioStore>((set, get) => ({
  prompt: '',
  setPrompt: (prompt) => set({ prompt }),

  uploadedImages: [],
  addImage: async (file) => {
    const previewUrl = await fileToDataUrl(file)
    const image: UploadedImage = {
      id: generateId(),
      file,
      previewUrl,
      role: 'reference',
    }
    set((state) => ({ uploadedImages: [...state.uploadedImages, image] }))
  },
  removeImage: (id) =>
    set((state) => ({
      uploadedImages: state.uploadedImages.filter((img) => img.id !== id),
    })),

  generationStatus: 'idle',
  progressMessage: '',
  results: [],
  selectedResultId: null,
  selectResult: (id) => set({ selectedResultId: id }),

  styleParams: DEFAULT_STYLE_PARAMS,
  updateStyleParams: (params) =>
    set((state) => ({
      styleParams: { ...state.styleParams, ...params },
    })),

  history: [],

  generate: async () => {
    const { prompt } = get()
    if (!prompt.trim()) return

    // 模拟 AI 生成流程（后续对接真实 API）
    set({ generationStatus: 'thinking', results: [], selectedResultId: null })

    await new Promise((r) => setTimeout(r, 1200))
    set({ progressMessage: 'Analyzing design intent...' })

    await new Promise((r) => setTimeout(r, 1000))
    set({ generationStatus: 'generating', progressMessage: 'Generating visuals...' })

    await new Promise((r) => setTimeout(r, 2000))
    set({ progressMessage: 'Refining details...' })

    await new Promise((r) => setTimeout(r, 800))

    // 生成 mock 结果（使用 picsum 占位图）
    const mockResults: GeneratedItem[] = Array.from({ length: 4 }, (_, i) => ({
      id: generateId(),
      url: `https://picsum.photos/seed/${Date.now() + i}/800/800`,
      prompt: get().prompt,
      createdAt: Date.now(),
      width: 800,
      height: 800,
      seed: Math.floor(Math.random() * 99999),
    }))

    const historyItem: HistoryItem = {
      id: generateId(),
      prompt: get().prompt,
      thumbnail: mockResults[0].url,
      results: mockResults,
      createdAt: Date.now(),
    }

    set((state) => ({
      generationStatus: 'done',
      results: mockResults,
      selectedResultId: mockResults[0].id,
      progressMessage: '',
      history: [historyItem, ...state.history].slice(0, 50),
    }))
  },

  cancelGeneration: () => {
    set({ generationStatus: 'idle', progressMessage: '' })
  },

  clearResults: () => {
    set({ results: [], selectedResultId: null, generationStatus: 'idle' })
  },
}))
