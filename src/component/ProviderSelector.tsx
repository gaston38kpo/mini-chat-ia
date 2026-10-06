import { useState } from "react";
import { Button, Flex, Form, Input, Modal, Select, Space, Typography } from "antd";
import { useProviderStore, type ProviderConfig } from "../store/providerStore";
import type { ProviderKind } from "../chat/providers";
import "./ProviderSelector.css";

const { Text } = Typography;

const KIND_OPTIONS: Array<{ value: ProviderKind; label: string }> = [
    { value: "openai-compatible", label: "OpenAI-compatible (proxy, p. ej. OpenCode Go)" },
    { value: "lmstudio", label: "LM Studio" }
];

interface ProviderFormValues {
    label: string;
    kind: ProviderKind;
    baseUrl: string;
    apiKey?: string;
}

const ProviderSelector = () => {
    const providers = useProviderStore((state) => state.providers);
    const activeProviderId = useProviderStore((state) => state.activeProviderId);
    const setActiveProvider = useProviderStore((state) => state.setActiveProvider);
    const addProvider = useProviderStore((state) => state.addProvider);
    const updateProvider = useProviderStore((state) => state.updateProvider);
    const removeProvider = useProviderStore((state) => state.removeProvider);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingProvider, setEditingProvider] = useState<ProviderConfig | null>(null);
    const [form] = Form.useForm<ProviderFormValues>();

    const openCreateModal = (): void => {
        setEditingProvider(null);
        form.resetFields();
        form.setFieldsValue({ kind: "openai-compatible", label: "", baseUrl: "", apiKey: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (): void => {
        const current = providers.find((provider) => provider.id === activeProviderId);

        if (!current) return;

        setEditingProvider(current);
        form.setFieldsValue(current);
        setIsModalOpen(true);
    };

    const closeModal = (): void => {
        setIsModalOpen(false);
        setEditingProvider(null);
    };

    const onSubmit = async (): Promise<void> => {
        let values: ProviderFormValues;

        try {
            values = await form.validateFields();
        } catch {
            return;
        }

        const payload = {
            label: values.label.trim(),
            kind: values.kind,
            baseUrl: values.baseUrl.trim(),
            apiKey: (values.apiKey ?? "").trim()
        };

        if (editingProvider) {
            updateProvider(editingProvider.id, payload);
        } else {
            const id = addProvider(payload);

            setActiveProvider(id);
        }

        closeModal();
    };

    const onDelete = (): void => {
        if (!editingProvider || providers.length <= 1) return;

        removeProvider(editingProvider.id);
        closeModal();
    };

    return (
        <Flex vertical gap={8} className="provider-selector">
            <Text type="secondary">Proveedor</Text>

            <Space wrap>
                <Select
                    className="provider-selector-select"
                    value={activeProviderId ?? undefined}
                    placeholder="Elegí un proveedor"
                    onChange={setActiveProvider}
                    options={providers.map((provider) => ({
                        value: provider.id,
                        label: provider.label
                    }))}
                />

                <Button onClick={openEditModal} disabled={!activeProviderId}>
                    Editar
                </Button>

                <Button type="primary" onClick={openCreateModal}>
                    Agregar
                </Button>
            </Space>

            <Text type="warning" className="provider-selector-warning">
                Las API keys se guardan en este navegador (localStorage). Un backend que no esté
                proxeado en el dev server puede fallar por CORS.
            </Text>

            <Modal
                open={isModalOpen}
                title={editingProvider ? "Editar proveedor" : "Agregar proveedor"}
                okText={editingProvider ? "Guardar" : "Agregar"}
                cancelText="Cancelar"
                onOk={onSubmit}
                onCancel={closeModal}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="label"
                        label="Nombre"
                        rules={[{ required: true, message: "Ponele un nombre" }]}
                    >
                        <Input placeholder="OpenCode Go" />
                    </Form.Item>

                    <Form.Item name="kind" label="Tipo" rules={[{ required: true }]}>
                        <Select options={KIND_OPTIONS} />
                    </Form.Item>

                    <Form.Item
                        name="baseUrl"
                        label="URL base"
                        rules={[{ required: true, message: "La URL base es obligatoria" }]}
                        extra="Relativa para usar el proxy de Vite (p. ej. /opencode-go) o absoluta para un backend propio."
                    >
                        <Input placeholder="/opencode-go" />
                    </Form.Item>

                    <Form.Item name="apiKey" label="API key">
                        <Input.Password placeholder="Opcional" autoComplete="off" />
                    </Form.Item>
                </Form>

                {editingProvider && providers.length > 1 && (
                    <Button danger onClick={onDelete}>
                        Eliminar proveedor
                    </Button>
                )}
            </Modal>
        </Flex>
    );
};

export default ProviderSelector;
