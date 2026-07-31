import React, { useEffect, useState } from "react";
import { getModelsList, loadModel, unloadModel } from "../service/service";
import { useModelStore } from "../store/modelStore";
import { toast } from "sonner";
import { getLoadedInstanceIds, normalizeModels } from "../helper/modelHelper";

const ModelList = () => {
    const setSelectedModel = useModelStore((state) => state.setSelectedModel);
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

    const onClickModel = async (key, display_name) => {
        setLoadingKey(key);

        try {
            toast.info(`Cargando modelo: ${display_name}`);
            await unloadAllLoadedInstances();

            const { instance_id } = await loadModel(key);
            toast.success(`Modelo cargado: ${display_name}`);
            setSelectedModel({ display_name, instance_id, key });
        } catch (error) {
            console.error("Error loading model", error);
            toast.error(`No se pudo cargar el modelo: ${display_name}`);
        } finally {
            setLoadingKey(null);
        }
    };

    useEffect(() => {
        refreshModels().catch((error) => {
            console.error("Error fetching model list", error);
            toast.error("No se pudo obtener la lista de modelos");
        });
    }, []);

    return (
        <>
        <h1>Elegi un modelo y cargalo</h1>
            <ul>
                {models.map((model) => (
                    <li key={model.key}>
                        <button
                            disabled={loadingKey !== null}
                            onClick={() => onClickModel(model.key, model.display_name)}
                        >
                            {model.display_name}
                        </button>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default ModelList;
