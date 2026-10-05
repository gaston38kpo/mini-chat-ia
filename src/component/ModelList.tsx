import { Button, Flex, List, Tag, Typography } from "antd";
import { useModelStore } from "../store/modelStore";
import useModelList from "./useModelList";
import "./ModelList.css";

const { Title } = Typography;

const ModelList = () => {
    const setSelectedModel = useModelStore((state) => state.setSelectedModel);
    const { models, loadingKey, canManageModels, onClickModel } = useModelList({ setSelectedModel });
    const isLoading = canManageModels && loadingKey !== null;
    const getActionLabel = (key: string): string => {
        if (!canManageModels) return "Elegir";

        return loadingKey === key ? "Montando..." : "Montar";
    };

    return (
        <Flex vertical gap={16}>
            <Flex justify="space-between" align="center" gap={8} wrap>

                <Title level={5} className="model-list-title">
                    Elegí uno
                </Title>

                <Tag>
                    {models.length} disponibles
                </Tag>

            </Flex>

            <List
                bordered
                split
                className="model-list"
                dataSource={models}
                renderItem={(model) => (
                    <List.Item key={model.key} className="model-list-item">
                        <Flex justify="space-between" align="center" gap={12} className="model-list-row" wrap>

                            <span className="model-list-name">
                                {model.displayName}
                            </span>

                            <Button
                                type={canManageModels && loadingKey === model.key ? "dashed" : "primary"}
                                loading={canManageModels && loadingKey === model.key}
                                disabled={isLoading}
                                size="small"
                                onClick={() => onClickModel(model.key, model.displayName)}
                            >
                                {getActionLabel(model.key)}
                            </Button>

                        </Flex>
                    </List.Item>
                )}
            />
        </Flex>
    );
};

export default ModelList;
