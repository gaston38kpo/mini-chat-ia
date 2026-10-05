const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://192.168.1.68:1234/api/v1";

const PROVIDER_ID = import.meta.env.VITE_PROVIDER ?? "lmstudio";

const API_KEY = import.meta.env.VITE_API_KEY ?? "";

const CONTENT_TYPE_JSON = "application/json";

const EMPTY_SELECTED_MODEL = {
    displayName: "",
    instanceId: "",
    key: "",
    lastResponseId: null
};

const TOAST_MESSAGES = {
    CHAT_SEND_ERROR: "No se pudo enviar el mensaje",
    MODELS_FETCH_ERROR: "No se pudo obtener la lista de modelos"
};

export {
    DEFAULT_API_BASE_URL,
    PROVIDER_ID,
    API_KEY,
    CONTENT_TYPE_JSON,
    EMPTY_SELECTED_MODEL,
    TOAST_MESSAGES
};
