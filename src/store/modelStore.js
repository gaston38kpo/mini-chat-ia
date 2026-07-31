import { create } from "zustand";

const EMPTY_SELECTED_MODEL = { displayName: "", instanceId: "", key: "", lastResponseId: null };

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

export const useSelectedModel = () => useModelStore((state) => state.selectedModel);
export const useSetSelectedModel = () => useModelStore((state) => state.setSelectedModel);
export const useSetLastResponseId = () => useModelStore((state) => state.setLastResponseId);
