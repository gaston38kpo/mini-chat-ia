import React, { useState } from "react";
import Markdown from "react-markdown";
import { useModelStore } from "../store/modelStore";
import { parseChatResponse, sendMessage } from "../service/service";
import { toast } from "sonner";
import { Comment } from "react-loader-spinner";

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

const Chat = () => {
    const selectedModel = useModelStore((state) => state.selectedModel);
    const setLastResponseId = useModelStore((state) => state.setLastResponseId);
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
            const res = await sendMessage(selectedModel.last_response_id, selectedModel.key, text);
            const { assistantMessage, responseId } = parseChatResponse(res);

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
            toast.error("No se pudo enviar el mensaje");
            setCurrentMessage(text);
        } finally {
            setIsSending(false);
        }
    };

    const onChangeInputText = (e) => {
        setCurrentMessage(e.target.value);
    };

    return <div>
        <h1>Mensajes</h1>
        <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "8px", borderRadius: "8px" }}>
            {messages.map((message) => (
                <p key={message.id} style={{ margin: "12px 0", border: "1px solid #ccc", padding: "2px 8px", borderRadius: "8px" }}>
                    <Markdown>{message.content}</Markdown>
                    <span>{message.role || selectedModel.display_name}</span>
                </p>
            ))}

            {isSending && (
                <div >
                    <Comment
                        visible={true}
                        height="40"
                        width="40"
                        ariaLabel="comment-loading"
                        wrapperStyle={{}}
                        wrapperClass="comment-wrapper"
                        color="white"
                        backgroundColor="blue"
                    />
                </div>
            )}
        </div>
        <form onSubmit={onSendMessage} style={{ display: "flex", marginTop: "12px" }}>
            <input
                type="text"
                name="message"
                value={currentMessage}
                onChange={onChangeInputText}
                disabled={isSending}
                style={{ marginRight: "8px", width: "100%" }}
            />
            <button type="submit" disabled={isSending}>Enviar</button>
        </form>
    </div>;
};

export default Chat;
