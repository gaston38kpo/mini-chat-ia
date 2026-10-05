import { createLmStudioProvider } from "./lmStudioProvider";
import { createOpenAiCompatibleProvider } from "./openAiCompatibleProvider";
import { API_KEY, DEFAULT_API_BASE_URL, PROVIDER_ID } from "../../constants/appConstants";
import type { ChatProvider } from "./chatProvider.contract";

type ProviderFactory = (config: { baseUrl: string; apiKey?: string }) => ChatProvider;

const PROVIDERS: Record<string, ProviderFactory> = {
    lmstudio: createLmStudioProvider,
    "openai-compatible": createOpenAiCompatibleProvider
};

const createProvider = PROVIDERS[PROVIDER_ID] ?? createLmStudioProvider;

export const chatProvider = createProvider({
    baseUrl: DEFAULT_API_BASE_URL,
    apiKey: API_KEY
});
