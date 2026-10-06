# Project Guidelines

## Tech Stack

- React 19, Vite 8, TypeScript 7 (strict), Zustand 5
- UI: Tailwind CSS 4 + 8bitcn/Radix (`src/components/ui`), icons `lucide-react`, `cmdk`, notifications `sonner`, markdown `react-markdown`
- Linting: Oxlint with React and Oxc plugins (see `.oxlintrc.json`)
- No test runner or formatter is configured

## Startup Checklist for Agents

- Read this file, `package.json`, and `openspec/config.yaml` before making substantial changes.
- Keep changes within existing patterns in `src/component`, `src/components/ui`, `src/chat/providers`, `src/helper`, `src/store`, and `src/lib`.
- Run `npm run lint` after meaningful edits.
- Run `npm run typecheck` and `npm run build` before finishing.
- Do not add or require tests in this repository.

## Build and Test

- `npm run dev` — start the Vite dev server (includes the `/opencode-go` proxy)
- `npm run build` — production build
- `npm run lint` — run Oxlint
- `npm run typecheck` — run `tsc --noEmit` (plus the vendored checkout)
- `npm run preview` — preview the production build
- No test runner is available; do not generate or require tests

## Architecture

Single-page React app organized in layers under `src/`:

- `src/component/` — RPG console components and hooks (`GameShell.tsx`, `ChroniclePanel.tsx`, `useChat.ts`, ...)
- `src/components/ui/` — vendored 8bitcn/Radix UI (`8bit/`, `sonner`)
- `src/chat/providers/` — `ChatProvider` adapters, the `createProvider` factory, and the `PROVIDERS` registry
- `src/helper/` — transport (`serviceHelper.ts`), notifications (`toast.ts`), and utilities
- `src/constants/` — config and env access (`appConstants.ts`, `appConfig.ts`)
- `src/store/` — Zustand stores (`modelStore.ts`, `providerStore.ts`)
- `src/lib/` — shared utilities (`utils.ts` -> `cn`)

Typical data flow: `useChatProvider` resolves the active provider from
`providerStore` and builds a `ChatProvider` with `createProvider(kind, config)`;
hooks call the provider, update the store, and components read from the store.

Layer boundaries:

- Components and hooks own rendering, user interactions, and local state.
- Provider adapters own network calls, response parsing, and API error logging.
- `src/helper/serviceHelper.ts` owns the protocol-agnostic HTTP/SSE transport.
- Stores own shared client state and setters.
- `src/components/ui/**` is vendored UI; avoid editing it unless truly necessary.

## Conventions

- Use functional components and React hooks.
- Create Zustand stores with `create()` from `zustand`; use `persist` when state must survive reload.
- Keep provider adapters as factories (`create<Name>Provider`) that return a `ChatProvider`.
- UI comes from `@/components/ui` (8bitcn/Radix); the `cn` helper is imported from `src/lib/utils`.
- `.env` is a seed/fallback: providers are chosen in the UI and persisted in `localStorage` (key `mini-chat-ia/providers`).
- Follow existing file and naming patterns in `src/component`, `src/chat/providers`, and `src/store`.
- Respect Oxlint rules; `npm run lint` must pass before finishing.

## Known Pitfalls

- `selectedModel` may be empty during initial render; use defensive UI access patterns when touching model display logic.
- Model unload/load sequencing can race if asynchronous calls are reordered; avoid introducing additional non-awaited transitions in model switching.
- `LM_STUDIO_DEFAULT_BASE_URL` and the `VITE_API_BASE_URL` fallback are development defaults; do not change them unless explicitly requested.
- `OPENCODE_GO_KEY` must NOT use the `VITE_` prefix; with the prefix it would be exposed to the client bundle.
- A backend that is not proxied in the dev server can fail with CORS.

## Spec-Driven Development

This project follows an OpenSpec workflow. Before proposing large or risky changes, review `openspec/config.yaml` for rules on proposals, specifications, design docs, and task breakdowns.

When changes are large or risky, follow the OpenSpec proposal/spec/design/task flow before implementation.
