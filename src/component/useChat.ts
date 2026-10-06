import { useState } from "react";
import type React from "react";
import { message } from "antd";
import useChatProvider from "./useChatProvider";
import { createAssistantMessage, createUserMessage } from "../helper/chatHelper";
import { TOAST_MESSAGES } from "../helper/toastMessages";
import type { ChatMessage } from "../chat/providers/chatProvider.contract";
import type { SelectedModel } from "../constants/appConstants";

interface UseChatParams {
    selectedModel: SelectedModel;
    setLastResponseId: (lastResponseId: string | null) => void;
}

const useChat = ({ selectedModel, setLastResponseId }: UseChatParams) => {
    const { provider } = useChatProvider();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [isSending, setIsSending] = useState<boolean>(false);

    const onSendMessage = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        if (isSending) return;

        if (!provider || !selectedModel?.key) {
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
            const { conversationId } = await provider.streamMessage({
                model: selectedModel.key,
                input: text,
                messages,
                conversationId: selectedModel.lastResponseId,
                onToken: (token) => setMessages((prev) => prev.map((item) => (
                    item.id === assistantMessage.id
                        ? { ...item, content: item.content + token }
                        : item
                )))
            });

            if (conversationId) {
                setLastResponseId(conversationId);
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

    const onChangeInputText = (event: React.ChangeEvent<HTMLInputElement>): void => {
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
