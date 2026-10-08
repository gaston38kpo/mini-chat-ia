import { useState } from "react";
import { streamChat } from "./lmStudioClient";
import type { ChatMessage } from "./types";

/**
 * Todo lo que necesita el chat: la lista de mensajes, el flag "isSending" y la
 * función `send`. Es un hook: guarda estado de React y expone una acción.
 */
export function useLocalChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSending, setIsSending] = useState(false);

    async function send(input: string) {
        const text = input.trim();

        // Nada que enviar, o ya hay un envío en curso: no hacemos nada.
        if (!text || isSending) return;

        // La API no guarda estado: le mandamos el historial completo en cada request.
        // Acá, el historial son los mensajes previos más el nuevo.
        const history: ChatMessage[] = [...messages, { role: "user", content: text }];

        // Mostramos ya mismo tu mensaje y un mensaje vacío del asistente
        // (respuesta "optimista"). El vacío se va a ir llenando token por token.
        setMessages([...history, { role: "assistant", content: "" }]);
        setIsSending(true);

        try {
            // Le pasamos el historial y una función que se llama con cada token.
            await streamChat(history, (token) => {
                setMessages((prev) => {
                    // React necesita un array NUEVO para detectar el cambio.
                    const updated = [...prev];
                    const lastIndex = updated.length - 1;
                    const last = updated[lastIndex];

                    // Al último mensaje (el del asistente) le pegamos el token nuevo.
                    updated[lastIndex] = { ...last, content: last.content + token };

                    return updated;
                });
            });
        } catch (error) {
            // Si algo falla, sacamos el mensaje vacío y lo cambiamos por un aviso.
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
