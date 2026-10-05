/**
 * Configuracion de marca de la aplicacion.
 * Cambia APP_NAME y PROVIDER_LABEL para reutilizar el proyecto en otro producto.
 * Los textos que dependen de la marca se derivan de estas constantes.
 */
const APP_NAME = "Mini Chat";
const PROVIDER_LABEL = "LM Studio";

const APP_CONFIG = {
    name: APP_NAME,
    providerLabel: PROVIDER_LABEL,
    title: `${APP_NAME} IA para API de ${PROVIDER_LABEL}`,
    tagline: "Selecciona un modelo para chatear.",
    modelsSectionTitle: `Modelos disponibles en ${PROVIDER_LABEL}`
};

export { APP_CONFIG };
