import { headers, request } from "../helper/serviceHelper";

const API_OPERATIONS = {
    GET_MODELS_LIST: "getModelsList",
    LOAD_MODEL: "loadModel",
    UNLOAD_MODEL: "unloadModel",
    SEND_MESSAGE: "sendMessage"
};

const parseChatResponse = (response) => {
    const assistantMessage = response?.output?.find((item) => item.type === "message");

    return {
        assistantMessage,
        responseId: response?.response_id
    };
};

// OBTENGO LOS MODELOS
const getModelsList = async () => {
    return await request("/models", undefined, API_OPERATIONS.GET_MODELS_LIST);
};

// CARGO UN MODELO
const loadModel = async (modelKey) => {
    const jsBody = { model: modelKey };

    return await request("/models/load", {
        method: "POST",
        headers,
        body: JSON.stringify(jsBody)
    }, API_OPERATIONS.LOAD_MODEL);
};

// DESCARGO UN MODELO
const unloadModel = async (instanceId) => {
    const jsBody = { instance_id: instanceId };

    return await request("/models/unload", {
        method: "POST",
        headers,
        body: JSON.stringify(jsBody)
    }, API_OPERATIONS.UNLOAD_MODEL);
};

// ENVIO UN MENSAJE AL MODELO
const sendMessage = async (instanceId, model, input) => {
    const jsBody = { input, model };

    if (instanceId) {
        jsBody.previous_response_id = instanceId;
    }

    return await request("/chat", {
        method: "POST",
        headers,
        body: JSON.stringify(jsBody)
    }, API_OPERATIONS.SEND_MESSAGE);
};

export {
    getModelsList,
    loadModel,
    unloadModel,
    sendMessage,
    parseChatResponse
};
    