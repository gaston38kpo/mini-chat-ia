import React, { useEffect, useState } from "react";
import { getModelsList, loadModel, unloadModel } from "../service/service";
import { useModelStore } from "../store/modelStore";

const ModelList = () => {
    const { selectedModel, setSelectedModel } = useModelStore();
    const [models, setModels] = useState([]);

    const normalizeModels = (response) => {
        return Array.isArray(response) ? response : (response?.models ?? []);
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
        console.log(`Loaded instance IDs: ${loadedInstanceIds.join(", ")}`);

        if (!loadedInstanceIds.length) return;

        await Promise.all(
            loadedInstanceIds.map(instanceId => unloadModel(instanceId))
        );

        await refreshModels();
    };

    const onClickModel = async (key, display_name) => {
        await unloadAllLoadedInstances();

        if (selectedModel?.instance_id) {
            console.log(`Unloading model with instance_id: ${selectedModel.instance_id}`);
            unloadModel(selectedModel.instance_id);
        }

        const { instance_id } = await loadModel(key);
        console.log({ key, display_name, instance_id });
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
        </>
    );
};

export default ModelList;
