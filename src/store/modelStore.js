import { create } from "zustand";

const EMPTY_MODEL = { display_name: "", instance_id: "", key: "", last_response_id: null };

export const useModelStore = create((set) => ({
    selectedModel: EMPTY_MODEL,
    setSelectedModel: (model) => set({ selectedModel: { ...EMPTY_MODEL, ...model } }),
    setLastResponseId: (last_response_id) => set((state) => ({
        selectedModel: {
            ...state.selectedModel,
            last_response_id: last_response_id
        }
    }))
}));
