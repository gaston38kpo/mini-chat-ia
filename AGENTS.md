# Project Guidelines

## What this is
A minimal, deliberately boring React app whose only purpose is to teach how to
consume a local AI model (LM Studio) from the frontend. Keep it small.

## Tech Stack
- React 19, Vite 8, TypeScript 7 (strict)
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- Linting: Oxlint (`.oxlintrc.json`)
- No test runner or formatter is configured

## Startup Checklist for Agents
- Read this file and `package.json` before making substantial changes.
- Run `npm run lint` after edits.
- Run `npm run typecheck` and `npm run build` before finishing.
- Do not add or require tests in this repository.

## Commands
- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the build
- `npm run lint` — Oxlint
- `npm run typecheck` — `tsc --noEmit`

## Architecture
Four files, no layers:

- `src/App.tsx` — chat UI (message list + form); owns the input value.
- `src/useLocalChat.ts` — chat state (`messages`, `isSending`) and `send`.
- `src/lmStudioClient.ts` — the API call: `fetch` to LM Studio's OpenAI-compatible
  `/v1/chat/completions` plus hand-rolled SSE parsing. This file is the lesson.
- `src/types.ts` — `ChatMessage`.

Data flow: `App` -> `useLocalChat` -> `lmStudioClient` -> LM Studio -> tokens back.

## Rules
- Keep it minimal. No state library, no router, no component kit, no extra deps.
- The backend is LM Studio's OpenAI-compatible API. Loading/unloading models is
  done in the LM Studio UI, not in this app.
- Code and comments in English; UI copy stays in Spanish.
- Respect Oxlint rules; `npm run lint` must pass before finishing.
