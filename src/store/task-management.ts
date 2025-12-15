import { create } from 'zustand';


type TaskState = {
    task: QuoteCard | null;
    setTask: (user: QuoteCard) => void;
    clearTask: () => void;
};

export const useTaskStore = create<TaskState>((set) => ({
    task: null,
    setTask: (task) => set({ task }),
    clearTask: () => set({ task: null }),
}));
