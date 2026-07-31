const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://192.168.1.68:1234/api/v1";

const headers = { "Content-Type": "application/json" };

/**
 * Error enriquecido para fallos de red o respuestas no exitosas de la API.
 */
class ApiRequestError extends Error {
    constructor(message, details = {}) {
        super(message);
        this.name = "ApiRequestError";
        this.status = details.status;
        this.operation = details.operation;
        this.path = details.path;
        this.body = details.body;
        this.cause = details.cause;
    }
}

/**
 * Ejecuta requests HTTP a la API configurada y normaliza errores.
 * @param {string} path
 * @param {RequestInit} [options={}]
 * @param {string} [operation="request"]
 * @returns {Promise<any>}
 * @throws {ApiRequestError}
 */
const request = async (path, options = {}, operation = "request") => {
    let response;

    try {
        response = await fetch(`${BASE_URL}${path}`, options);
    } catch (error) {
        console.error(`${operation} network error`, error);
        throw new ApiRequestError(`${operation} network error`, {
            operation,
            path,
            cause: error
        });
    }

    if (!response.ok) {
        const responseBody = await response.text().catch(() => "");
        const error = new ApiRequestError(`${operation} failed with status ${response.status}`, {
            status: response.status,
            operation,
            path,
            body: responseBody
        });
        console.error(`${operation} response error`, error);
        throw error;
    }

    return response.json();
};

export { request, headers, ApiRequestError };