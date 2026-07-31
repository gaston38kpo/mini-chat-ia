import { headers, request } from "../helper/serviceHelper";
import { API_OPERATIONS, API_PATHS } from "../constants/appConstants";


const parseLoadModelResponse = (response) => {
    return {
        instanceId: response?.instance_id ?? ""
    };
};


const parseChatResponse = (response) => {
    const assistantMessage = response?.output?.find((item) => item.type === "message");

    return {
        assistantMessage,
        responseId: response?.response_id
    };
};

/**
 * Obtiene la lista de modelos disponibles desde la API.
 */
const getModelsList = async () => {
    return await request(API_PATHS.MODELS, undefined, API_OPERATIONS.GET_MODELS_LIST);
};

/**
 * Carga una instancia de modelo y la adapta al dominio interno.
 */
const loadModel = async (modelKey) => {
    const requestBody = { model: modelKey };

    const response = await request(API_PATHS.MODELS_LOAD, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody)
    }, API_OPERATIONS.LOAD_MODEL);

    return parseLoadModelResponse(response);
};

/**
 * Descarga una instancia de modelo activa.
 */
const unloadModel = async (instanceId) => {
    const requestBody = { instance_id: instanceId };

    return await request(API_PATHS.MODELS_UNLOAD, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody)
    }, API_OPERATIONS.UNLOAD_MODEL);
};

/**
 * Envía un mensaje al modelo cargado.
 */
const sendMessage = async (instanceId, model, input) => {
    const requestBody = { input, model };

    if (instanceId) {
        requestBody.previous_response_id = instanceId;
    }

    return await request(API_PATHS.CHAT, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody)
    }, API_OPERATIONS.SEND_MESSAGE);
};

export {
    getModelsList,
    loadModel,
    unloadModel,
    sendMessage,
    parseChatResponse
};
    