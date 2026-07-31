import { useState } from "react";
import { toast } from "sonner";
import { parseChatResponse, sendMessage } from "../service/service";
import { createAssistantMessage, createUserMessage } from "../helper/chatHelper";
import { TOAST_MESSAGES } from "../helper/toastMessages";

const useChat = ({ selectedModel, setLastResponseId }) => {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    const onSendMessage = async (event) => {
        event.preventDefault();

        if (isSending) return;

        if (!selectedModel?.key) {
            toast.error(TOAST_MESSAGES.CHAT_SEND_ERROR);
            return;
        }

        const text = currentMessage.trim();

        if (!text) return;

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
            console.error("Error sending chat message", error);
            toast.error(TOAST_MESSAGES.CHAT_SEND_ERROR);
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
