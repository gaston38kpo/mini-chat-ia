const createMessageId = () => {
    return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `message-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const createUserMessage = (content) => ({
    id: createMessageId(),
    role: "user",
    content
});

const createAssistantMessage = (modelName = "") => ({
    id: createMessageId(),
    role: "assistant",
    content: "",
    modelName
});

export {
    createUserMessage,
    createAssistantMessage
};
