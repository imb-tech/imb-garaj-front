import { create } from "zustand"

type GlobalStore = {
  dataMap: Record<string, any>
  setData: <T = any>(key: string, value: T) => void
  getData: <T = any>(key: string) => T | undefined
  clearKey: (key: string) => void
  clearAll: () => void
}

export const useGlobalStore = create<GlobalStore>((set, get) => ({
  dataMap: {},

  setData: (key, value) =>
    set((state) => ({
      dataMap: {
        ...state.dataMap,
        [key]: value,
      },
    })),

  getData: (key) => get().dataMap[key],

  clearKey: (key) =>
    set((state) => {
      const { [key]: _, ...rest } = state.dataMap
      return { dataMap: rest }
    }),

  clearAll: () => set({ dataMap: {} }),
}))
