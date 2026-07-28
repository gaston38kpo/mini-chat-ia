import React, { useState } from "react";
import { useModelStore } from "../store/modelStore";
import { sendMessage } from "../service/service";

const Chat = () => {
    const { selectedModel, setLastResponseId } = useModelStore();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");

    const onSendMessage = async (event) => {
        event.preventDefault();

        if (!messageInput.trim()) return;

        setMessageInput("");

        const res = await sendMessage(selectedModel.last_response_id, selectedModel.key, messageInput);

        setMessages(res.output);
        setLastResponseId(res.response_id);
    };

    const onChangeInputText = (e) => {
        setMessageInput(e.target.value);
    };

    return <div>
        <h1>Mensajes</h1>1
        <form onSubmit={onSendMessage}>
            <span> {messages && messages[1]?.content} </span>
            <input type="text" name="message" value={messageInput} onChange={onChangeInputText} />
            <button type="submit">Enviar</button>
        </form>
    </div>;
};

export default Chat;
