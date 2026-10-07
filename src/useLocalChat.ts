import { useState } from "react";
import { streamChat } from "./lmStudioClient";
import type { ChatMessage } from "./types";

/**
 * Everything the chat needs: the message list, the "is sending" flag, and the
 * send use case. Each streamed token is appended to the last (assistant) message.
 */
export function useLocalChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSending, setIsSending] = useState(false);

    async function send(input: string) {
        const text = input.trim();

        if (!text || isSending) return;

        const history: ChatMessage[] = [...messages, { role: "user", content: text }];

        setMessages([...history, { role: "assistant", content: "" }]);
        setIsSending(true);

        try {
            await streamChat(history, (token) => {
                setMessages((prev) => {
                    const next = [...prev];
                    const last = next[next.length - 1];

                    next[next.length - 1] = { ...last, content: last.content + token };

                    return next;
                });
            });
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev.slice(0, -1),
                { role: "assistant", content: "No se pudo conectar con LM Studio." }
            ]);
        } finally {
            setIsSending(false);
        }
    }

    return { messages, isSending, send };
}
