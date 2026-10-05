import { headers, request, requestStream } from "../../helper/serviceHelper";

const API_PATHS = {
    MODELS: "/models",
    CHAT_COMPLETIONS: "/chat/completions"
};

const API_OPERATIONS = {
    GET_MODELS_LIST: "getModelsList",
    SEND_MESSAGE: "sendMessage"
};

const MODEL_MANAGEMENT_ERROR = "OpenAI-compatible provider does not support model management";

const normalizeModels = (response) => {
    const sourceModels = Array.isArray(response?.data) ? response.data : [];

    return sourceModels.map((model) => ({
        key: model.id,
        displayName: model.id,
        loadedInstances: []
    }));
};

const buildHeaders = (apiKey) => {
    if (!apiKey) return headers;

    return {
        ...headers,
        Authorization: `Bearer ${apiKey}`
    };
};

const toApiMessages = (messages) => {
    return messages.map(({ role, content }) => ({ role, content }));
};

/**
 * Crea un ChatProvider compatible con la API de OpenAI (endpoint /chat/completions).
 * No gestiona carga/descarga de modelos: el modelo se elige directo por su id.
 */
const createOpenAiCompatibleProvider = ({ baseUrl, apiKey = "" }) => {
    /**
     * Obtiene la lista de modelos y la normaliza al dominio interno.
     */
    const listModels = async () => {
        const response = await request(
            API_PATHS.MODELS,
            { headers: buildHeaders(apiKey) },
            API_OPERATIONS.GET_MODELS_LIST,
            baseUrl
        );

        return normalizeModels(response);
    };

    /**
     * No soportado: el proveedor no administra instancias de modelo.
     */
    const loadModel = async () => {
        throw new Error(MODEL_MANAGEMENT_ERROR);
    };

    /**
     * No soportado: el proveedor no administra instancias de modelo.
     */
    const unloadModel = async () => {
        throw new Error(MODEL_MANAGEMENT_ERROR);
    };

    /**
     * Envía un mensaje al modelo y notifica cada token recibido vía SSE.
     * El estado de la conversación se reconstruye en cada request con el historial completo.
     */
    const streamMessage = async ({ model, input, messages, onToken }) => {
        const requestBody = {
            model,
            messages: [...toApiMessages(messages), { role: "user", content: input }],
            stream: true
        };

        await requestStream(API_PATHS.CHAT_COMPLETIONS, {
            method: "POST",
            headers: buildHeaders(apiKey),
            body: JSON.stringify(requestBody)
        }, API_OPERATIONS.SEND_MESSAGE, (message) => {
            if (message.data === "[DONE]") return;

            const chunk = JSON.parse(message.data);
            const token = chunk.choices?.[0]?.delta?.content;

            if (token) {
                onToken(token);
            }
        }, baseUrl);

        return { conversationId: null };
    };

    return {
        capabilities: { canManageModels: false },
        listModels,
        loadModel,
        unloadModel,
        streamMessage
    };
};

export { createOpenAiCompatibleProvider };
