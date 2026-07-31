import { TOAST_MESSAGES } from "../constants/appConstants";

const getLoadingModelMessage = (displayName) => `Cargando modelo: ${displayName}`;
const getLoadedModelMessage = (displayName) => `Modelo cargado: ${displayName}`;
const getLoadModelErrorMessage = (displayName) => `No se pudo cargar el modelo: ${displayName}`;

export {
    TOAST_MESSAGES,
    getLoadingModelMessage,
    getLoadedModelMessage,
    getLoadModelErrorMessage
};
