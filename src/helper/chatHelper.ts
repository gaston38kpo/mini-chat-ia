import type { ChatMessage } from "../chat/providers/chatProvider.contract";

const createMessageId = (): string => {
    return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `message-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const createUserMessage = (content: string): ChatMessage => ({
    id: createMessageId(),
    role: "user",
    content
});

const createAssistantMessage = (modelName = ""): ChatMessage => ({
    id: createMessageId(),
    role: "assistant",
    content: "",
    modelName
});

export {
    createUserMessage,
    createAssistantMessage
};
