# Mini Chat IA

Plantilla base para construir chats de IA con backend **pluggable**. Hoy incluye
dos adaptadores -- LM Studio (gestiona modelos) y cualquier API compatible con
OpenAI -- detras de una sola interfaz (`ChatProvider`). El resto de la app no
sabe cual esta activo. Ver [`docs/arquitectura.md`](docs/arquitectura.md).

## Inicio rapido

```bash
npm install
npm run dev
```

Abre la URL que imprime Vite y elegi un modelo para empezar a chatear.

## Variables de entorno

Crea un `.env` en la raiz. Todas son opcionales:

| Variable | Descripcion | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | URL base del backend. | `http://192.168.1.68:1234/api/v1` |
| `VITE_PROVIDER` | Clave del provider (`lmstudio`, `openai-compatible`). | `lmstudio` |
| `VITE_API_KEY` | API key para backends que la usan. | `""` (vacio) |

## Scripts

| Script | Que hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo de Vite. |
| `npm run build` | Build de produccion. |
| `npm run lint` | Corre Oxlint. |
| `npm run typecheck` | TypeScript en modo `--noEmit`. |
| `npm run preview` | Previsualiza el build. |

## Cambiar de backend

Define `VITE_PROVIDER` con la clave del provider. Para crear uno nuevo, segui
la guia: [`docs/providers.md`](docs/providers.md).

## Usar como plantilla

Este repo es una base reutilizable. El checklist para clonarlo y personalizarlo
esta en [`docs/plantilla.md`](docs/plantilla.md).

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `src/chat/providers/` | Adaptadores `ChatProvider` y el registro. |
| `src/component/` | Componentes y hooks (`Chat.tsx`, `useChat.ts`, ...). |
| `src/helper/` | Transporte (`serviceHelper`) y utilidades. |
| `src/constants/` | Config y env (`appConstants.ts`). |
| `src/store/` | Store Zustand (`modelStore.ts`). |

## Documentacion

- [`docs/arquitectura.md`](docs/arquitectura.md) -- capas, flujo y estado.
- [`docs/providers.md`](docs/providers.md) -- como agregar un provider.
- [`docs/plantilla.md`](docs/plantilla.md) -- usar el repo como base.
