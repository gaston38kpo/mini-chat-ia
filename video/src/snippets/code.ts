/**
 * Fragmentos curados del codigo real de la app.
 *
 * OJO: son copias a mano. Remotion no usa Vite, asi que no podemos importar los
 * archivos reales con `?raw`. Si cambia el original, actualiza estas copias.
 *
 * Cada array es una linea del snippet; se unen con "\n". El numero de linea que
 * muestra el video es el indice + 1, y coincide con el archivo real salvo donde
 * se aclara "recortado".
 */

/** src/App.tsx, lineas 5-13. */
export const SNIPPET_APP_SUBMIT = [
    "function App() {",
    '    const [input, setInput] = useState("");',
    "    const { messages, isSending, send } = useLocalChat();",
    "",
    "    function onSubmit(event: FormEvent) {",
    "        event.preventDefault();",
    "        send(input);",
    '        setInput("");',
    "    }",
].join("\n");

/** src/useLocalChat.ts, lineas 9-21. */
export const SNIPPET_HOOK_SEND = [
    "export function useLocalChat() {",
    "    const [messages, setMessages] = useState<ChatMessage[]>([]);",
    "    const [isSending, setIsSending] = useState(false);",
    "",
    "    async function send(input: string) {",
    "        const text = input.trim();",
    "",
    "        if (!text || isSending) return;",
    "",
    '        const history: ChatMessage[] = [...messages, { role: "user", content: text }];',
    "",
    '        setMessages([...history, { role: "assistant", content: "" }]);',
    "        setIsSending(true);",
].join("\n");

/** src/lmStudioClient.ts, lineas 20-36. */
export const SNIPPET_CLIENT_FETCH = [
    "export async function streamChat(",
    "    messages: ChatMessage[],",
    "    onToken: (token: string) => void",
    "): Promise<void> {",
    "    const response = await fetch(`${BASE_URL}/chat/completions`, {",
    '        method: "POST",',
    '        headers: { "Content-Type": "application/json" },',
    "        body: JSON.stringify({",
    '            model: "local-model",',
    "            messages,",
    "            stream: true",
    "        })",
    "    });",
    "",
    "    if (!response.ok || !response.body) {",
    "        throw new Error(`LM Studio error ${response.status}`);",
    "    }",
].join("\n");

/** src/lmStudioClient.ts, lineas 41-53. */
export const SNIPPET_CLIENT_READER = [
    "    const reader = response.body.getReader();",
    "    const decoder = new TextDecoder();",
    '    let buffer = "";',
    "",
    "    while (true) {",
    "        const { done, value } = await reader.read();",
    "",
    "        if (done) break;",
    "",
    "        buffer += decoder.decode(value, { stream: true });",
].join("\n");

/** src/lmStudioClient.ts, lineas 55-79. */
export const SNIPPET_CLIENT_FRAMES = [
    '        const frames = buffer.split("\\n\\n");',
    '        buffer = frames.pop() ?? "";',
    "",
    "        for (const frame of frames) {",
    '            const dataLine = frame.split("\\n").find((line) => line.startsWith("data:"));',
    "",
    "            if (!dataLine) continue;",
    "",
    '            const payload = dataLine.slice("data:".length).trim();',
    "",
    '            if (payload === "[DONE]") return;',
    "",
    "            const token = JSON.parse(payload).choices?.[0]?.delta?.content;",
    "",
    "            if (token) onToken(token);",
    "        }",
].join("\n");

/** src/useLocalChat.ts, lineas 30-40. */
export const SNIPPET_HOOK_TOKEN = [
    "        await streamChat(history, (token) => {",
    "            setMessages((prev) => {",
    "                const updated = [...prev];",
    "                const lastIndex = updated.length - 1;",
    "                const last = updated[lastIndex];",
    "",
    "                updated[lastIndex] = { ...last, content: last.content + token };",
    "",
    "                return updated;",
    "            });",
    "        });",
].join("\n");

/** src/App.tsx, lineas 23-38. RECORTADO: se acortan los className largos. */
export const SNIPPET_APP_RENDER = [
    "{messages.map((message, index) => (",
    '    <div key={index} className={message.role === "user" ? "text-right" : "text-left"}>',
    '        <span className="inline-block whitespace-pre-wrap rounded-2xl ...">',
    '            {message.content || "…"}',
    "        </span>",
    "    </div>",
    "))}",
].join("\n");
