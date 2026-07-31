import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getModelsList, loadModel, unloadModel } from "../service/service";
import { getLoadedInstanceIds, normalizeModels } from "../helper/modelHelper";
import {
    TOAST_MESSAGES,
    getLoadedModelMessage,
    getLoadingModelMessage,
    getLoadModelErrorMessage
} from "../helper/toastMessages";

const useModelList = ({ setSelectedModel }) => {
    const [models, setModels] = useState([]);
    const [loadingKey, setLoadingKey] = useState(null);

    const refreshModels = async () => {
        const response = await getModelsList();
        const modelsList = normalizeModels(response);

        setModels(modelsList);
        return modelsList;
    };

    const unloadAllLoadedInstances = async () => {
        const modelsList = await refreshModels();
        const loadedInstanceIds = getLoadedInstanceIds(modelsList);

        if (!loadedInstanceIds.length) return;

        await Promise.all(
            loadedInstanceIds.map((instanceId) => unloadModel(instanceId))
        );

        await refreshModels();
    };

    const onClickModel = async (key, displayName) => {
        setLoadingKey(key);

        try {
            toast.info(getLoadingModelMessage(displayName));
            await unloadAllLoadedInstances();

            const { instanceId } = await loadModel(key);
            toast.success(getLoadedModelMessage(displayName));
            setSelectedModel({ displayName, instanceId, key });
        } catch (error) {
            console.error("Error loading model", error);
            toast.error(getLoadModelErrorMessage(displayName));
        } finally {
            setLoadingKey(null);
        }
    };

    useEffect(() => {
        refreshModels().catch((error) => {
            console.error("Error fetching model list", error);
            toast.error(TOAST_MESSAGES.MODELS_FETCH_ERROR);
        });
    }, []);

    return {
        models,
        loadingKey,
        onClickModel
    };
};

export default useModelList;
