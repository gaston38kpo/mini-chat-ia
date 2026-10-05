import { create } from "zustand";
import { EMPTY_SELECTED_MODEL, type SelectedModel } from "../constants/appConstants";

interface ModelStoreState {
    selectedModel: SelectedModel;
    setSelectedModel: (selectedModelDetails: Partial<SelectedModel>) => void;
    setLastResponseId: (lastResponseId: string | null) => void;
}

export const useModelStore = create<ModelStoreState>()((set) => ({
    selectedModel: EMPTY_SELECTED_MODEL,
    setSelectedModel: (selectedModelDetails) => set({
        selectedModel: {
            ...EMPTY_SELECTED_MODEL,
            ...selectedModelDetails
        }
    }),
    setLastResponseId: (lastResponseId) => set((state) => ({
        selectedModel: {
            ...state.selectedModel,
            lastResponseId
        }
    }))
}));
