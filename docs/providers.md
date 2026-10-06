# Agregar un provider de chat

Agregar un backend nuevo es **un archivo, una entrada en el registro y una opcion
en el selector**.

El resto de la app (hooks incluidos) ya esta escrito contra la interfaz
`ChatProvider`, asi que no deberias tocar nada mas. Si tuviste que tocar un hook,
la costura se rompio.

## La interfaz

`src/chat/providers/chatProvider.contract.ts`:

```ts
export interface ChatProvider {
    capabilities: { canManageModels: boolean };
    listModels(): Promise<ChatModel[]>;
    loadModel(modelKey: string): Promise<{ instanceId: string }>;
    unloadModel(instanceId: string): Promise<void>;
    streamMessage(
        params: StreamMessageParams
    ): Promise<{ conversationId: string | null }>;
}
```

## Camino rapido

1. Crea `src/chat/providers/<nombre>Provider.ts`.
2. Exporta `create<Nombre>Provider({ baseUrl, apiKey })` que devuelva un `ChatProvider`.
3. Suma el `kind` a la union `ProviderKind` de `src/chat/providers/index.ts`.
4. Registra la factory en el mapa `PROVIDERS` (`Record<ProviderKind, ProviderFactory>`).
5. Agrega una opcion en `KIND_OPTIONS` de `src/component/ProviderSelector.tsx`.
6. Declara `capabilities.canManageModels` (ver abajo).
7. Elige el proveedor en la UI. Para que arranque activo por defecto, define
   `VITE_PROVIDER=<kind>` en tu `.env`.

## Esqueleto minimo

```ts
import { headers, request, requestStream } from "../../helper/serviceHelper";
import type { EventSourceMessage } from "eventsource-parser";
import type {
    ChatModel,
    ChatProvider,
    StreamMessageParams
} from "./chatProvider.contract";

interface RawModels {
    data?: Array<{ id: string }>;
}

const createMiProvider = ({
    baseUrl,
    apiKey = ""
}: { baseUrl: string; apiKey?: string }): ChatProvider => ({
    capabilities: { canManageModels: false },

    listModels: async (): Promise<ChatModel[]> => {
        const raw = await request<RawModels>(
            "/models",
            { headers },
            "getModelsList",
            baseUrl
        );

        return (raw?.data ?? []).map((model) => ({
            key: model.id,
            displayName: model.id,
            loadedInstances: []
        }));
    },

    loadModel: async () => {
        throw new Error("model management not supported");
    },

    unloadModel: async () => {
        throw new Error("model management not supported");
    },

    streamMessage: async ({
        model,
        input,
        messages,
        onToken
    }: StreamMessageParams) => {
        await requestStream(
            "/chat/completions",
            {
                method: "POST",
                headers,
                body: JSON.stringify({
                    model,
                    messages: [
                        ...messages.map(({ role, content }) => ({ role, content })),
                        { role: "user", content: input }
                    ],
                    stream: true
                })
            },
            "sendMessage",
            (message: EventSourceMessage) => {
                if (message.data === "[DONE]") return;

                const token = JSON.parse(message.data).choices?.[0]?.delta?.content;

                if (token) onToken(token);
            },
            baseUrl
        );

        return { conversationId: null };
    }
});
```

## Registro

En `src/chat/providers/index.ts`, suma el `kind` a la union y la factory al mapa:

```ts
export type ProviderKind = "lmstudio" | "openai-compatible" | "miprovider";

const PROVIDERS: Record<ProviderKind, ProviderFactory> = {
    "lmstudio": createLmStudioProvider,
    "openai-compatible": createOpenAiCompatibleProvider,
    "miprovider": createMiProvider // <- nueva linea
};
```

`createProvider(kind, config)` construye el `ChatProvider` que corresponda. No
existe un singleton: `useChatProvider` toma el proveedor activo del store y llama
a la factory.

## Como se elige el provider

| Paso | Detalle |
| --- | --- |
| Alta y edicion | Desde `ProviderSelector.tsx` (nombre, tipo, `baseUrl`, `apiKey`). |
| Seleccion | `setActiveProvider(id)` en el selector. |
| Persistencia | `providerStore` (`src/store/providerStore.ts`) con `persist`, clave `mini-chat-ia/providers`. |
| Resolucion | `useChatProvider` busca el activo y memoiza `createProvider(kind, { baseUrl, apiKey })`. |
| Semilla | `VITE_PROVIDER` decide cual proveedor sembrado arranca activo; no es la unica forma de elegir. |

## Regla de capabilities

| `canManageModels` | Que hace la UI |
| --- | --- |
| `true` | Muestra "Montar", desmonta al montar otro modelo y ofrece "Desmontar". |
| `false` | Muestra "Elegir" y no toca modelos. |

**No hay que tocar los hooks por esto.** `useModelList`, `useSelectedModel` y
`RosterPanel` ya leen `provider.capabilities.canManageModels` (via
`useChatProvider`).

## Providers sin estado (stateless)

Un provider tipo OpenAI no manda `previous_response_id`: rearma la conversacion
en cada request. Por eso `streamMessage` **debe agregar el turno actual**:

```ts
messages: [...toApiMessages(messages), { role: "user", content: input }]
```

`messages` que llega desde `useChat` es la conversacion **previa** (el turno
actual todavia no esta). Si lo olvidas, el modelo no vera el ultimo mensaje del
usuario.

## Checklist de verificacion

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] El `kind` figura en `ProviderKind`, en `PROVIDERS` y en `KIND_OPTIONS`.
- [ ] No toque ningun hook (si lo hice, la costura se rompio).

## Siguiente paso

Revisa [`arquitectura.md`](./arquitectura.md) para el panorama completo.
