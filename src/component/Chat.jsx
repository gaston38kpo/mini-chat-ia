import React from "react";
import Markdown from "react-markdown";
import { useModelStore } from "../store/modelStore";
import { Comment } from "react-loader-spinner";
import useChat from "./useChat";
import "./Chat.css";

const Chat = () => {
    const selectedModel = useModelStore((state) => state.selectedModel);
    const setLastResponseId = useModelStore((state) => state.setLastResponseId);
    const {
        messages,
        currentMessage,
        isSending,
        onSendMessage,
        onChangeInputText
    } = useChat({ selectedModel, setLastResponseId });

    return <div className="chat-container">
        <h1>Mensajes</h1>
        <div className="chat-messages">
            {messages.map((message) => (
                <p key={message.id} className="chat-message">
                    <Markdown>{message.content}</Markdown>
                    <span>{message.role || selectedModel.displayName}</span>
                </p>
            ))}

            {isSending && (
                <div>
                    <Comment
                        visible={true}
                        height="40"
                        width="40"
                        ariaLabel="comment-loading"
                        wrapperClass="comment-wrapper"
                        color="white"
                        backgroundColor="blue"
                    />
                </div>
            )}
        </div>
        <form onSubmit={onSendMessage} className="chat-form">
            <input
                type="text"
                name="message"
                value={currentMessage}
                onChange={onChangeInputText}
                disabled={isSending}
                className="chat-input"
            />
            <button type="submit" disabled={isSending}>Enviar</button>
        </form>
    </div>;
};

export default Chat;
