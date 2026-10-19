import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistState {
  ids: string[]
  toggle: (productId: string) => boolean
  remove: (productId: string) => void
  clear: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        const saved = get().ids.includes(productId)
        set((state) => ({
          ids: saved ? state.ids.filter((id) => id !== productId) : [...state.ids, productId],
        }))
        return !saved
      },
      remove: (productId) =>
        set((state) => ({ ids: state.ids.filter((id) => id !== productId) })),
      clear: () => set({ ids: [] }),
    }),
    { name: 'ember-oak-wishlist-v1' },
  ),
)

export function useWishlistCount(): number {
  return useWishlistStore((state) => state.ids.length)
}
