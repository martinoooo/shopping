import { create } from 'zustand'

export type ToastTone = 'default' | 'success' | 'error'

export interface Toast {
  id: string
  title: string
  description?: string
  tone: ToastTone
}

interface UIState {
  toasts: Toast[]
  searchOpen: boolean
  pushToast: (toast: Omit<Toast, 'id'>) => string
  dismissToast: (id: string) => void
  openSearch: () => void
  closeSearch: () => void
}

let toastCounter = 0

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  searchOpen: false,
  pushToast: (toast) => {
    toastCounter += 1
    const id = `toast-${toastCounter}`
    set((state) => ({ toasts: [...state.toasts.slice(-2), { ...toast, id }] }))
    return id
  },
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
}))

export const useToast = () => useUIStore((state) => state.pushToast)
