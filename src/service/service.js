import { headers, request } from "../helper/serviceHelper";

const API_OPERATIONS = {
    GET_MODELS_LIST: "getModelsList",
    LOAD_MODEL: "loadModel",
    UNLOAD_MODEL: "unloadModel",
    SEND_MESSAGE: "sendMessage"
};

/**
 * @param {object} response
 * @returns {{ instanceId: string }}
 */
const parseLoadModelResponse = (response) => {
    return {
        instanceId: response?.instance_id ?? ""
    };
};

/**
 * @param {object} response
 * @returns {{ assistantMessage: object | undefined, responseId: string | undefined }}
 */
const parseChatResponse = (response) => {
    const assistantMessage = response?.output?.find((item) => item.type === "message");

    return {
        assistantMessage,
        responseId: response?.response_id
    };
};

/**
 * Obtiene la lista de modelos disponibles desde la API.
 * @returns {Promise<object>}
 * @throws {import("../helper/serviceHelper").ApiRequestError}
 */
const getModelsList = async () => {
    return await request("/models", undefined, API_OPERATIONS.GET_MODELS_LIST);
};

/**
 * Carga una instancia de modelo y la adapta al dominio interno.
 * @param {string} modelKey
 * @returns {Promise<{ instanceId: string }>} 
 * @throws {import("../helper/serviceHelper").ApiRequestError}
 */
const loadModel = async (modelKey) => {
    const requestBody = { model: modelKey };

    const response = await request("/models/load", {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody)
    }, API_OPERATIONS.LOAD_MODEL);

    return parseLoadModelResponse(response);
};

/**
 * Descarga una instancia de modelo activa.
 * @param {string} instanceId
 * @returns {Promise<object>}
 * @throws {import("../helper/serviceHelper").ApiRequestError}
 */
const unloadModel = async (instanceId) => {
    const requestBody = { instance_id: instanceId };

    return await request("/models/unload", {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody)
    }, API_OPERATIONS.UNLOAD_MODEL);
};

/**
 * Envía un mensaje al modelo cargado.
 * @param {string | null} instanceId
 * @param {string} model
 * @param {string} input
 * @returns {Promise<object>}
 * @throws {import("../helper/serviceHelper").ApiRequestError}
 */
const sendMessage = async (instanceId, model, input) => {
    const requestBody = { input, model };

    if (instanceId) {
        requestBody.previous_response_id = instanceId;
    }

    return await request("/chat", {
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
    