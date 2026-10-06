# Proposal: 8bitcn/ui Full UI Redesign

## Why

The entire visual layer is Ant Design v6 plus four hand-written CSS files
(`src/App.css`, `src/component/Chat.css`, `ModelList.css`, `ProviderSelector.css`),
and `src/index.css` is empty with no Tailwind. Replace all of it with **8bitcn/ui**
(shadcn registry: Radix UI + Tailwind v4 + cva). This is a **presentation-layer
migration only**: `src/chat/providers/**`, `src/helper/serviceHelper.ts`,
`src/store/**`, and `src/constants/**` stay untouched.

## Confirmed Decisions

| # | Decision |
|---|----------|
| D1 | Manual validators using shadcn `Field`/`FieldError`; no form deps. RHF + zod is a later escalation, out of scope for v1. |
| D2 | 8bitcn Toast (**sonner**): one `notify()` wrapper, `<Toaster />` mounted once in `App`, `src/helper/toastMessages.ts` stays the string source. Title-only toasts unless variants are trivially available. |
| D3 | Icons: `lucide-react` (already transitive). Delete `@ant-design/icons` in the final slice. |
| D4 | Theme: ONE fixed `.theme-*` class on `<html>`. No `ThemeSelector`/`RetroModeSwitcher` (they pull `nuqs`/`next-themes`). |
| D5 | Library path `src/components/ui/8bit/**`; app components stay in `src/component/` (singular) during migration. |
| D6 | Toolchain resolved by research: `shadcn@4.21.3` works (CLI parses tsconfig with bundled `ts-morph`, not project TS). No open question. |

## Scope

### In Scope
- Tailwind v4 via `@tailwindcss/vite` (no PostCSS); `@import "tailwindcss"` in `src/index.css`.
- `@/*` alias via **`paths` only** (TS 7 removed `baseUrl`, error TS5102) plus `resolve.alias` in `vite.config.js` (plain JS, no `@types/node`).
- New scaffolding: `components.json`, `src/lib/utils.ts`, `src/components/ui/8bit/**`.
- Migrate `src/App.tsx`, `src/component/{Chat,ModelList,ProviderSelector}.tsx` and their CSS to 8bit components (Radix base).
- Toast: `notify()` wrapper + sonner `<Toaster />`; swap `message.*` call sites in `useChat.ts`, `useModelList.ts`, `useSelectedModel.ts` (call only, logic unchanged).
- Install `class-variance-authority` and `lucide-react` explicitly — `shadcn add` omits them though generated files import both.
- Vendored-file lint/type exemptions for `noUnusedLocals`/`noUnusedParameters` and oxlint `react/only-export-components`.
- Delete `antd` + `@ant-design/icons` in the final slice.

### Out of Scope
- Non-visual layers: `src/chat/providers/**`, `src/helper/{serviceHelper,chatHelper,modelHelper}.ts`, `src/store/**`, `src/constants/**`.
- `react-hook-form` + `zod` (D1 escalation); `ThemeSelector`/`RetroModeSwitcher` + `next-themes`/`nuqs` (D4).
- Branding strings in `src/constants/appConfig.ts`; a theme picker UI; test tooling (none configured).

## Capabilities

### New Capabilities
- `chat-ui`: redesigned presentation surface — app shell, model list, provider dialog, chat message list and composer, and the single fixed `.theme-*` theme.
- `ui-notifications`: toast notification contract — one `notify()` wrapper over sonner, one `<Toaster />`, title-only messages sourced from `src/helper/toastMessages.ts`.

### Modified Capabilities
- None (no existing specs under `openspec/specs/`; this is a presentation-layer change).

## Phased Slice Plan

Each slice is an independent chained PR with autonomous scope and independent rollback. The toolchain slice alone may approach the 400-line budget.

| Slice | Deliverable | Exit check |
|-------|-------------|------------|
| S1 Toolchain | Tailwind v4 plugin + `@import`, `paths`-only alias, `vite.config.js` alias, `components.json`, `src/lib/utils.ts`, explicit `class-variance-authority`/`lucide-react`, vendored-file exemptions, install required 8bit items via `--dry-run` then real run | `npm run typecheck`, `lint`, `build` pass; no visual change yet |
| S2 Shell | `src/App.tsx` header/cards/shell + `App.css`; keep `canManageModels` branching | App renders on 8bit with antd still present |
| S3 Lists/Dialogs | `ModelList.tsx` (searchable `combo-box`), `ProviderSelector.tsx` (`Dialog` + `Field`/`FieldError` manual validation) + CSS | Model CRUD works end-to-end |
| S4 Chat + Toast | `Chat.tsx` (message list + composer), `notify()` wrapper, `<Toaster />`, swap hook call sites; preserve `role="log"`/`aria-live="polite"` and Enter-to-send | Send/failure toasts, streaming list intact |
| S5 Delete antd | Remove `antd`, `@ant-design/icons` deps and `antd/dist/reset.css` import in `src/main.tsx`; delete leftover CSS | Full green build; grep finds no antd imports |

## Rollback Plan

- **Per slice**: each PR is a work unit; revert its merge commit. S1 is additive (new deps/config) and reverts cleanly without touching UI.
- **Coexistence window**: antd and Tailwind coexist from S1 through S4, so any earlier slice can be reverted while the app still runs on the other system.
- **S5** is the point of no easy return: revert restores `antd`/`@ant-design/icons` deps and the reset import. Keep prior slices green until S5 merges.
- **CLI failure fallback**: if `shadcn add` fails, fetch `https://8bitcn.com/r/<slug>.json` and vendor files manually (research recipe).

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Following shadcn Vite guide literally (adds `baseUrl`) breaks `typecheck` | High | Use `paths` only; TS5102 documented in research |
| `add` omits `lucide-react`/`class-variance-authority` → build fails | High | Install explicitly in S1 |
| Imperative `message.*` swap reaches into hooks (blurs "presentation-only") | Med | Swap notification call only; call sites stay, logic unchanged |
| Vendored 8bit files trip strict lint/type rules | Med | Exempt vendored dir in S1 |
| Duplicate Google-Fonts `@import` injected by `retro.css` per component | Med | Self-host/consolidate font in S1–S2 |
| Dialog/Select portal behavior differs from antd Modal | Med | Verify in S2–S4; Radix base confirmed |
| Regression in persisted/accessible behavior | Med | Preserve `mini-chat-ia/providers` key, `role="log"`+`aria-live="polite"`, Enter-to-send, `canManageModels` |
| Copy-paste ownership: no version pin/upstream updates | Low | Vendored, documented as repo-owned |

## Impact (Files / Areas)

| Area | Impact | Description |
|------|--------|-------------|
| `package.json` | Modified | Add Tailwind/cva/lucide/radix/sonner/cmdk; remove `antd`, `@ant-design/icons` (S5) |
| `tsconfig.json` | Modified | Add `paths` only (no `baseUrl`) |
| `vite.config.js` | Modified | Add Tailwind plugin + `@` alias |
| `src/index.css` | Modified | `@import "tailwindcss"` + theme tokens |
| `components.json`, `src/lib/utils.ts` | New | shadcn config + `cn` helper |
| `src/components/ui/8bit/**` | New | Vendored 8bit components |
| `src/main.tsx` | Modified | Drop `antd/dist/reset.css` |
| `src/App.tsx`, `src/App.css` | Modified | Shell/header/cards → 8bit |
| `src/component/{Chat,ModelList,ProviderSelector}.tsx` + `.css` | Modified | Migrate to 8bit |
| `src/component/useChat.ts`, `useModelList.ts`, `useSelectedModel.ts` | Modified | Toast call swap only |
| `src/helper/toastMessages.ts` | Unchanged | String source for toasts |

## Dependencies

- Node `>=20.18.1` (shadcn CLI 4.21.3); `tailwindcss` + `@tailwindcss/vite` v4; Radix UI (`radix-ui`, `@radix-ui/react-progress`, `@radix-ui/react-scroll-area`), `sonner`, `cmdk`, `class-variance-authority`, `lucide-react`, plus the `cn` helper.

## Success Criteria

- [ ] `npm run lint`, `npm run typecheck`, and `npm run build` pass after every slice.
- [ ] No `antd` or `@ant-design/icons` imports remain; both deps removed from `package.json`.
- [ ] `.theme-*` class set once on `<html>`; no `nuqs`/`next-themes` in the dependency tree.
- [ ] localStorage key `mini-chat-ia/providers` still persists providers across reload.
- [ ] Message list keeps `role="log"` + `aria-live="polite"`; composer keeps Enter-to-send.
- [ ] `canManageModels` branching behavior unchanged.
- [ ] Toasts render via the single `<Toaster />` and `notify()` wrapper.
