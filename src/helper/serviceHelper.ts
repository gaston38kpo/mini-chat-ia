import { createParser, type EventSourceMessage } from "eventsource-parser";
import { CONTENT_TYPE_JSON, DEFAULT_API_BASE_URL } from "../constants/appConstants";

const headers: Record<string, string> = { "Content-Type": CONTENT_TYPE_JSON };

interface ApiRequestErrorDetails {
    status?: number;
    operation?: string;
    path?: string;
    body?: string;
    cause?: unknown;
}

/**
 * Error enriquecido para fallos de red o respuestas no exitosas de la API.
 */
class ApiRequestError extends Error {
    declare status?: number;
    declare operation?: string;
    declare path?: string;
    declare body?: string;

    constructor(message: string, details: ApiRequestErrorDetails = {}) {
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
const fetchResponse = async (
    baseUrl: string,
    path: string,
    options: RequestInit | undefined,
    operation: string
): Promise<Response> => {
    let response: Response;

    try {
        response = await fetch(`${baseUrl}${path}`, options);
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
const request = async <T = unknown>(
    path: string,
    options: RequestInit = {},
    operation = "request",
    baseUrl: string = DEFAULT_API_BASE_URL
): Promise<T> => {
    const response = await fetchResponse(baseUrl, path, options, operation);

    return response.json() as Promise<T>;
};

/**
 * Ejecuta un request en streaming (SSE) e invoca onMessage con cada mensaje crudo recibido.
 * El parseo del payload queda a cargo de cada provider.
 */
const requestStream = async (
    path: string,
    options: RequestInit | undefined,
    operation: string,
    onMessage: (message: EventSourceMessage) => void,
    baseUrl: string = DEFAULT_API_BASE_URL
): Promise<void> => {
    const response = await fetchResponse(baseUrl, path, options, operation);
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    const parser = createParser({
        onEvent: onMessage,
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

export { request, requestStream, headers };
