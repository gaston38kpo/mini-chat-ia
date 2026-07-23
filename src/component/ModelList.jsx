import React, { useEffect, useState } from "react";
import { getModelsList, loadModel, unloadModel } from "../service/service";
import { useModelStore } from "../store/modelStore";

const ModelList = () => {
    const { selectedModel, setSelectedModel } = useModelStore();
    const [models, setModels] = useState([]);

    const fetchModels = async () => {
        const { models } = await getModelsList();
        console.log({ models });
        setModels(models);
    };

    const onClickModel = async (key, display_name) => {
        if (selectedModel?.instance_id) {
            console.log(`Unloading model with instance_id: ${selectedModel.instance_id}`);
            unloadModel(selectedModel.instance_id);
        }

        const { instance_id } = await loadModel(key);
        console.log({ key, display_name, instance_id });
        setSelectedModel({ display_name, instance_id });
    };

    useEffect(() => { fetchModels() }, []);

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
