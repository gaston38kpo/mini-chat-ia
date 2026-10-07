import type { ChatMessage } from "./types";

/**
 * LM Studio exposes an OpenAI-compatible API under /v1. Point VITE_LM_STUDIO_URL
 * at your server; the default matches a local LM Studio install.
 */
const BASE_URL = import.meta.env.VITE_LM_STUDIO_URL ?? "http://localhost:1234/v1";

/**
 * Sends the whole conversation and streams the reply back, one token at a time.
 *
 * The API answers with Server-Sent Events: chunks shaped like `data: {json}\n\n`,
 * ending with `data: [DONE]`. We parse that by hand on purpose: this file is the
 * "how to consume an AI API" lesson.
 */
export async function streamChat(
    messages: ChatMessage[],
    onToken: (token: string) => void
): Promise<void> {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            // LM Studio serves whichever model is loaded; the OpenAI schema still
            // requires a model name, so we send a placeholder.
            model: "local-model",
            messages,
            stream: true
        })
    });

    if (!response.ok || !response.body) {
        throw new Error(`LM Studio error ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    for (;;) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE frames end with a blank line; keep the trailing partial frame.
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";

        for (const frame of frames) {
            const dataLine = frame.split("\n").find((line) => line.startsWith("data:"));

            if (!dataLine) continue;

            const data = dataLine.slice("data:".length).trim();

            if (data === "[DONE]") return;

            const token = JSON.parse(data).choices?.[0]?.delta?.content;

            if (token) onToken(token);
        }
    }
}
