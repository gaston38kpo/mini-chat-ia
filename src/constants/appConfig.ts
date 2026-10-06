/**
 * Configuracion de marca de la aplicacion.
 * El titulo y el encabezado de modelos se derivan del proveedor activo,
 * asi el branding deja de estar atado a un backend puntual.
 */

const APP_NAME = "Mini Chat";
const FALLBACK_PROVIDER_LABEL = "tu backend";

interface AppConfig {
    name: string;
    title: string;
    tagline: string;
    modelsSectionTitle: string;
}

const getAppConfig = (providerLabel: string): AppConfig => {
    const label = providerLabel.trim() || FALLBACK_PROVIDER_LABEL;

    return {
        name: APP_NAME,
        title: `${APP_NAME} IA para API de ${label}`,
        tagline: "Selecciona un modelo para chatear.",
        modelsSectionTitle: `Modelos disponibles en ${label}`
    };
};

export { getAppConfig };
export type { AppConfig };
