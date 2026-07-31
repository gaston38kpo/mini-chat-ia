import { create } from "zustand";
import { EMPTY_SELECTED_MODEL } from "../constants/appConstants";

export const useModelStore = create((set) => ({
    selectedModel: EMPTY_SELECTED_MODEL,
    setSelectedModel: (model) => set({ selectedModel: { ...EMPTY_SELECTED_MODEL, ...model } }),
    setLastResponseId: (lastResponseId) => set((state) => ({
        selectedModel: {
            ...state.selectedModel,
            lastResponseId
        }
    }))
}));
