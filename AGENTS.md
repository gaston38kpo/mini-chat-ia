# Project Guidelines

## Tech Stack

- React 19, Vite 8, JavaScript (ES modules), Zustand 5
- Linting: Oxlint with React and Oxc plugins (see `.oxlintrc.json`)
- No TypeScript, test runner, or formatter is configured

## Startup Checklist for Agents

- Read this file plus `package.json` and `openspec/config.yaml` before making substantial changes.
- Keep changes within existing patterns in `src/component`, `src/service`, and `src/store`.
- Run `npm run lint` after meaningful edits.
- Run `npm run build` before finishing.
- Do not add or require tests in this repository.

## Build and Test

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run lint` — run Oxlint
- `npm run preview` — preview the production build
- No test runner is available; do not generate or require tests

## Architecture

Single-page React app organized in three layers under `src/`:

- `src/component/` — React components (e.g., `ModelList.jsx`)
- `src/service/` — Plain async functions that call external APIs with `fetch`
- `src/store/` — Zustand stores for shared state (e.g., `modelStore.js`)

Typical data flow: a component calls a service, the service updates the store, and the component reads from the store.

Layer boundaries:

- Components own rendering and user interactions.
- Services own network calls, response parsing, and API error logging.
- Stores own shared client state and setters.

## Conventions

- Use functional components and React hooks.
- Create Zustand stores with `create()` from `zustand`.
- Keep services as plain async functions using `fetch`; response handling and error logging stay in the service.
- The API base URL is currently hardcoded in `src/service/service.js`.
- Follow the existing file and naming patterns in `src/component`, `src/service`, and `src/store`.
- Respect Oxlint rules; `npm run lint` must pass before finishing.

## Known Pitfalls

- `selectedModel` may be empty during initial render; use defensive UI access patterns when touching model display logic.
- Model unload/load sequencing can race if asynchronous calls are reordered; avoid introducing additional non-awaited transitions in model switching.
- The API host in `src/service/service.js` is environment-specific and currently hardcoded; do not change it unless explicitly requested.

## Spec-Driven Development

This project follows an OpenSpec workflow. Before proposing large or risky changes, review `openspec/config.yaml` for rules on proposals, specifications, design docs, and task breakdowns.

When changes are large or risky, follow OpenSpec proposal/spec/design/task flow before implementation.
