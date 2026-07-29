import React, { useEffect, useState } from "react";
import { getModelsList, loadModel, unloadModel } from "../service/service";
import { useModelStore } from "../store/modelStore";
import { toast } from 'sonner';

const ModelList = () => {
    const setSelectedModel = useModelStore((state) => state.setSelectedModel);
    const [models, setModels] = useState([]);
    const [loadingKey, setLoadingKey] = useState(null);

    const normalizeModels = (response) => {
        const seen = new Map();
        for (const model of response.models) {
            seen.set(model.key, model);
        }
        return Array.from(seen.values());
    };

    const getLoadedInstanceIds = (models) => {
        return [...new Set(
            models.flatMap((model) =>
            Array.isArray(model.loaded_instances)
                ? model.loaded_instances.map(instance => instance.id).filter(Boolean)
                : []
            )
        )];
    };

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
            loadedInstanceIds.map(instanceId => unloadModel(instanceId))
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
        } catch {
            toast.error(`No se pudo cargar el modelo: ${display_name}`);
        } finally {
            setLoadingKey(null);
        }
    };

    useEffect(() => {
        refreshModels().catch(() => toast.error("No se pudo obtener la lista de modelos"));
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
