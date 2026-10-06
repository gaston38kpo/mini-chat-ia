import { useState } from "react";
import { notify } from "../helper/toast";
import useChatProvider from "./useChatProvider";
import { useModelStore } from "../store/modelStore";
import { EMPTY_SELECTED_MODEL } from "../constants/appConstants";
import {
    getUnloadingModelMessage,
    getUnloadedModelMessage,
    getUnloadModelErrorMessage
} from "../helper/toastMessages";

const useSelectedModel = () => {
    const { provider } = useChatProvider();
    const selectedModel = useModelStore((state) => state.selectedModel);
    const setSelectedModel = useModelStore((state) => state.setSelectedModel);
    const [isUnloading, setIsUnloading] = useState<boolean>(false);

    const onUnloadModel = async (): Promise<void> => {
        if (!provider?.capabilities.canManageModels) return;
        if (isUnloading || !selectedModel.instanceId) return;

        setIsUnloading(true);

        try {
            notify(getUnloadingModelMessage(selectedModel.displayName), "info");
            await provider.unloadModel(selectedModel.instanceId);
            notify(getUnloadedModelMessage(selectedModel.displayName), "success");
            setSelectedModel(EMPTY_SELECTED_MODEL);
        } catch (error) {
            console.error("Error unloading model", error);
            notify(getUnloadModelErrorMessage(selectedModel.displayName), "error");
        } finally {
            setIsUnloading(false);
        }
    };

    return {
        selectedModel,
        isUnloading,
        onUnloadModel
    };
};

export default useSelectedModel;
