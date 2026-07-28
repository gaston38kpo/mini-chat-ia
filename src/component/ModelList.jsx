import React, { useEffect, useState } from "react";
import { getModelsList, loadModel, unloadModel } from "../service/service";
import { useModelStore } from "../store/modelStore";
import { Toaster, toast } from 'sonner';

const ModelList = () => {
    const { selectedModel, setSelectedModel } = useModelStore();
    const [models, setModels] = useState([]);

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
        console.log({ response });
        const modelsList = normalizeModels(response);
        console.log({ modelsList });
        setModels(modelsList);
        return modelsList;
    };

    const unloadAllLoadedInstances = async () => {
        const modelsList = await refreshModels();
        const loadedInstanceIds = getLoadedInstanceIds(modelsList);
        console.log(`Loaded instance IDs: ${loadedInstanceIds.join(", ")}`);

        if (!loadedInstanceIds.length) return;

        await Promise.all(
            loadedInstanceIds.map(instanceId => unloadModel(instanceId))
        );

        await refreshModels();
    };

    const onClickModel = async (key, display_name) => {
        toast(`Cargando modelo: ${display_name}`, { type: 'info' });
        await unloadAllLoadedInstances();

        if (selectedModel?.instance_id) {
            console.log(`Unloading model with instance_id: ${selectedModel.instance_id}`);
            unloadModel(selectedModel.instance_id);
        }

        const { instance_id } = await loadModel(key);
        console.log({ key, display_name, instance_id });
        toast(`Modelo cargado: ${display_name}`, { type: 'success' });
        setSelectedModel({ display_name, instance_id, key });
    };

    useEffect(() => { refreshModels() }, []);

    return (
        <>
        <h1>Elegi un modelo y cargalo</h1>
            <ul>
                {models && models.map((model) => (
                    <li key={model.key}>
                        <button onClick={() => onClickModel(model.key, model.display_name)}>
                            {model.display_name}
                        </button>
                    </li>
                ))}
            </ul>

        <Toaster richColors position="top" />
        </>
    );
};

export default ModelList;
