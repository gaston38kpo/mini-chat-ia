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

const createAssistantMessage = (message) => ({
    id: createMessageId(),
    ...message
});

export {
    createUserMessage,
    createAssistantMessage
};
