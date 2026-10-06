import { createLmStudioProvider } from "./lmStudioProvider";
import { createOpenAiCompatibleProvider } from "./openAiCompatibleProvider";
import type { ChatProvider } from "./chatProvider.contract";

export type ProviderKind = "lmstudio" | "openai-compatible";

type ProviderFactory = (config: { baseUrl: string; apiKey?: string }) => ChatProvider;

const PROVIDERS: Record<ProviderKind, ProviderFactory> = {
    "lmstudio": createLmStudioProvider,
    "openai-compatible": createOpenAiCompatibleProvider
};

const DEFAULT_PROVIDER_KIND: ProviderKind = "openai-compatible";

/**
 * Construye el ChatProvider para el tipo pedido con su configuracion.
 * El consumidor (hook de UI) decide cual usar segun el proveedor activo.
 */
const createProvider = (
    kind: ProviderKind,
    config: { baseUrl: string; apiKey?: string }
): ChatProvider => {
    const factory = PROVIDERS[kind] ?? PROVIDERS[DEFAULT_PROVIDER_KIND];

    return factory(config);
};

export { createProvider };
