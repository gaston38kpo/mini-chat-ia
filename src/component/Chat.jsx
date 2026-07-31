import { SendOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Space, Spin, Tag, Typography } from "antd";
import Markdown from "react-markdown";
import { useModelStore } from "../store/modelStore";
import useChat from "./useChat";

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
        <Flex vertical gap="middle" style={{ width: "100%" }}>
            <Flex justify="space-between" align="center">
                <Title level={5} style={{ margin: 0 }}>Mensajes</Title>
                <Tag>{messages.length}</Tag>
            </Flex>

            <Flex
                vertical
                gap="middle"
                style={{
                    minHeight: 300,
                    maxHeight: 500,
                    overflowY: "auto",
                    padding: 16,
                    border: "1px solid #d9d9d9",
                    borderRadius: 6,
                    background: "#fafafa"
                }}
                role="log"
                aria-live="polite"
            >
                {messages.length === 0 && (
                    <Text type="secondary">Aun no hay mensajes en esta conversacion.</Text>
                )}

                {messages.map((message) => {
                    const isUserMessage = message.role === "user";

                    return (
                        <Flex key={message.id} justify={isUserMessage ? "flex-end" : "flex-start"} style={{ width: "100%" }}>
                            <div
                                style={{
                                    maxWidth: "80%",
                                    padding: 12,
                                    borderRadius: 6,
                                    border: isUserMessage ? "1px solid #91d5ff" : "1px solid #d9d9d9",
                                    background: isUserMessage ? "#e6f7ff" : "#ffffff"
                                }}
                            >
                                <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase", fontWeight: 600 }}>
                                    {isUserMessage ? "Tu" : message.role || selectedModel.displayName}
                                </Text>
                                <div style={{ marginTop: 8 }}>
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
                <Space.Compact style={{ width: "100%" }}>
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
