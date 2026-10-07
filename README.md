# mini-chat-ia

Chat mínimo en React que consume un modelo local de **LM Studio** por su API
OpenAI-compatible (`/v1/chat/completions`), con streaming token por token.

El objetivo es didáctico: entender cómo se consume un API de IA desde el frontend,
sin capas de más.

## Requisitos

- Node 20+
- [LM Studio](https://lmstudio.ai) corriendo con un modelo cargado y el servidor
  local habilitado (pestaña *Developer* → *Start Server*). Por defecto escucha en
  `http://localhost:1234`.

## Empezar

```bash
npm install
npm run dev
```

Abrí la URL que imprime Vite y escribí un mensaje.

## Cómo funciona

Todo el código vive en cuatro archivos:

| Archivo | Rol |
| --- | --- |
| `src/App.tsx` | UI del chat: lista de mensajes + formulario. |
| `src/useLocalChat.ts` | Estado (`messages`, `isSending`) y el caso de uso `send`. |
| `src/lmStudioClient.ts` | El tema del proyecto: `fetch` al API + parseo del stream SSE. |
| `src/types.ts` | El tipo `ChatMessage`. |

Flujo de un mensaje:

1. `App` llama `send(input)` y limpia el campo.
2. `useLocalChat` agrega tu mensaje y un mensaje vacío del asistente, y llama al cliente.
3. `lmStudioClient` hace `POST /v1/chat/completions` con `stream: true` y lee la
   respuesta como Server-Sent Events, entregando cada token por `onToken`.
4. `useLocalChat` va pegando cada token al último mensaje; React re-renderiza.

## Configuración

La URL del backend se puede pisar con `.env` (ver `.env.example`):

```
VITE_LM_STUDIO_URL=http://localhost:1234/v1
```

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run preview` — previsualizar el build
- `npm run lint` — Oxlint
- `npm run typecheck` — `tsc --noEmit`
