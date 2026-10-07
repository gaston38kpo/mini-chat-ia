# Tasks: 8bitcn/ui Full UI Redesign

## Review Workload Forecast

Authored lines (excl. vendored): S1 ~220–350 · S2 ~280–400 · S3 ~250–350 · S4 ~200–300 · S5 ~60–120 · total **~1010–1520**. Vendored `src/components/ui/8bit/**` + `src/components/ui/sonner.tsx` (~35 files, ~2500–3500 lines) excluded. Recommended: stacked-to-main.

Decision needed before apply: No — resolved (chained/stacked-to-main; apply one slice at a time)
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units (test: `npm run lint && npm run typecheck && npm run build`)

- PR1 (S1): toolchain+vendored, no visual change; harness `npm run dev` antd renders; revert deps/config, `src/components/**`, `src/lib/**`.
- PR2 (S2): RPG shell; harness resize lg/md/<md; revert `src/App.tsx`, 5 shell files, `App.css`.
- PR3 (S3): `combo-box`+provider CRUD; harness create→reload persists; revert `ModelList.tsx`, `ProviderSelector.tsx`, 2 CSS.
- PR4 (S4): chronicle+toast; harness send failure→toast; revert `ChroniclePanel.tsx`, `toast.ts`, `sonner.tsx`, 3 hooks.
- PR5 (S5): remove antd; harness `npm run build`+grep; revert `package.json`, `src/main.tsx`, leftover CSS.

## Phase 1: S1 Toolchain [config + vendored]

- [x] 1.1 `npm i tailwindcss @tailwindcss/vite class-variance-authority lucide-react`
- [x] 1.2 `vite.config.js`: add `@tailwindcss/vite` plugin + `@` alias (`node:url`)
- [x] 1.3 `tsconfig.json`: `paths` only (NO `baseUrl`); exclude `src/components/ui/8bit`; add `tsconfig.vendored.json` + `typecheck` run
- [x] 1.4 Create `components.json` (new-york, `@8bitcn`) + `src/lib/utils.ts` (`cn`)
- [x] 1.5 `src/index.css`: `@import "tailwindcss";` + theme vars + one font import
- [x] 1.6 Confirm oxlint `overrides` support in `.oxlintrc.json`; fallback per-file disables
- [x] 1.7 `npx shadcn@4.21.3 add @8bitcn/<slugs> --dry-run --yes` (read-only), then real `add`
- [x] 1.8 Self-host Press Start 2P in `src/`; drop per-component Google `@import`
- [x] 1.9 Exit check: trio green; app unchanged

## Phase 2: S2 Shell / Layout [app]

- [x] 2.1 Create `src/component/GameShell.tsx` (`h-dvh` grid; 4 zone nodes)
- [x] 2.2 Create `src/component/HudBanner.tsx` (title + `ProviderSelector` + configure)
- [x] 2.3 Create `src/component/RosterPanel.tsx` (hosts `ModelList`; `Badge`; gated unmount)
- [x] 2.4 Create `src/component/StatusStrip.tsx` (count, connection, `Progress`)
- [x] 2.5 Create `src/component/ChroniclePanel.tsx` hosting existing `Chat.tsx`
- [x] 2.6 `src/App.tsx`: lift `useChat`, compose zones, mount one `<Toaster />`
- [x] 2.7 `index.html`: static single `class="theme-<name>"` on `<html>`
- [x] 2.8 Delete `src/App.css`; verify `canManageModels` gating + Enter-to-send
- [x] 2.9 Exit check: trio green; zones render at lg/md/<md

## Phase 3: S3 Roster & Dialogs [app]

- [x] 3.1 `src/component/ModelList.tsx` → `combo-box`; disable while loading/empty
- [x] 3.2 `src/component/ProviderSelector.tsx` → `Dialog` + manual `Field`/`FieldError`; hide delete at one provider
- [x] 3.3 `RosterPanel.tsx`: equipped `Badge` + gated unmount (lucide `Download`)
- [x] 3.4 Delete `src/component/ModelList.css`, `src/component/ProviderSelector.css`
- [x] 3.5 Manual: provider create → reload persists under `mini-chat-ia/providers`; invalid submit shows error
- [x] 3.6 Exit check: trio green

## Phase 4: S4 Chronicle, Composer & Toast [app + vendored]

- [x] 4.1 Create `src/helper/toast.ts` (`notify`) + `src/components/ui/sonner.tsx` `<Toaster />`; mount once
- [x] 4.2 `ChroniclePanel.tsx`: `scroll-area` log `role="log"`+`aria-live="polite"`; composer sends on Enter, disabled while sending
- [x] 4.3 Swap `message.*` → `notify()` in `src/component/{useChat,useModelList,useSelectedModel}.ts` (call-only)
- [x] 4.4 Remove `src/component/Chat.tsx`; delete `src/component/Chat.css`
- [x] 4.5 Manual: send failure → toast; live region intact
- [x] 4.6 Exit check: trio green

## Phase 5: S5 Delete antd [config]

- [x] 5.1 Remove `antd` + `@ant-design/icons` from `package.json`; drop `antd/dist/reset.css` in `src/main.tsx`
- [x] 5.2 Delete leftover `src/component/*.css`
- [x] 5.3 Verify `src/**` (read-only) has no antd imports; no `nuqs`/`next-themes` in `package.json` (read-only)
- [x] 5.4 Diff `src/chat/providers/**`, `src/helper/{serviceHelper,chatHelper,modelHelper}.ts`, `src/store/**`, `src/constants/**` (read-only) → unchanged
- [x] 5.5 Exit check: trio green
