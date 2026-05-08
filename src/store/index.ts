import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, ToastMessage } from '@/types'
import { generateId } from '@/lib/utils'

interface AppState {
  // 用户
  user: User | null
  setUser: (user: User | null) => void

  // 主题
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void

  // Toast 通知
  toasts: ToastMessage[]
  addToast: (msg: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void

  // WebGL 是否启用
  webglEnabled: boolean
  setWebglEnabled: (enabled: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),

      theme: 'dark',
      setTheme: (theme) => set({ theme }),

      toasts: [],
      addToast: (msg) =>
        set((state) => ({
          toasts: [...state.toasts, { id: generateId(), ...msg }],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      webglEnabled: true,
      setWebglEnabled: (enabled) => set({ webglEnabled: enabled }),
    }),
    {
      name: 'ai-design-studio-app',
      partialize: (state) => ({
        theme: state.theme,
        webglEnabled: state.webglEnabled,
      }),
    }
  )
)
