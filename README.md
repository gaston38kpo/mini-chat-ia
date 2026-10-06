# Mini Chat IA

Plantilla base para construir chats de IA con backend **pluggable**, vestida como
una consola RPG en 8bit. Hoy incluye dos adaptadores -- LM Studio (gestiona
modelos) y cualquier API compatible con OpenAI -- detras de una sola interfaz
(`ChatProvider`). El resto de la app no sabe cual esta activo. Ver
[`docs/arquitectura.md`](docs/arquitectura.md).

## Inicio rapido

```bash
npm install
npm run dev
```

Abre la URL que imprime Vite, elige un proveedor y un modelo para empezar a
chatear. Los proveedores se administran desde la propia UI.

## Variables de entorno

Crea un `.env` en la raiz (base: [`.env.example`](.env.example)). Todas son
opcionales.

El `.env` es una **semilla/fallback**: la app siembra dos proveedores (LM Studio
y OpenCode Go) y los proveedores activos se eligen y editan en la UI, que los
persiste en `localStorage` (clave `mini-chat-ia/providers`).

| Variable | Descripcion | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | URL base de fallback del transporte HTTP. | `http://192.168.1.68:1234/api/v1` |
| `VITE_PROVIDER` | Decide cual proveedor sembrado queda activo (`lmstudio`, `openai-compatible`). | `lmstudio` |
| `VITE_API_KEY` | API key con la que se siembra el proveedor LM Studio. | `""` (vacio) |
| `OPENCODE_GO_KEY` | Secreto del proxy de Vite `/opencode-go`. Va **sin** prefijo `VITE_` para no exponerlo al bundle. | `""` (vacio) |

## Scripts

| Script | Que hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo de Vite (incluye el proxy `/opencode-go`). |
| `npm run build` | Build de produccion. |
| `npm run lint` | Corre Oxlint. |
| `npm run typecheck` | TypeScript en modo `--noEmit` (mas el checkout vendored). |
| `npm run preview` | Previsualiza el build. |

## Cambiar de backend

Elige o agrega un proveedor desde la UI (selector en el HUD). Para crear un
tipo de provider nuevo, sigue la guia:
[`docs/providers.md`](docs/providers.md).

## Usar como plantilla

Este repo es una base reutilizable. El checklist para clonarlo y personalizarlo
esta en [`docs/plantilla.md`](docs/plantilla.md).

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `src/component/` | Componentes y hooks de la consola (`GameShell.tsx`, `ChroniclePanel.tsx`, `useChat.ts`, ...). |
| `src/components/ui/` | UI vendored 8bitcn/Radix (`8bit/`, `sonner`). |
| `src/chat/providers/` | Adaptadores `ChatProvider`, la factory y el registro. |
| `src/helper/` | Transporte (`serviceHelper`) y utilidades (`toast`, helpers). |
| `src/constants/` | Config y env (`appConstants.ts`, `appConfig.ts`). |
| `src/store/` | Stores Zustand (`modelStore.ts`, `providerStore.ts`). |
| `src/lib/` | Utilidades compartidas (`utils.ts` -> `cn`). |

## Documentacion

- [`docs/arquitectura.md`](docs/arquitectura.md) -- capas, flujo y estado.
- [`docs/providers.md`](docs/providers.md) -- como agregar un provider.
- [`docs/plantilla.md`](docs/plantilla.md) -- usar el repo como base.
