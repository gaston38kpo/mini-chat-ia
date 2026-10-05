# Project Guidelines

## Tech Stack

- React 19, Vite 8, TypeScript 7 (strict), Zustand 5
- Linting: Oxlint with React and Oxc plugins (see `.oxlintrc.json`)
- No test runner or formatter is configured

## Startup Checklist for Agents

- Read this file plus `package.json` and `openspec/config.yaml` before making substantial changes.
- Keep changes within existing patterns in `src/component`, `src/chat/providers`, `src/helper`, and `src/store`.
- Run `npm run lint` after meaningful edits.
- Run `npm run typecheck` and `npm run build` before finishing.
- Do not add or require tests in this repository.

## Build and Test

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run lint` — run Oxlint
- `npm run typecheck` — run `tsc --noEmit` (TypeScript strict type check)
- `npm run preview` — preview the production build
- No test runner is available; do not generate or require tests

## Architecture

Single-page React app organized in layers under `src/`:

- `src/component/` — React components and hooks (e.g., `ModelList.tsx`, `useChat.ts`)
- `src/chat/providers/` — `ChatProvider` adapters and the provider registry (`index.ts`)
- `src/helper/` — transport (`serviceHelper.ts`) and shared utilities
- `src/constants/` — config and env access (`appConstants.ts`, `appConfig.ts`)
- `src/store/` — Zustand stores for shared state (e.g., `modelStore.ts`)

Typical data flow: a component/hook calls `chatProvider` (from `src/chat/providers`), the adapter updates the store through the hook, and the component reads from the store.

Layer boundaries:

- Components and hooks own rendering, user interactions, and local state.
- Provider adapters own network calls, response parsing, and API error logging.
- `src/helper/serviceHelper.ts` owns the protocol-agnostic HTTP/SSE transport.
- Stores own shared client state and setters.

## Conventions

- Use functional components and React hooks.
- Create Zustand stores with `create()` from `zustand`.
- Keep provider adapters as plain async functions; response handling, protocol parsing, and error logging stay in the adapter.
- The API base URL is no longer hardcoded; it comes from `VITE_API_BASE_URL` in `src/constants/appConstants.ts`.
- Follow the existing file and naming patterns in `src/component`, `src/chat/providers`, and `src/store`.
- Respect Oxlint rules; `npm run lint` must pass before finishing.

## Known Pitfalls

- `selectedModel` may be empty during initial render; use defensive UI access patterns when touching model display logic.
- Model unload/load sequencing can race if asynchronous calls are reordered; avoid introducing additional non-awaited transitions in model switching.
- The API host defaults to LM Studio via `VITE_API_BASE_URL` in `src/constants/appConstants.ts`; do not change the default unless explicitly requested.

## Spec-Driven Development

This project follows an OpenSpec workflow. Before proposing large or risky changes, review `openspec/config.yaml` for rules on proposals, specifications, design docs, and task breakdowns.

When changes are large or risky, follow OpenSpec proposal/spec/design/task flow before implementation.
