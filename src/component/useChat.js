import { useState } from "react";
import { message } from "antd";
import { sendMessage } from "../service/service";
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
            message.error(TOAST_MESSAGES.CHAT_SEND_ERROR);
            return;
        }

        const text = currentMessage.trim();

        if (!text) return;

        setIsSending(true);
        setCurrentMessage("");

        const assistantMessage = createAssistantMessage(selectedModel.displayName);

        setMessages((prev) => [
            ...prev,
            createUserMessage(text),
            assistantMessage
        ]);

        try {
            const responseId = await sendMessage(
                selectedModel.lastResponseId,
                selectedModel.key,
                text,
                (token) => setMessages((prev) => prev.map((item) => (
                    item.id === assistantMessage.id
                        ? { ...item, content: item.content + token }
                        : item
                )))
            );

            if (responseId) {
                setLastResponseId(responseId);
            }
        } catch (error) {
            console.error("Error sending chat message", error);
            message.error(TOAST_MESSAGES.CHAT_SEND_ERROR);
            setCurrentMessage(text);
            setMessages((prev) => prev.filter((item) => item.id !== assistantMessage.id));
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
