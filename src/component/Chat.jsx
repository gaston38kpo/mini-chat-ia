import { SendOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Space, Spin, Tag, Typography } from "antd";
import Markdown from "react-markdown";
import { useModelStore } from "../store/modelStore";
import useChat from "./useChat";
import "./Chat.css";

const { Title, Text } = Typography;

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
                                    {isUserMessage ? "Tu" : message.role || selectedModel.displayName}
                                </Text>
                                <div className="chat-bubble-content">
                                    <Markdown>{message.content}</Markdown>
                                </div>
                            </div>
                        </Flex>
                    );
                })}

                {isSending && (
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
