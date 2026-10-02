import { headers, request, requestStream } from "../helper/serviceHelper";
import { API_OPERATIONS, API_PATHS } from "../constants/appConstants";


const parseLoadModelResponse = (response) => {
    return {
        instanceId: response?.instance_id ?? ""
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
 * Envía un mensaje al modelo cargado y notifica cada token recibido.
 * Devuelve el response_id final para mantener el contexto de la conversación.
 */
const sendMessage = async (instanceId, model, input, onToken) => {
    const requestBody = { input, model, stream: true };

    if (instanceId) {
        requestBody.previous_response_id = instanceId;
    }

    let responseId;

    await requestStream(API_PATHS.CHAT, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody)
    }, API_OPERATIONS.SEND_MESSAGE, (event) => {
        if (event.type === "message.delta") {
            onToken(event.content);
        } else if (event.type === "chat.end") {
            responseId = event.result?.response_id;
        }
        // ponytail: reasoning.delta ignorado; añadir burbuja propia si se usan modelos con razonamiento
    });

    return responseId;
};

export {
    getModelsList,
    loadModel,
    unloadModel,
    sendMessage
};
    