export interface LoadedInstance {
    id?: string;
}

export interface ChatModel {
    key: string;
    displayName: string;
    loadedInstances: LoadedInstance[];
}

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    modelName?: string;
}

export interface StreamMessageParams {
    model: string;
    input: string;
    messages: ChatMessage[];
    conversationId: string | null;
    onToken: (token: string) => void;
}

export interface ChatProviderCapabilities {
    canManageModels: boolean;
}

export interface ChatProvider {
    capabilities: ChatProviderCapabilities;
    listModels(): Promise<ChatModel[]>;
    loadModel(modelKey: string): Promise<{ instanceId: string }>;
    unloadModel(instanceId: string): Promise<void>;
    streamMessage(params: StreamMessageParams): Promise<{ conversationId: string | null }>;
}
