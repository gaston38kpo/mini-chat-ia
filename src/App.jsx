import { Button, Card, Layout, Space, Tag, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import ModelList from "./component/ModelList";
import useSelectedModel from "./component/useSelectedModel";
import Chat from "./component/Chat";
import "./App.css";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

function App() {
    const { selectedModel, isUnloading, onUnloadModel } = useSelectedModel();
    const hasSelectedModel = Boolean(selectedModel.instanceId);

    return (
        <Layout className="app-layout">
            <Content className="app-content">
                <Card bordered={false} className="app-card">
                    <Space direction="vertical" size="large" className="app-stack">

                        <header>
                            <Space direction="vertical" size="small" className="app-stack">

                                <Tag color="blue" className="app-fit-content">Mini Chat</Tag>

                                <Title level={2} className="app-title">
                                    Mini Chat IA para API de LM Studio
                                </Title>

                                <Paragraph type="secondary" className="app-paragraph">
                                    Selecciona un modelo para chatear.
                                </Paragraph>

                            </Space>
                        </header>

                        <Card type="inner" title="Modelos disponibles en LM Studio">
                            <ModelList />
                        </Card>

                        <Card type="inner">
                            <Space direction="vertical" size="small" className="app-stack">

                                <Text type="secondary" className="app-selected-label">
                                    Modelo seleccionado
                                </Text>

                                <Space align="center" wrap>
                                    <Tag
                                        color={hasSelectedModel ? "green" : "default"}
                                        className="app-selected-tag app-fit-content"
                                    >
                                        {selectedModel.displayName || "No hay modelo elegido"}
                                    </Tag>

                                    {hasSelectedModel && (
                                        <Button
                                            danger
                                            size="small"
                                            icon={<DownloadOutlined />}
                                            loading={isUnloading}
                                            disabled={isUnloading}
                                            onClick={onUnloadModel}
                                        >
                                            Desmontar
                                        </Button>
                                    )}
                                </Space>

                            </Space>
                        </Card>

                        {hasSelectedModel && (
                            <Card type="inner" title="Conversacion">
                                <Chat />
                            </Card>
                        )}
                    </Space>
                </Card>
            </Content>
        </Layout>
    );
}

export default App;
