import { useEffect, useState } from "react";
import { message } from "antd";
import { chatProvider } from "../chat/providers";
import { getLoadedInstanceIds } from "../helper/modelHelper";
import type { ChatModel } from "../chat/providers/chatProvider.contract";
import type { SelectedModel } from "../constants/appConstants";
import {
    TOAST_MESSAGES,
    getLoadedModelMessage,
    getLoadingModelMessage,
    getLoadModelErrorMessage
} from "../helper/toastMessages";

interface UseModelListParams {
    setSelectedModel: (selectedModelDetails: Partial<SelectedModel>) => void;
}

const useModelList = ({ setSelectedModel }: UseModelListParams) => {
    const [models, setModels] = useState<ChatModel[]>([]);
    const [loadingKey, setLoadingKey] = useState<string | null>(null);
    const canManageModels = chatProvider.capabilities.canManageModels;

    const refreshModels = async (): Promise<ChatModel[]> => {
        const modelsList = await chatProvider.listModels();

        setModels(modelsList);
        return modelsList;
    };

    const unloadAllLoadedInstances = async (): Promise<void> => {
        const modelsList = await refreshModels();
        const loadedInstanceIds = getLoadedInstanceIds(modelsList);

        if (!loadedInstanceIds.length) return;

        await Promise.all(
            loadedInstanceIds.map((instanceId) => chatProvider.unloadModel(instanceId))
        );

        await refreshModels();
    };

    const onClickModel = async (key: string, displayName: string): Promise<void> => {
        if (!canManageModels) {
            setSelectedModel({ displayName, instanceId: "", key });
            return;
        }

        setLoadingKey(key);

        try {
            message.info(getLoadingModelMessage(displayName));
            await unloadAllLoadedInstances();

            const { instanceId } = await chatProvider.loadModel(key);
            message.success(getLoadedModelMessage(displayName));
            setSelectedModel({ displayName, instanceId, key });
        } catch (error) {
            console.error("Error loading model", error);
            message.error(getLoadModelErrorMessage(displayName));
        } finally {
            setLoadingKey(null);
        }
    };

    useEffect(() => {
        refreshModels().catch((error) => {
            console.error("Error fetching model list", error);
            message.error(TOAST_MESSAGES.MODELS_FETCH_ERROR);
        });

        return () => {
            unloadAllLoadedInstances();
        };
    }, []);

    return {
        models,
        loadingKey,
        canManageModels,
        onClickModel
    };
};

export default useModelList;
