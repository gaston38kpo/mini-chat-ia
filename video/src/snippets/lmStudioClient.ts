/**
 * Fragmentos curados de `src/lmStudioClient.ts`.
 *
 * OJO: son copias a mano. Remotion no usa Vite, asi que no podemos importar el
 * archivo real con `?raw`. Si cambia el original, actualiza estas copias.
 *
 * Cada array es una linea del snippet; se unen con "\n". El numero de linea que
 * muestra el video es el indice + 1.
 */

/** src/lmStudioClient.ts, lineas 27-39. */
export const SNIPPET_REQUEST = [
    'const response = await fetch(`${BASE_URL}/chat/completions`, {',
    '    method: "POST",',
    '    headers: { "Content-Type": "application/json" },',
    "    body: JSON.stringify({",
    '        model: "local-model",',
    "        messages,",
    "        stream: true",
    "    })",
    "});",
    "",
    "if (!response.ok || !response.body) {",
    "    throw new Error(`LM Studio error ${response.status}`);",
    "}",
].join("\n");

/** src/lmStudioClient.ts, lineas 43-53. */
export const SNIPPET_READER = [
    "const reader = response.body.getReader();",
    "const decoder = new TextDecoder();",
    'let buffer = "";',
    "",
    "while (true) {",
    "    const { done, value } = await reader.read();",
    "",
    "    if (done) break;",
    "",
    "    buffer += decoder.decode(value, { stream: true });",
].join("\n");

/** src/lmStudioClient.ts, lineas 55-79, resumidas. */
export const SNIPPET_FRAMES = [
    'const frames = buffer.split("\\n\\n");',
    'buffer = frames.pop() ?? "";',
    "",
    "for (const frame of frames) {",
    '    const dataLine = frame.split("\\n").find((line) => line.startsWith("data:"));',
    "",
    "    if (!dataLine) continue;",
    "",
    '    const payload = dataLine.slice("data:".length).trim();',
    "",
    '    if (payload === "[DONE]") return;',
    "",
    "    const token = JSON.parse(payload).choices?.[0]?.delta?.content;",
    "",
    "    if (token) onToken(token);",
    "}",
].join("\n");
