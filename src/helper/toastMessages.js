import { TOAST_MESSAGES } from "../constants/appConstants";

const getLoadingModelMessage = (displayName) => `Montando modelo: ${displayName}`;
const getLoadedModelMessage = (displayName) => `Modelo montado: ${displayName}`;
const getLoadModelErrorMessage = (displayName) => `No se pudo montar el modelo: ${displayName}`;
const getUnloadingModelMessage = (displayName) => `Desmontando modelo: ${displayName}`;
const getUnloadedModelMessage = (displayName) => `Modelo desmontado: ${displayName}`;
const getUnloadModelErrorMessage = (displayName) => `No se pudo desmontar el modelo: ${displayName}`;

export {
    TOAST_MESSAGES,
    getLoadingModelMessage,
    getLoadedModelMessage,
    getLoadModelErrorMessage,
    getUnloadingModelMessage,
    getUnloadedModelMessage,
    getUnloadModelErrorMessage
};
