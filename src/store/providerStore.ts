import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProviderKind } from "../chat/providers";
import { API_KEY, LM_STUDIO_DEFAULT_BASE_URL, PROVIDER_ID } from "../constants/appConstants";

export interface ProviderConfig {
    id: string;
    kind: ProviderKind;
    label: string;
    baseUrl: string;
    apiKey: string;
}

interface ProviderStoreState {
    providers: ProviderConfig[];
    activeProviderId: string | null;
    addProvider: (provider: Omit<ProviderConfig, "id">) => string;
    updateProvider: (id: string, changes: Partial<Omit<ProviderConfig, "id">>) => void;
    removeProvider: (id: string) => void;
    setActiveProvider: (id: string) => void;
}

const LM_STUDIO_PROVIDER_ID = "lmstudio-default";
const OPENCODE_GO_PROVIDER_ID = "opencode-go-default";

/**
 * Semilla inicial: preserva el comportamiento historico (default de LM Studio)
 * y agrega OpenCode Go apuntando al proxy de Vite (`/opencode-go`).
 */
const DEFAULT_PROVIDERS: ProviderConfig[] = [
    {
        id: LM_STUDIO_PROVIDER_ID,
        kind: "lmstudio",
        label: "LM Studio",
        baseUrl: LM_STUDIO_DEFAULT_BASE_URL,
        apiKey: API_KEY
    },
    {
        id: OPENCODE_GO_PROVIDER_ID,
        kind: "openai-compatible",
        label: "OpenCode Go",
        baseUrl: "/opencode-go",
        apiKey: ""
    }
];

const DEFAULT_ACTIVE_PROVIDER_ID = PROVIDER_ID === "openai-compatible"
    ? OPENCODE_GO_PROVIDER_ID
    : LM_STUDIO_PROVIDER_ID;

const createProviderId = (): string => `provider-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const useProviderStore = create<ProviderStoreState>()(
    persist(
        (set) => ({
            providers: DEFAULT_PROVIDERS,
            activeProviderId: DEFAULT_ACTIVE_PROVIDER_ID,

            addProvider: (providerDetails) => {
                const id = createProviderId();

                set((state) => ({
                    providers: [...state.providers, { ...providerDetails, id }]
                }));

                return id;
            },

            updateProvider: (id, changes) => set((state) => ({
                providers: state.providers.map((provider) => (
                    provider.id === id ? { ...provider, ...changes } : provider
                ))
            })),

            removeProvider: (id) => set((state) => {
                const providers = state.providers.filter((provider) => provider.id !== id);
                const activeProviderId = state.activeProviderId === id
                    ? (providers[0]?.id ?? null)
                    : state.activeProviderId;

                return { providers, activeProviderId };
            }),

            setActiveProvider: (id) => set({ activeProviderId: id })
        }),
        { name: "mini-chat-ia/providers" }
    )
);
