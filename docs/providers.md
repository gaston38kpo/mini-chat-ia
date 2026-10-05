# Agregar un provider de chat

Agregar un backend nuevo = **un archivo + una linea en el registro**.

El resto de la app (hooks incluidos) ya esta escrito contra la interfaz
`ChatProvider`, asi que no deberias tocar nada mas. Si tuviste que tocar un
hook o un componente, la costura se rompio.

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
3. Registralo en el mapa `PROVIDERS` de `src/chat/providers/index.ts`.
4. Declara `capabilities.canManageModels` (ver abajo).
5. Define `VITE_PROVIDER=<clave>` en tu `.env`.

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

En `src/chat/providers/index.ts`, suma tu factory al mapa y usa la misma clave
en `VITE_PROVIDER`:

```ts
const PROVIDERS: Record<string, ProviderFactory> = {
    lmstudio: createLmStudioProvider,
    "openai-compatible": createOpenAiCompatibleProvider,
    miprovider: createMiProvider // <- nueva linea
};
```

## Regla de capabilities

| `canManageModels` | Que hace la UI |
| --- | --- |
| `true` | Muestra "Montar", desmonta al montar otro modelo y ofrece "Desmontar". |
| `false` | Muestra "Elegir" y no toca modelos. |

**No hay que tocar la UI.** `useModelList`, `useSelectedModel` y `App` ya leen
`chatProvider.capabilities.canManageModels`.

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
- [ ] No toque ningun hook ni componente (si lo hice, la costura se rompio).

## Siguiente paso

Revisa [`arquitectura.md`](./arquitectura.md) para el panorama completo.
