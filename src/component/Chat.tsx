import { SendOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Space, Spin, Tag, Typography } from "antd";
import Markdown from "react-markdown";
import type React from "react";
import type { ChatMessage } from "../chat/providers/chatProvider.contract";
import type { SelectedModel } from "../constants/appConstants";
import "./Chat.css";

const { Title, Text } = Typography;

interface ChatProps {
    selectedModel: SelectedModel;
    messages: ChatMessage[];
    currentMessage: string;
    isSending: boolean;
    onSendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
    onChangeInputText: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Message log and composer. This slice lifts `useChat` into `App`, so the chat
 * state arrives as props instead of being read from the hook here. S4 melts this
 * renderer into `ChroniclePanel`; until then it stays the single chat renderer.
 */
const Chat = ({
    selectedModel,
    messages,
    currentMessage,
    isSending,
    onSendMessage,
    onChangeInputText
}: ChatProps) => {
    return (
        <Flex vertical gap="middle" className="chat-root">
            <Flex justify="space-between" align="center">
                <Title level={5} className="chat-title">Mensajes</Title>
                <Tag>{messages.length}</Tag>
            </Flex>

            <Flex
                vertical
                gap="middle"
                className="chat-messages"
                role="log"
                aria-live="polite"
            >
                {messages.length === 0 && (
                    <Text type="secondary">Aun no hay mensajes en esta conversacion.</Text>
                )}

                {messages.map((message) => {
                    const isUserMessage = message.role === "user";

                    return (
                        <Flex key={message.id} justify={isUserMessage ? "flex-end" : "flex-start"} className="chat-message-row">
                            <div className={`chat-bubble ${isUserMessage ? "chat-bubble-user" : "chat-bubble-assistant"}`}>
                                <Text type="secondary" className="chat-bubble-role">
                                    {isUserMessage ? "Tu" : message.modelName || selectedModel.displayName}
                                </Text>
                                <div className="chat-bubble-content">
                                    <Markdown>{message.content}</Markdown>
                                </div>
                            </div>
                        </Flex>
                    );
                })}

                {isSending && !messages[messages.length - 1]?.content && (
                    <Flex align="center" gap="small">
                        <Spin size="small" />
                        <Text type="secondary">Esperando respuesta...</Text>
                    </Flex>
                )}
            </Flex>

            <form onSubmit={onSendMessage}>
                <Space.Compact className="chat-input-compact">
                    <Input
                        type="text"
                        name="message"
                        value={currentMessage}
                        onChange={onChangeInputText}
                        disabled={isSending}
                        placeholder="Escribe tu mensaje"
                    />
                    <Button type="primary" htmlType="submit" disabled={isSending} loading={isSending} icon={<SendOutlined />}>
                        Enviar
                    </Button>
                </Space.Compact>
            </form>
        </Flex>
    );
};

export default Chat;
