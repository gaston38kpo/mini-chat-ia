/** Un turno de la conversación: `user` sos vos, `assistant` es el modelo. */
export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}
