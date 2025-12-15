import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ParamsStore {
    params: string
    setParam: (value: string) => void
}

export const useParmasValue = create<ParamsStore>()(
    persist(
        (set) => ({
            params: '',
            setParam: (value: string) => set({ params: value }),
        }),
        {
            name: "params-store",
        }
    )
)
