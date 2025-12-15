import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ToggleStore {
    isVisible: boolean
    toggle: () => void
    setVisible: (value: boolean) => void
}

export const useToggleStore = create<ToggleStore>()(
    persist(
        (set) => ({
            isVisible: false,

            toggle: () => set((state) => ({ isVisible: !state.isVisible })),

            setVisible: (value: boolean) => set({ isVisible: value }),
        }),
        {
            name: "toggle-store",
        }
    )
)
