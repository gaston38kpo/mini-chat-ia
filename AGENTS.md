# Project Guidelines

## Tech Stack

- React 19, Vite 8, JavaScript (ES modules), Zustand 5
- Linting: Oxlint with React and Oxc plugins (see `.oxlintrc.json`)
- No TypeScript, test runner, or formatter is configured

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

## Conventions

- Use functional components and React hooks.
- Create Zustand stores with `create()` from `zustand`.
- Keep services as plain async functions using `fetch`; response handling and error logging stay in the service.
- The API base URL is currently hardcoded in `src/service/service.js`.
- Follow the existing file and naming patterns in `src/component`, `src/service`, and `src/store`.
- Respect Oxlint rules; `npm run lint` must pass before finishing.

## Spec-Driven Development

This project follows an OpenSpec workflow. Before proposing large or risky changes, review `openspec/config.yaml` for rules on proposals, specifications, design docs, and task breakdowns.
