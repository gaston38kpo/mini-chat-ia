import { create } from "zustand";

export const useModelStore = create((set) => ({
    selectedModel: {display_name: "", instance_id: "", key: "", last_response_id : null},
    setSelectedModel: (model) => set({ selectedModel: model }),
    setLastResponseId: (last_response_id) => set((state) => ({
        selectedModel: {
            ...state.selectedModel,
            last_response_id: last_response_id
        }
    }))
}));
