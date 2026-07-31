const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://192.168.1.68:1234/api/v1";

const CONTENT_TYPE_JSON = "application/json";

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

const EMPTY_SELECTED_MODEL = { displayName: "", instanceId: "", key: "", lastResponseId: null };

const TOAST_MESSAGES = {
    CHAT_SEND_ERROR: "No se pudo enviar el mensaje",
    MODELS_FETCH_ERROR: "No se pudo obtener la lista de modelos"
};

export {
    DEFAULT_API_BASE_URL,
    CONTENT_TYPE_JSON,
    API_PATHS,
    API_OPERATIONS,
    EMPTY_SELECTED_MODEL,
    TOAST_MESSAGES
};
