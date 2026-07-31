import React from "react";
import { useModelStore } from "../store/modelStore";
import useModelList from "./useModelList";

const ModelList = () => {
    const setSelectedModel = useModelStore((state) => state.setSelectedModel);
    const { models, loadingKey, onClickModel } = useModelList({ setSelectedModel });

    return (
        <>
        <h1>Elegi un modelo y cargalo</h1>
            <ul>
                {models.map((model) => (
                    <li key={model.key}>
                        <button
                            disabled={loadingKey !== null}
                            onClick={() => onClickModel(model.key, model.displayName)}
                        >
                            {model.displayName}
                        </button>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default ModelList;
