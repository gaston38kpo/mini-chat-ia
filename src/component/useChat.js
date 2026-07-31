import { useState } from "react";
import { toast } from "sonner";
import { parseChatResponse, sendMessage } from "../service/service";
import { createAssistantMessage, createUserMessage } from "../helper/chatHelper";
import { logError } from "../helper/logger";

const useChat = ({ selectedModel, setLastResponseId }) => {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    const onSendMessage = async (event) => {
        event.preventDefault();

        if (!currentMessage || isSending) return;

        const text = currentMessage.trim();

        setIsSending(true);
        setCurrentMessage("");
        setMessages((prev) => [
            ...prev,
            createUserMessage(text)
        ]);

        try {
            const response = await sendMessage(selectedModel.lastResponseId, selectedModel.key, text);
            const { assistantMessage, responseId } = parseChatResponse(response);

            if (assistantMessage) {
                setMessages((prev) => [
                    ...prev,
                    createAssistantMessage(assistantMessage)
                ]);
            }

            if (responseId) {
                setLastResponseId(responseId);
            }
        } catch (error) {
            logError("Error sending chat message", error);
            toast.error("No se pudo enviar el mensaje");
            setCurrentMessage(text);
        } finally {
            setIsSending(false);
        }
    };

    const onChangeInputText = (event) => {
        setCurrentMessage(event.target.value);
    };

    return {
        messages,
        currentMessage,
        isSending,
        onSendMessage,
        onChangeInputText
    };
};

export default useChat;
