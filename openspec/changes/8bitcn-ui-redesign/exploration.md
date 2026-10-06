# Exploration: 8bitcn/ui full UI redesign

**Change**: `8bitcn-ui-redesign`
**Store**: openspec (file-based)
**Phase**: explore (read-only)
**Date**: 2026-10-06

The app's entire visual layer is Ant Design plus four hand-written CSS files. Replacing it with 8bitcn/ui is a presentation-layer migration whose real cost is the missing foundation: the repo has no Tailwind, no `@/*` alias, no `components.json`, and no `@types/node`. The non-visual layers (`chat/providers`, `helper/serviceHelper`, `store`) stay untouched. This document inventories the current UI, maps every Ant Design surface to its 8bitcn counterpart, lists the decisions that must be closed before proposal, and recommends a phased scope.

## Current State

The app is a single-page React app. All UI is Ant Design v6; `src/index.css` is empty and each component ships its own selector-based CSS.

| File | Lines | Role | Ant Design surface |
|------|-------|------|--------------------|
| `src/main.tsx` | 3 | Entry | imports `antd/dist/reset.css` |
| `src/App.tsx` | 1-2, 24-84 | Shell + header + cards | `Layout`, `Content`, `Card` (`bordered`, `type="inner"`), `Space`, `Tag`, `Typography`, `Button` (`danger`, `loading`), `DownloadOutlined` |
| `src/component/Chat.tsx` | 1-2, 22-78 | Message list + composer | `Flex`, `Input`, `Space.Compact`, `Button` (`primary`, `htmlType="submit"`, `loading`), `Spin`, `Tag`, `Typography`, `SendOutlined` |
| `src/component/ModelList.tsx` | 1, 24-52 | Model picker | `Flex`, `Select` (`showSearch`, `optionFilterProp`), `Tag`, `Typography` |
| `src/component/ProviderSelector.tsx` | 1-2, 89-159 | Provider CRUD dialog | `Flex`, `Select`, `Button`, `Modal`, `Form` + `Form.useForm` + `rules`, `Input`, `Input.Password`, `Space`, `Typography` |
| `src/component/useChat.ts` | 3, 27, 64 | Chat hook | antd `message` toast on send/failure |
| `src/component/useModelList.ts` | 2, 71, 77, 81, 97 | Model lifecycle hook | antd `message` (`info`/`success`/`error`) |
| `src/component/useSelectedModel.ts` | 2, 25, 27, 31 | Unload hook | antd `message` (`info`/`success`/`error`) |
| `src/App.css` | 1-40 | Shell CSS | `.ant-card-body` `!important` override, layout, tag sizing |
| `src/component/Chat.css` | 1-52 | Chat CSS | bubbles, scroll area, hardcoded hex colors |
| `src/component/ModelList.css` | 1-8 | List CSS | `!important` title override, select width |
| `src/component/ProviderSelector.css` | 1-8 | Dialog CSS | select width, warning block |
| `src/index.css` | 0 | Global CSS | empty — no Tailwind |

Non-visual (unchanged by this change): `src/chat/providers/**`, `src/helper/serviceHelper.ts`, `src/helper/chatHelper.ts`, `src/helper/modelHelper.ts`, `src/store/**`, `src/constants/appConstants.ts`.

## Verified Contradiction (briefing vs repo)

The launch briefing stated the alias must be added to `tsconfig.json` **+ `tsconfig.app.json`** and to `resolve.alias` in `vite.config.js`. Only `tsconfig.json` exists (single config, `include: ["src"]`); there is no `tsconfig.app.json` and no `tsconfig.node.json`.

| Briefing claim | Repo reality | Impact |
|----------------|--------------|--------|
| `tsconfig.app.json` exists | Does not exist (`openspec/config.yaml` is the only file under `openspec/`) | Alias setup is simpler: one tsconfig + `vite.config.js` |

Other confirmed facts: `vite.config.js` is plain JS and reads `process.cwd()` / `loadEnv`; `openspec/` currently holds only `config.yaml` (no `specs/`, no `changes/`, no `archive/`).

## 8bitcn Integration Surface

8bitcn/ui is a shadcn registry (copy-paste, MIT). Components land in the repo and resolve as `@/components/ui/8bit`. Foundation: Tailwind v4 + Base UI primitives + cva/clsx/tailwind-merge.

| Current (antd) | 8bitcn target | Notes |
|----------------|---------------|-------|
| `Layout` / `Content` | plain `<main>` + Tailwind utilities | no shell component needed |
| `Card` (incl. `type="inner"`) | 8bit `Card` | `inner` variant is a visual decision, not an API |
| `Tag` | 8bit `Badge` | |
| `Typography.Title/Paragraph/Text` | `<h1>/<p>/<span>` + Tailwind classes | sizing via utility classes |
| `Flex` / `Space` | `div` + Tailwind flex utilities | |
| `Input` / `Input.Password` | 8bit `Input` (and/or `Textarea`) | verify 8bit password/`type` support |
| `Select` (searchable) | 8bit `Combobox` (or `Select`) | `showSearch` → Combobox |
| `Modal` | 8bit `Dialog` (Base UI) | portal/mount behavior differs |
| `Form` + `useForm` + `rules` | manual validation or `react-hook-form` + `zod` | 8bitcn ships **no** form library |
| `Button` (`primary`/`danger`/`loading`) | 8bit `Button` | loading → Spinner or disabled state |
| `Spin` | 8bit `Spinner` / `Progress` | |
| `message.*` toast (imperative) | 8bit `Toast` | cross-cutting: hooks call `message.*` directly |
| `DownloadOutlined` / `SendOutlined` | icon decision (see below) | antd icons would keep `@ant-design/icons` alive |
| `Markdown` (`react-markdown`) | unchanged | only container styling changes |
| `antd/dist/reset.css` | remove | replaced by `@import "tailwindcss"` + 8bit theme |

Preserve without regression: localStorage persist key `mini-chat-ia/providers` (`src/store/providerStore.ts:86`); `role="log"` + `aria-live="polite"` on the message list (`src/component/Chat.tsx:32-33`); form `onSubmit` Enter-to-send (`src/component/Chat.tsx:64`); `canManageModels` branching (`src/App.tsx:19`, `useModelList.ts:23`).

## Approaches

1. **Phased, chained PRs (recommended)** — toolchain first, then shell, then lists/dialogs, then chat + toasts, then delete antd.
   - Pros: each slice fits the 400-line review budget; incremental verification; antd and Tailwind coexist only temporarily.
   - Cons: two UI systems present until the final slice; requires disciplined scope per slice.
   - Effort: High overall, Low per slice.

2. **Big-bang single change** — set up toolchain and migrate all four components at once.
   - Pros: one atomic visual language flip; no transitional states.
   - Cons: large diff, likely over budget, hard to bisect regressions.
   - Effort: High, single unreviewable unit.

3. **Dual-run behind a feature flag** — render antd and 8bitcn trees, switch by flag.
   - Pros: instant rollback.
   - Cons: doubles surface for a small app; not justified.
   - Effort: Very High.

## Open Decisions

| # | Decision | Options | Blocking? |
|---|----------|---------|-----------|
| D1 | Provider form validation | manual validators vs `react-hook-form` + `zod` | yes for ProviderSelector |
| D2 | Toast replacement for imperative `message.*` | 8bitcn `Toast` provider + hook vs custom lightweight toast | yes for all hooks |
| D3 | Icon set | `lucide-react` (shadcn default) vs inline SVG vs keep `@ant-design/icons` | yes for shell/chat |
| D4 | 8bitcn theme | pick one of the 9 themes + light/dark; include Retro Mode Switcher / Theme Selector? | no, but affects design |
| D5 | Component path | keep antd's `src/component/` (singular) vs shadcn default `src/components/ui/` | yes for imports |
| D6 | TS 7 preview compatibility | shadcn CLI may inspect `tsconfig`; fallback is manual scaffolding | yes for install |
| D7 | Markdown typography | Tailwind utilities vs `@tailwindcss/typography` | no |
| D8 | antd dependency cleanup | remove `antd` and `@ant-design/icons` from `package.json` in the final slice | no |

## Risks

- **Toolchain prerequisite dominates the change.** No Tailwind, no alias, no `components.json`, no `@types/node`. This slice alone may approach the review budget.
- **TypeScript `^7.0.2` (preview) may break `npx shadcn@latest init/add`.** CLI friction is the highest-uncertainty step; manual registry copy is the fallback.
- **Imperative toast API refactor crosses into hooks.** `message.*` lives in `useChat.ts`, `useModelList.ts`, `useSelectedModel.ts`; those files must change, blurring the "presentation-only" boundary. Keep logic, swap only the notification call.
- **Copy-paste ownership.** 8bitcn components are vendored; no version pin and no upstream updates — maintenance burden moves to this repo.
- **Base UI peer dependencies** (Dialog/Select/Combobox) add runtime deps and portal behavior different from antd Modal.
- **localStorage key must not change**, or users lose saved providers.
- **Dead dependencies** if `antd`/`@ant-design/icons` are not removed in the final slice.
- **Strict lint/type settings**: `noUnusedLocals`, `noUnusedParameters`, and oxlint `react/only-export-components` apply to vendored components.
- **Pixel font loading** for the 8bit look is an asset concern not currently present in the repo.

## Recommended Scope Boundaries

In scope (presentation + scaffolding only):
- `package.json` deps, `tsconfig.json` (alias), `vite.config.js` (alias/plugin), `src/index.css`, `src/main.tsx`
- `src/App.tsx`, `src/App.css`, `src/component/*.tsx`, `src/component/*.css`
- New scaffolding: `components.json`, `src/lib/utils.ts`, `src/components/ui/8bit/**`
- Minimal edits to `useChat.ts`, `useModelList.ts`, `useSelectedModel.ts` (toast call only)
- `src/helper/toastMessages.ts` stays as the string source; wire to the new toast
- Delete `antd` + `@ant-design/icons` last

Out of scope: `src/chat/providers/**`, `src/helper/serviceHelper.ts`, `src/helper/chatHelper.ts`, `src/helper/modelHelper.ts`, `src/store/**`, `src/constants/appConstants.ts`, `src/constants/appConfig.ts` (branding strings unchanged).

## Ready for Proposal

Yes. The inventory, mapping, decisions (D1-D8), and scope boundaries are sufficient to move to proposal. Recommendation: run **sdd-propose** next, choosing the phased/chained-PR approach and closing D1, D2, D3, D5, D6 before design.
