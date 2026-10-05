import { useEffect, useState } from "react";
import { message } from "antd";
import { chatProvider } from "../chat/providers";
import { getLoadedInstanceIds } from "../helper/modelHelper";
import {
    TOAST_MESSAGES,
    getLoadedModelMessage,
    getLoadingModelMessage,
    getLoadModelErrorMessage
} from "../helper/toastMessages";

const useModelList = ({ setSelectedModel }) => {
    const [models, setModels] = useState([]);
    const [loadingKey, setLoadingKey] = useState(null);
    const canManageModels = chatProvider.capabilities.canManageModels;

    const refreshModels = async () => {
        const modelsList = await chatProvider.listModels();

        setModels(modelsList);
        return modelsList;
    };

    const unloadAllLoadedInstances = async () => {
        const modelsList = await refreshModels();
        const loadedInstanceIds = getLoadedInstanceIds(modelsList);

        if (!loadedInstanceIds.length) return;

        await Promise.all(
            loadedInstanceIds.map((instanceId) => chatProvider.unloadModel(instanceId))
        );

        await refreshModels();
    };

    const onClickModel = async (key, displayName) => {
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
            unloadAllLoadedInstances()
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
