import { createLmStudioProvider } from "./lmStudioProvider";
import { createOpenAiCompatibleProvider } from "./openAiCompatibleProvider";
import { API_KEY, DEFAULT_API_BASE_URL, PROVIDER_ID } from "../../constants/appConstants";

const PROVIDERS = {
    lmstudio: createLmStudioProvider,
    "openai-compatible": createOpenAiCompatibleProvider
};

const createProvider = PROVIDERS[PROVIDER_ID] ?? createLmStudioProvider;

export const chatProvider = createProvider({
    baseUrl: DEFAULT_API_BASE_URL,
    apiKey: API_KEY
});
