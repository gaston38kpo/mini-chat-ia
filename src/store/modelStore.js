import { create } from "zustand";

export const useModelStore = create((set) => ({
    selectedModel: {display_name: "", instance_id: ""},
    setSelectedModel: (model) => set({ selectedModel: model }),
}));
