import { Flex, Select, Tag, Typography } from "antd";
import { useModelStore } from "../store/modelStore";
import useModelList from "./useModelList";
import "./ModelList.css";

const { Title } = Typography;

const ModelList = () => {
    const setSelectedModel = useModelStore((state) => state.setSelectedModel);
    const selectedModel = useModelStore((state) => state.selectedModel);
    const { models, loadingKey, canManageModels, onClickModel } = useModelList({ setSelectedModel });
    const isLoading = canManageModels && loadingKey !== null;

    const onSelectModel = (key: string): void => {
        if (key === selectedModel.key) return;

        const model = models.find((item) => item.key === key);

        if (!model) return;

        onClickModel(model.key, model.displayName);
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

            <Select
                className="model-list-select"
                placeholder="Elegí un modelo"
                value={selectedModel.key || undefined}
                loading={isLoading}
                disabled={isLoading || models.length === 0}
                onChange={onSelectModel}
                options={models.map((model) => ({
                    value: model.key,
                    label: model.displayName
                }))}
                showSearch
                optionFilterProp="label"
            />
        </Flex>
    );
};

export default ModelList;
