import React, { useState } from "react";
import { useModelStore } from "../store/modelStore";
import { sendMessage } from "../service/service";

const Chat = () => {
    const { selectedModel, setLastResponseId } = useModelStore();
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");

    const onSendMessage = async (event) => {
        event.preventDefault();

        if (!currentMessage.trim()) return;

        setCurrentMessage("");
        setMessages((prev) => [
            ...prev,
            { role: "user", content: currentMessage }
        ]);

        const res = await sendMessage(selectedModel.last_response_id, selectedModel.key, currentMessage);
        console.log(res)

        const [thinking, assistantMessage] = res?.output ?? [null, null];

        if (assistantMessage) {
            setMessages((prev) => [
                ...prev,
                assistantMessage
            ]);
        }

        setLastResponseId(res.response_id);
    };

    const onChangeInputText = (e) => {
        setCurrentMessage(e.target.value);
    };

    return <div>
        <h1>Mensajes</h1>
        <form onSubmit={onSendMessage}>
            <div>
                {messages.map((message, index) => (
                    <p key={`${message.role ?? "message"}-${index}`}>
                        <strong>{message.role ?? "message"}:</strong> {message.content}
                    </p>
                ))}
            </div>
            <input type="text" name="message" value={currentMessage} onChange={onChangeInputText} />
            <button type="submit">Enviar</button>
        </form>
    </div>;
};

export default Chat;
