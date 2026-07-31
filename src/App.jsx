import { Card, Layout, Space, Tag, Typography } from "antd";
import ModelList from "./component/ModelList";
import { useModelStore } from "./store/modelStore";
import Chat from "./component/Chat";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

function App() {
    const selectedModel = useModelStore((state) => state.selectedModel);
    const hasSelectedModel = Boolean(selectedModel.instanceId);

    return (
        <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
            <Content style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto", width: "100%" }}>
                <Card bordered={false} styles={{ body: { padding: 24 } }}>
                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                        <header>
                            <Space direction="vertical" size="small" style={{ width: "100%" }}>
                                <Tag color="blue" style={{ width: "fit-content" }}>Mini Chat</Tag>
                                <Title level={2} style={{ margin: 0 }}>Mini Chat IA</Title>
                                <Paragraph type="secondary" style={{ margin: 0 }}>
                                    Selecciona un modelo para comenzar la conversacion.
                                </Paragraph>
                            </Space>
                        </header>

                        <Card type="inner" title="Modelos disponibles">
                            <ModelList />
                        </Card>

                        <Card type="inner">
                            <Space direction="vertical" size="small" style={{ width: "100%" }}>
                                <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase" }}>
                                    Modelo seleccionado
                                </Text>
                                <Tag color={hasSelectedModel ? "green" : "default"} style={{ width: "fit-content", fontSize: 14 }}>
                                    {selectedModel.displayName || "No hay modelo elegido"}
                                </Tag>
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
