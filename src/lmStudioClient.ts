import type { ChatMessage } from "./types";

/**
 * URL del servidor de LM Studio. Se puede pisar con la variable de entorno
 * VITE_LM_STUDIO_URL (mirá .env.example). El default es un LM Studio local.
 */
const BASE_URL = import.meta.env.VITE_LM_STUDIO_URL ?? "http://localhost:1234/v1";

/**
 * Envía toda la conversación y va entregando la respuesta del modelo token por token.
 *
 * La API responde con Server-Sent Events (SSE): un stream de texto donde cada
 * evento es una línea `data: {json}` seguida de una línea en blanco, y el último
 * es `data: [DONE]`. Lo parseamos a mano a propósito: este archivo ES la lección
 * de "cómo consumir un API de IA".
 *
 * No devolvemos los tokens: se los pasamos a `onToken` a medida que llegan. Es la
 * forma natural de manejar datos que van apareciendo de a poco.
 */
export async function streamChat(
    messages: ChatMessage[],
    onToken: (token: string) => void
): Promise<void> {
    // 1) Pedimos la respuesta. `stream: true` le dice al servidor que use SSE.
    //    LM Studio sirve el modelo que tengas cargado; igual el formato OpenAI
    //    exige un nombre de modelo, así que mandamos un placeholder.
    const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "local-model",
            messages,
            stream: true
        })
    });

    if (!response.ok || !response.body) {
        throw new Error(`LM Studio error ${response.status}`);
    }

    // 2) `response.body` es un stream de bytes: lo leemos de a pedazos con un reader.
    //    `TextDecoder` convierte esos bytes en texto.
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        // 3) Un pedazo puede cortar un evento al medio, así que lo acumulamos.
        buffer += decoder.decode(value, { stream: true });

        // Los eventos SSE se separan con una línea en blanco ("\n\n").
        // Con `pop()` nos guardamos el último, que puede venir incompleto, para
        // procesarlo en la próxima vuelta.
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";

        // 4) Procesamos los eventos que sí llegaron completos.
        for (const frame of frames) {
            // Cada evento tiene varias líneas; nos interesa la que empieza con "data:".
            const dataLine = frame.split("\n").find((line) => line.startsWith("data:"));

            if (!dataLine) continue;

            const payload = dataLine.slice("data:".length).trim();

            // "[DONE]" es la señal de fin del stream.
            if (payload === "[DONE]") return;

            // El JSON tiene la forma: { choices: [ { delta: { content: "..." } } ] }.
            // Los `?.` evitan errores cuando un campo no viene: por ejemplo, el
            // primer evento solo trae el rol y no tiene texto.
            const token = JSON.parse(payload).choices?.[0]?.delta?.content;

            if (token) onToken(token);
        }
    }
}
