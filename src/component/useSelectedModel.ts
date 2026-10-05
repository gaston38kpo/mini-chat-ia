import { useState } from "react";
import { message } from "antd";
import { chatProvider } from "../chat/providers";
import { useModelStore } from "../store/modelStore";
import { EMPTY_SELECTED_MODEL } from "../constants/appConstants";
import {
    getUnloadingModelMessage,
    getUnloadedModelMessage,
    getUnloadModelErrorMessage
} from "../helper/toastMessages";

const useSelectedModel = () => {
    const selectedModel = useModelStore((state) => state.selectedModel);
    const setSelectedModel = useModelStore((state) => state.setSelectedModel);
    const [isUnloading, setIsUnloading] = useState<boolean>(false);

    const onUnloadModel = async (): Promise<void> => {
        if (!chatProvider.capabilities.canManageModels) return;
        if (isUnloading || !selectedModel.instanceId) return;

        setIsUnloading(true);

        try {
            message.info(getUnloadingModelMessage(selectedModel.displayName));
            await chatProvider.unloadModel(selectedModel.instanceId);
            message.success(getUnloadedModelMessage(selectedModel.displayName));
            setSelectedModel(EMPTY_SELECTED_MODEL);
        } catch (error) {
            console.error("Error unloading model", error);
            message.error(getUnloadModelErrorMessage(selectedModel.displayName));
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
