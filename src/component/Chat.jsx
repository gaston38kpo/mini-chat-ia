import React, { useState } from "react";
import Markdown from "react-markdown";
import { useModelStore } from "../store/modelStore";
import { sendMessage } from "../service/service";
import { toast } from "sonner";
import { Comment } from 'react-loader-spinner';

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
            { role: "user", content: text }
        ]);

        try {
            const res = await sendMessage(selectedModel.last_response_id, selectedModel.key, text);

            const assistantMessage = res?.output?.find((item) => item.type === "message");

            if (assistantMessage) {
                setMessages((prev) => [
                    ...prev,
                    assistantMessage
                ]);
            }

            if (res?.response_id) {
                setLastResponseId(res.response_id);
            }
        } catch {
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
            {messages.map((message, index) => (
                <p key={`${message.role ?? "message"}-${index}`} style={{ margin: "12px 0", border: "1px solid #ccc", padding: "2px 8px", borderRadius: "8px" }}>
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
