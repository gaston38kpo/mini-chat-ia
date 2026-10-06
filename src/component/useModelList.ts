import { useCallback, useEffect, useState } from "react";
import { notify } from "../helper/toast";
import useChatProvider from "./useChatProvider";
import { useModelStore } from "../store/modelStore";
import { getLoadedInstanceIds } from "../helper/modelHelper";
import type { ChatModel } from "../chat/providers/chatProvider.contract";
import { EMPTY_SELECTED_MODEL, type SelectedModel } from "../constants/appConstants";
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
    const { provider } = useChatProvider();
    const [models, setModels] = useState<ChatModel[]>([]);
    const [loadingKey, setLoadingKey] = useState<string | null>(null);
    const canManageModels = provider?.capabilities.canManageModels ?? false;

    const refreshModels = useCallback(async (): Promise<ChatModel[]> => {
        if (!provider) {
            setModels([]);
            return [];
        }

        const modelsList = await provider.listModels();

        setModels(modelsList);
        return modelsList;
    }, [provider]);

    /**
     * Desmonta las instancias cargadas: las que reporta la lista de modelos mas la
     * que el store sabe que quedo montada (por si el backend no la informa).
     * Best-effort: un id ya desmontado no debe romper el flujo.
     */
    const unloadInstances = useCallback(async (extraInstanceId?: string): Promise<void> => {
        if (!provider) return;

        const modelsList = await provider.listModels();
        const instanceIds = Array.from(new Set([
            ...getLoadedInstanceIds(modelsList),
            ...(extraInstanceId ? [extraInstanceId] : [])
        ]));

        if (!instanceIds.length) return;

        await Promise.allSettled(
            instanceIds.map((instanceId) => provider.unloadModel(instanceId))
        );

        await refreshModels();
    }, [provider, refreshModels]);

    const onClickModel = async (key: string, displayName: string): Promise<void> => {
        if (!provider) return;

        if (!canManageModels) {
            setSelectedModel({ displayName, instanceId: "", key });
            return;
        }

        setLoadingKey(key);

        try {
            notify(getLoadingModelMessage(displayName), "info");
            const trackedInstanceId = useModelStore.getState().selectedModel.instanceId;

            await unloadInstances(trackedInstanceId || undefined);

            const { instanceId } = await provider.loadModel(key);
            notify(getLoadedModelMessage(displayName), "success");
            setSelectedModel({ displayName, instanceId, key });
        } catch (error) {
            console.error("Error loading model", error);
            notify(getLoadModelErrorMessage(displayName), "error");
        } finally {
            setLoadingKey(null);
        }
    };

    useEffect(() => {
        setSelectedModel(EMPTY_SELECTED_MODEL);

        if (!provider) {
            setModels([]);
            return;
        }

        refreshModels().catch((error) => {
            console.error("Error fetching model list", error);
            notify(TOAST_MESSAGES.MODELS_FETCH_ERROR, "error");
        });

        return () => {
            unloadInstances();
        };
    }, [provider, refreshModels, unloadInstances, setSelectedModel]);

    return {
        models,
        loadingKey,
        canManageModels,
        onClickModel
    };
};

export default useModelList;
