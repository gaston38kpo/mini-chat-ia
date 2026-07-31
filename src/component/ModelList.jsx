import React from "react";
import { useSetSelectedModel } from "../store/modelStore";
import useModelList from "./useModelList";

const ModelList = () => {
    const setSelectedModel = useSetSelectedModel();
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
