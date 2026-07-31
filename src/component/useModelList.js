import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getModelsList, loadModel, unloadModel } from "../service/service";
import { getLoadedInstanceIds, normalizeModels } from "../helper/modelHelper";
import { logError } from "../helper/logger";

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
            toast.info(`Cargando modelo: ${displayName}`);
            await unloadAllLoadedInstances();

            const { instanceId } = await loadModel(key);
            toast.success(`Modelo cargado: ${displayName}`);
            setSelectedModel({ displayName, instanceId, key });
        } catch (error) {
            logError("Error loading model", error);
            toast.error(`No se pudo cargar el modelo: ${displayName}`);
        } finally {
            setLoadingKey(null);
        }
    };

    useEffect(() => {
        refreshModels().catch((error) => {
            logError("Error fetching model list", error);
            toast.error("No se pudo obtener la lista de modelos");
        });
    }, []);

    return {
        models,
        loadingKey,
        onClickModel
    };
};

export default useModelList;
