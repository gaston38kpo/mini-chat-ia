import { Button, Flex, List, Tag, Typography } from "antd";
import { useModelStore } from "../store/modelStore";
import useModelList from "./useModelList";

const { Title } = Typography;

const ModelList = () => {
    const setSelectedModel = useModelStore((state) => state.setSelectedModel);
    const { models, loadingKey, onClickModel } = useModelList({ setSelectedModel });
    const isLoading = loadingKey !== null;

    return (
        <Flex vertical gap={16}>
            <Flex justify="space-between" align="center" gap={8} wrap>
                <Title level={5} style={{ margin: 0 }}>Elige un modelo y cargalo</Title>
                <Tag>{models.length} disponibles</Tag>
            </Flex>

            <List
                bordered
                split
                dataSource={models}
                renderItem={(model) => (
                    <List.Item key={model.key} style={{ padding: "12px 16px" }}>
                        <Flex justify="space-between" align="center" gap={12} style={{ width: "100%" }} wrap>
                            <span style={{ fontWeight: 500 }}>{model.displayName}</span>
                            <Button
                                type={loadingKey === model.key ? "dashed" : "primary"}
                                loading={loadingKey === model.key}
                                disabled={isLoading}
                                size="small"
                                onClick={() => onClickModel(model.key, model.displayName)}
                            >
                                {loadingKey === model.key ? "Cargando..." : "Cargar"}
                            </Button>
                        </Flex>
                    </List.Item>
                )}
            />
        </Flex>
    );
};

export default ModelList;
