import { CONTENT_TYPE_JSON, DEFAULT_API_BASE_URL } from "../constants/appConstants";

const BASE_URL = DEFAULT_API_BASE_URL;

const headers = { "Content-Type": CONTENT_TYPE_JSON };

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