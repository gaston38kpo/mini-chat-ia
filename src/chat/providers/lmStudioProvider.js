import { headers, request, requestStream } from "../../helper/serviceHelper";

const API_PATHS = {
    MODELS: "/models",
    MODELS_LOAD: "/models/load",
    MODELS_UNLOAD: "/models/unload",
    CHAT: "/chat"
};

const API_OPERATIONS = {
    GET_MODELS_LIST: "getModelsList",
    LOAD_MODEL: "loadModel",
    UNLOAD_MODEL: "unloadModel",
    SEND_MESSAGE: "sendMessage"
};

const toDomainModel = (model) => {
    return {
        ...model,
        displayName: model.display_name ?? "",
        loadedInstances: Array.isArray(model.loaded_instances) ? model.loaded_instances : []
    };
};

const normalizeModels = (response) => {
    const sourceModels = Array.isArray(response?.models) ? response.models : [];
    const seen = new Map();

    for (const model of sourceModels) {
        seen.set(model.key, toDomainModel(model));
    }

    return Array.from(seen.values());
};

const parseLoadModelResponse = (response) => {
    return {
        instanceId: response?.instance_id ?? ""
    };
};

/**
 * Crea un ChatProvider respaldado por la API de LM Studio.
 */
const createLmStudioProvider = ({ baseUrl }) => {
    /**
     * Obtiene la lista de modelos disponibles y la normaliza al dominio interno.
     */
    const listModels = async () => {
        const response = await request(API_PATHS.MODELS, undefined, API_OPERATIONS.GET_MODELS_LIST, baseUrl);

        return normalizeModels(response);
    };

    /**
     * Monta una instancia de modelo y la adapta al dominio interno.
     */
    const loadModel = async (modelKey) => {
        const requestBody = { model: modelKey };

        const response = await request(API_PATHS.MODELS_LOAD, {
            method: "POST",
            headers,
            body: JSON.stringify(requestBody)
        }, API_OPERATIONS.LOAD_MODEL, baseUrl);

        return parseLoadModelResponse(response);
    };

    /**
     * Desmonta una instancia de modelo activa.
     */
    const unloadModel = async (instanceId) => {
        const requestBody = { instance_id: instanceId };

        await request(API_PATHS.MODELS_UNLOAD, {
            method: "POST",
            headers,
            body: JSON.stringify(requestBody)
        }, API_OPERATIONS.UNLOAD_MODEL, baseUrl);
    };

    /**
     * Envía un mensaje al modelo montado y notifica cada token recibido.
     * Devuelve el response_id final para mantener el contexto de la conversación.
     */
    const streamMessage = async ({ model, input, conversationId, onToken }) => {
        const requestBody = { input, model, stream: true };

        if (conversationId) {
            requestBody.previous_response_id = conversationId;
        }

        let responseId;

        await requestStream(API_PATHS.CHAT, {
            method: "POST",
            headers,
            body: JSON.stringify(requestBody)
        }, API_OPERATIONS.SEND_MESSAGE, (message) => {
            const event = JSON.parse(message.data);

            if (event.type === "message.delta") {
                onToken(event.content);
            } else if (event.type === "chat.end") {
                responseId = event.result?.response_id;
            }
            // reasoning.delta ignorado; añadir burbuja propia si se usan modelos con razonamiento
        }, baseUrl);

        return { conversationId: responseId ?? null };
    };

    return {
        capabilities: { canManageModels: true },
        listModels,
        loadModel,
        unloadModel,
        streamMessage
    };
};

export { createLmStudioProvider };
