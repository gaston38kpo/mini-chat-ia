import React, { useState } from "react";
import { useModelStore } from "../store/modelStore";
import { sendMessage } from "../service/service";

const Chat = () => {
    const { selectedModel, setLastResponseId } = useModelStore();
    const [messages, setMessages] = useState([]);

    const onSubmitMessage = async (message) => {
        const res = await sendMessage(selectedModel.last_response_id, selectedModel.key, message);

        console.log({ res });
        setMessages(res.output);
        setLastResponseId(res.response_id);
    };

    return <div>
        <h1>Mensajes</h1>
        <form onSubmit={(e) => {
            e.preventDefault();
            const message = e.target.elements.message.value;
            onSubmitMessage(message);
        }}>
            <span> {messages && messages[1]?.content} </span>
            <input type="text" name="message" />
            <button type="submit">Enviar</button>
        </form>
    </div>;
};

export default Chat;
