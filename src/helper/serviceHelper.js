import { createParser } from "eventsource-parser";
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
 * Ejecuta el fetch contra la API configurada y normaliza errores.
 */
const fetchResponse = async (path, options, operation) => {
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

    return response;
};

/**
 * Ejecuta requests HTTP a la API configurada y devuelve el JSON.
 */
const request = async (path, options = {}, operation = "request") => {
    const response = await fetchResponse(path, options, operation);

    return response.json();
};

/**
 * Ejecuta un request en streaming (SSE) e invoca onEvent por cada evento recibido.
 */
const requestStream = async (path, options, operation, onEvent) => {
    const response = await fetchResponse(path, options, operation);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    const parser = createParser({
        onEvent: (message) => {
            onEvent(JSON.parse(message.data));
        },
        onError: (error) => {
            console.error(`${operation} stream parse error`, error);
        }
    });

    for (;;) {
        const { done, value } = await reader.read();

        if (done) break;

        parser.feed(decoder.decode(value, { stream: true }));
    }
};

export { request, requestStream, headers, ApiRequestError };