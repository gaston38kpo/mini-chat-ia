import { TOAST_MESSAGES } from "../constants/appConstants";

const getLoadingModelMessage = (displayName: string): string => `Montando modelo: ${displayName}`;
const getLoadedModelMessage = (displayName: string): string => `Modelo montado: ${displayName}`;
const getLoadModelErrorMessage = (displayName: string): string => `No se pudo montar el modelo: ${displayName}`;
const getUnloadingModelMessage = (displayName: string): string => `Desmontando modelo: ${displayName}`;
const getUnloadedModelMessage = (displayName: string): string => `Modelo desmontado: ${displayName}`;
const getUnloadModelErrorMessage = (displayName: string): string => `No se pudo desmontar el modelo: ${displayName}`;

export {
    TOAST_MESSAGES,
    getLoadingModelMessage,
    getLoadedModelMessage,
    getLoadModelErrorMessage,
    getUnloadingModelMessage,
    getUnloadedModelMessage,
    getUnloadModelErrorMessage
};
