import { useMemo } from "react";
import { createProvider } from "../chat/providers";
import type { ChatProvider } from "../chat/providers/chatProvider.contract";
import { useProviderStore } from "../store/providerStore";

interface UseChatProviderResult {
    provider: ChatProvider | null;
    providerLabel: string;
}

/**
 * Devuelve el ChatProvider del proveedor activo.
 * El provider se memoiza por (kind, baseUrl, apiKey) para que su identidad sea
 * estable entre renders y no re-dispare efectos dependientes.
 */
const useChatProvider = (): UseChatProviderResult => {
    const providers = useProviderStore((state) => state.providers);
    const activeProviderId = useProviderStore((state) => state.activeProviderId);

    const activeProvider = providers.find((provider) => provider.id === activeProviderId) ?? null;
    const kind = activeProvider?.kind ?? null;
    const baseUrl = activeProvider?.baseUrl ?? null;
    const apiKey = activeProvider?.apiKey ?? null;

    const provider = useMemo(() => {
        if (kind === null || baseUrl === null) return null;

        return createProvider(kind, { baseUrl, apiKey: apiKey ?? "" });
    }, [kind, baseUrl, apiKey]);

    return {
        provider,
        providerLabel: activeProvider?.label ?? ""
    };
};

export default useChatProvider;
