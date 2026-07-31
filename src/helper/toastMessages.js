const TOAST_MESSAGES = {
    CHAT_SEND_ERROR: "No se pudo enviar el mensaje",
    MODELS_FETCH_ERROR: "No se pudo obtener la lista de modelos"
};

const getLoadingModelMessage = (displayName) => `Cargando modelo: ${displayName}`;
const getLoadedModelMessage = (displayName) => `Modelo cargado: ${displayName}`;
const getLoadModelErrorMessage = (displayName) => `No se pudo cargar el modelo: ${displayName}`;

export {
    TOAST_MESSAGES,
    getLoadingModelMessage,
    getLoadedModelMessage,
    getLoadModelErrorMessage
};
