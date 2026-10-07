# Research: 8bitcn/ui redesign — findings and decisions

> **Provenance note:** The SDD-native `sdd-research` agent was unavailable in this runtime (it refused because the runtime declared no `documentation`/`open-web` grants). This research was completed by a generic worker using `websearch`/`webfetch` plus live CLI and compiler probes in throwaway directories. The prior blocked-state body has been replaced with the real research.

| Field | Value |
|-------|-------|
| Change | `8bitcn-ui-redesign` |
| Store | openspec (file-based) |
| Phase | research |
| Date | 2026-10-06 |
| Status | `complete` — external claims sourced, highest-uncertainty item (D6) empirically resolved |

## Answer first

**D6 is no longer a risk.** `npx shadcn@4.21.3 add @8bitcn/<name>` was run live against a throwaway Vite-shaped project with a **single `tsconfig.json`** and it resolved and wrote files to `src/components/ui/8bit/...`. The CLI does **not** use the project's TypeScript; it parses tsconfig with its bundled `ts-morph` compiler.

**The biggest trap is elsewhere:** TypeScript `7.0.2` (this repo's compiler, and the current npm `latest`) **removed the `baseUrl` option** — `error TS5102`. The shadcn Vite docs tell you to add `baseUrl` + `paths`; doing that here would **break `npm run typecheck`**. Use `paths` **only**.

### Decisions (D1, D2, D3, D5, D6)

| # | Decision | Recommendation | Confidence |
|---|----------|----------------|------------|
| D1 | Provider form validation | Use shadcn `Field` + `FieldError` with lightweight manual validators for the 2-field dialog; adopt `react-hook-form` + `zod` (the documented shadcn standard) only if the form grows. | High |
| D2 | Toast | Adopt 8bitcn Toast (**sonner**-based). Keep hook call sites; introduce one `notify()` wrapper that calls `toast(...)`; mount `<Toaster />` once in `App`. | High |
| D3 | Icons | Use **`lucide-react`** (already pulled transitively by the shadcn `select`/`sonner` items). Delete `@ant-design/icons`. | High |
| D5 | Component path | Canonical `src/components/ui/8bit/**` (verified install target). Keep the existing `src/component/` for app-level components during migration. | High |
| D6 | TS7 / single tsconfig / Vite 8 | CLI works; **omit `baseUrl`**, rely on `paths`. Keep a manual vendoring fallback. | High |

### Headline corrections to the exploration document

1. **8bitcn is built on Radix UI, not Base UI.** The exploration states "Foundation: Tailwind v4 + Base UI primitives". Verified false: 8bitcn `button.tsx` imports `Slot` from `radix-ui`; `select.tsx` imports `@radix-ui/react-select`; `alert-dialog.tsx` imports `@radix-ui/react-alert-dialog`. The CLI exposes `-b, --base (base, radix, aria)`; 8bitcn requires the **radix** base.
2. **`baseUrl` must be omitted** (TS 7 removal), contradicting the shadcn Vite install guide which instructs adding it.
3. **There are 21 themes, not 9** (`8bitcn` `app/globals.css` defines 21 `.theme-*` classes).
4. The combobox slug is **`combo-box`**, not `combobox`.

## How evidence was gathered

| Method | What it proves |
|--------|----------------|
| Primary docs (`ui.shadcn.com`, `tailwindcss.com`, `8bitcn.com/docs`) | CLI flags, `components.json` schema, registry/`target` semantics, Tailwind v4 Vite plugin, form + toast guidance |
| npm registry (`registry.npmjs.org`) | exact current versions and React 19 peer ranges |
| `8bitcn.com/r/<slug>.json` fetch | real registry payloads, dependency/registryDependency graph, install targets |
| **Live CLI probe** (`npx shadcn@4.21.3 add ... --dry-run` and real `add`) | `src/` resolution, auto-registration, exact dependency set, slug existence |
| **Live compiler probe** (repo's `typescript@7.0.2` binary) | `baseUrl` removal, `paths`-only works |

Probe commands (throwaway dirs under `%TEMP%`, nothing in this repo was modified):

```bash
npx shadcn@4.21.3 add @8bitcn/button --dry-run --yes
npx shadcn@4.21.3 add @8bitcn/button @8bitcn/card @8bitcn/input @8bitcn/textarea \
  @8bitcn/label @8bitcn/select @8bitcn/combo-box @8bitcn/dialog @8bitcn/alert-dialog \
  @8bitcn/toast @8bitcn/progress @8bitcn/spinner @8bitcn/badge @8bitcn/tabs \
  @8bitcn/scroll-area @8bitcn/theme-selector @8bitcn/retro-mode-switcher --dry-run --yes
node node_modules/typescript/bin/tsc --noEmit -p <tsconfig-with-baseUrl>.json
```

Observed CLI dependency output for the full set: `@radix-ui/react-progress`, `@radix-ui/react-scroll-area`, `cn`, `radix-ui`, `sonner`, `next-themes`, `nuqs`, `cmdk` — 35 files, all landing under `src/`.

## Findings

### Q1 (D6) — shadcn CLI vs TS 7 preview, single `tsconfig.json`, Vite 8

**Verdict: works, with one config correction.**

- CLI version is `shadcn@4.21.3`; it requires Node `>=20.18.1` ([npm](https://registry.npmjs.org/shadcn/latest)). The runtime here is Node 22.
- **The CLI does not use the project's TypeScript.** Its runtime deps include `ts-morph@^26` and `tsconfig-paths@^4`, not `typescript` ([npm](https://registry.npmjs.org/shadcn/latest)). `ts-morph` bundles its own compiler via `@ts-morph/common`, which has **no dependency or peer on `typescript`** ([npm](https://registry.npmjs.org/@ts-morph/common/latest)). So the `typescript@7.0.2` preview in this repo cannot break its AST/tsconfig parsing.
- **A single `tsconfig.json` is fine.** The Vite guide's instruction to edit `tsconfig.json` **and** `tsconfig.app.json` is only because Create Vite scaffolds split configs; the guide explicitly says to skip the alias step if it is already configured, and `components.json` docs say aliases can be backed by `compilerOptions.paths` ([Vite guide](https://ui.shadcn.com/docs/installation/vite), [components.json](https://ui.shadcn.com/docs/components-json)).
- **Live result:** with one `tsconfig.json` and a matching `components.json`, `add` resolved `@8bitcn/button` to `src\components\ui\8bit\button.tsx` (not repo-root `components/`). Hardcoded registry targets **are** remapped through the `src/` prefix.

What the CLI reads/writes:

| Input | How it is used |
|-------|----------------|
| `components.json` | style, `tailwind.css`, `rsc`, `tsx`, `iconLibrary`, `aliases`, and optional `registries` ([docs](https://ui.shadcn.com/docs/components-json)) |
| `tsconfig.json` `compilerOptions.paths` | backs the `@/*` alias so the CLI can resolve/rewrite imports and resolve targets ([docs](https://ui.shadcn.com/docs/components-json)) |
| `components.json.aliases.ui` | destination directory for `registry:ui` items without an explicit target ([registry-item.json](https://ui.shadcn.com/docs/registry/registry-item-json)) |
| registry `files[].target` | when present, overrides the alias-derived path; hardcoded targets are written relative to the project root; `@ui/`, `@components/`, `@lib/`, `@hooks/` placeholders map to the user aliases ([registry-item.json](https://ui.shadcn.com/docs/registry/registry-item-json)) |

**The TS 7 correction (highest-value finding).** Running the repo's actual compiler against a `baseUrl`-bearing config:

```
tsconfig.baseurl.json(8,5): error TS5102: Option 'baseUrl' has been removed.
  Please remove it from your configuration. Use '"paths": {"*": ["./*"]}' instead.
```

`typescript@7.0.2` is the npm `latest` tag (the native port; `latest=7.0.2`, `next=7.1.0-dev`) ([dist-tags](https://registry.npmjs.org/-/package/typescript/dist-tags)). `paths` **without** `baseUrl` (relative to the tsconfig location, with `moduleResolution: "bundler"`) type-checks cleanly.

**Manual fallback** (only if the CLI ever fails):
1. `npx shadcn@4.21.3 view @8bitcn/<slug>` to print the payload, or fetch `https://8bitcn.com/r/<slug>.json` directly.
2. Write `files[].content` to the mapped path (`src/components/ui/8bit/<name>.tsx`, etc.).
3. Install the item's `dependencies` + `registryDependencies` manually (`npm i <pkg>`), and add the `src/lib/utils.ts` `cn` helper.

### Q2 — Tailwind v4 + Vite 8 + React 19

**Verdict: supported; no PostCSS needed.**

- `@tailwindcss/vite@4.3.3` declares `peerDependencies.vite: "^5.2.0 || ^6 || ^7 || ^8"` and is dev-tested against `vite ^8.1.2` ([npm](https://registry.npmjs.org/@tailwindcss/vite/latest)) — Vite 8 is in range.
- Setup is exactly: add the plugin to `vite.config` and `@import "tailwindcss";` in the CSS entry ([Tailwind Vite guide](https://tailwindcss.com/docs/installation/using-vite)). No `tailwind.config.js` and **no PostCSS pipeline**; in Tailwind v4 leave `tailwind.config` blank in `components.json` ([components.json](https://ui.shadcn.com/docs/components-json)).
- No known incompatibility found with React 19 for `@tailwindcss/vite` (it has no React peer). `tailwindcss@4.3.3` is current ([npm](https://registry.npmjs.org/tailwindcss/latest)).

### Q3 — 8bitcn registry mechanics

- **Command form:** `pnpm dlx shadcn@latest add @8bitcn/<slug>` (equivalently `npx shadcn@latest add @8bitcn/<slug>`) ([8bitcn docs](https://8bitcn.com/docs), [README](https://github.com/TheOrcDev/8bitcn-ui)).
- **Registry declaration:** `"@8bitcn": "https://8bitcn.com/r/{name}.json"` under `components.json.registries` ([8bitcn components.json](https://raw.githubusercontent.com/TheOrcDev/8bitcn-ui/main/components.json), [8bitcn docs](https://8bitcn.com/docs)). **Not strictly required** — the live probe resolved `@8bitcn/button` with no `registries` entry and the CLI **auto-wrote** `"@8bitcn": "https://www.8bitcn.com/r/{name}.json"` on a real (non-dry) run. Declaring it explicitly is still recommended for determinism.
- **Install target:** `components/ui/8bit/<name>.tsx` → resolved to `src/components/ui/8bit/<name>.tsx` ([registry targets](https://github.com/TheOrcDev/8bitcn-ui), live probe).
- **Slugs** (all 17 verified present via the live dry-run; source of truth: the docs nav [8bitcn components](https://8bitcn.com/docs/components)):

| Requested | Slug | Notes |
|-----------|------|-------|
| button | `button` | reruns official `button` |
| card | `card` | |
| input | `input` | |
| textarea | `textarea` | |
| label | `label` | |
| select | `select` | |
| combobox | **`combo-box`** | wraps `command` + `popover` + `button`; pulls `cmdk` |
| dialog | `dialog` | |
| alert-dialog | `alert-dialog` | |
| toast | `toast` | wraps `sonner` |
| progress | `progress` | |
| spinner | `spinner` | self-contained inline SVG |
| badge | `badge` | |
| tabs | `tabs` | |
| scroll-area | `scroll-area` | |
| theme-selector | `theme-selector` | **not** under `8bit/`; pulls `nuqs` |
| retro-mode-switcher | `retro-mode-switcher` | **not** under `8bit/`; pulls `next-themes` |

- **Two items install outside `8bit/`** and carry Next-flavored paths: `theme-selector` writes `src/components/select-theme-dropdown.tsx`, `src/components/active-theme.tsx`, `src/lib/themes.ts`, **`src/app/retro-globals.css`**; `retro-mode-switcher` writes `src/components/ui/retro-mode-switcher.tsx` and `src/components/theme-provider.tsx`. Treat these as opt-in (D4) and review `src/app/retro-globals.css` (an `app/` path is a Next.js convention with no meaning in Vite).

### Q4 — Peer dependencies and React 19

Everything the 8bitcn items pull declares React 19 support. **No React 19 conflicts found.**

| Package | Current | React peer | Source |
|---------|---------|------------|--------|
| `radix-ui` (unified) | 1.7.0 | `^19.0.0` included | [npm](https://registry.npmjs.org/radix-ui/latest) |
| `@radix-ui/react-progress` | 1.1.17 | `^19.0.0` included | [npm](https://registry.npmjs.org/@radix-ui/react-progress/latest) |
| `@radix-ui/react-scroll-area` | 1.3.0 | `^19.0.0` included | [npm](https://registry.npmjs.org/@radix-ui/react-scroll-area/latest) |
| `class-variance-authority` | 0.7.1 | none (no React dep) | [npm](https://registry.npmjs.org/class-variance-authority/latest) |
| `cn` (shadcn's clsx+tailwind-merge) | 0.4.0 | none | [npm](https://registry.npmjs.org/cn/latest) |
| `lucide-react` | 1.52.0 | `^19.0.0` included | [npm](https://registry.npmjs.org/lucide-react/latest) |
| `sonner` | 2.0.8 | `^19.0.0` included | [npm](https://registry.npmjs.org/sonner/latest) |
| `next-themes` | 0.4.6 | `^19.0.0` included | [npm](https://registry.npmjs.org/next-themes/latest) |
| `cmdk` | 1.1.1 | `^19.0.0` included | [npm](https://registry.npmjs.org/cmdk/latest) |
| `nuqs` | 2.10.1 | `>=18.2.0 || ^19.0.0-0` | [npm](https://registry.npmjs.org/nuqs/latest) |

**Important gap the CLI does not cover.** A real `add` reported only these npm deps: `@radix-ui/react-progress`, `@radix-ui/react-scroll-area`, `cn`, `radix-ui`, `sonner`, `next-themes`, `nuqs`, `cmdk`. But the generated files also `import` from **`lucide-react`** and **`class-variance-authority`**, which were **not** installed. `cn` has no dependencies ([npm](https://registry.npmjs.org/cn/latest)), so it does not provide them. These are expected to be seeded by `shadcn init`, so a manual/foundation-first install **must add `class-variance-authority` and `lucide-react` explicitly**, or `typecheck`/`build` will fail.

Note the version skew vs 8bitcn's own repo: it pins `lucide-react ^1.23.0`, `sonner ^2.0.7`, `typescript ^6.0.3`, and uses `cn` ([8bitcn package.json](https://raw.githubusercontent.com/TheOrcDev/8bitcn-ui/main/package.json)).

### Q5 (D3) — Icons

- shadcn's default icon library is **`lucide`** (`components.json` schema has `iconLibrary`; the 8bitcn repo sets `"iconLibrary": "lucide"`) ([schema](https://ui.shadcn.com/schema.json), [8bitcn components.json](https://raw.githubusercontent.com/TheOrcDev/8bitcn-ui/main/components.json)).
- `lucide-react` is **already required transitively**: the shadcn `select` item imports `CheckIcon`, `ChevronDownIcon`, `ChevronUpIcon`, and the `sonner` wrapper imports status icons — all from `lucide-react` ([select item](https://ui.shadcn.com/r/styles/new-york-v4/select.json), [sonner item](https://ui.shadcn.com/r/styles/new-york-v4/sonner.json)).
- **No 8bit-specific icon package exists.** 8bitcn's "pixel art" glyphs are inline SVGs inside components (e.g. `spinner`, `retro-mode-switcher`, health bars), not an icon set ([spinner](https://8bitcn.com/r/spinner.json), [retro-mode-switcher](https://8bitcn.com/r/retro-mode-switcher.json)).
- **Lowest-dependency path:** `lucide-react` for the two app icons (`Send`, `Download`) — it is already in the tree, so it adds no new dependency, and it removes `@ant-design/icons` ([npm](https://registry.npmjs.org/lucide-react/latest)). Inline SVG is the zero-dependency alternative if we want zero icon packages.

### Q6 (D2) — Toast

- 8bitcn Toast is built on **sonner**. Its registry item is `registryDependencies: ["sonner"]` and the generated `toast.tsx` imports `toast as sonnerToast from "sonner"` ([toast registry item](https://8bitcn.com/r/toast.json)). The shadcn `sonner` item installs `sonner` + `next-themes` and a `<Toaster />` wrapper ([sonner item](https://ui.shadcn.com/r/styles/new-york-v4/sonner.json)).
- **Imperative from non-component hooks: yes.** 8bitcn exports a module-level function `toast(string)` that calls `sonnerToast.custom(...)`. sonner's `toast()` is an imperative module singleton, so hooks like `useChat.ts`, `useModelList.ts`, `useSelectedModel.ts` can call it directly — no React component needed at the call site ([toast registry item](https://8bitcn.com/r/toast.json), [sonner](https://registry.npmjs.org/sonner/latest)).
- **Idiomatic pattern for this repo:** add one `notify` wrapper (e.g. `src/helper/toast.ts`) that re-exports/maps the 8bitcn `toast`, and swap `message.info/success/error` call sites to it. Mount `<Toaster />` (from `src/components/ui/sonner.tsx`) exactly once in `App`. Keep `src/helper/toastMessages.ts` as the string source.
- **Caveat:** the 8bitcn `toast()` accepts only a `title` string; it does **not** expose sonner's `success`/`error`/`info` variants or descriptions. If the UI needs those, call `sonner` directly with `toast.success(...)` and style via the `<Toaster />` — a small deviation from the 8bitcn wrapper.

### Q7 (D1) — Form validation

- **There is no form-library wrapper in shadcn or 8bitcn**, and no "Base UI form" (the stack is Radix — see correction #1). shadcn documents three form guides: **React Hook Form**, TanStack Form, and Formisch ([form guides index](https://ui.shadcn.com/docs/forms/react-hook-form)). The docs' example uses `react-hook-form` + `zod` + `@hookform/resolvers/zod`, with shadcn `Field`/`FieldLabel`/`FieldError` components for markup ([RHF guide](https://ui.shadcn.com/docs/forms/react-hook-form)).
- `react-hook-form` is React 19-ready per shadcn's status table ([React 19 guide](https://ui.shadcn.com/docs/react-19)).
- **Recommendation:** for the single 2-field `ProviderSelector` dialog, use shadcn `Field` + `FieldError` with a small manual validator (zero new deps). Escalate to `react-hook-form` + `zod` + `@hookform/resolvers` if provider-specific rules multiply. This keeps the change presentation-only and avoids three dependencies for two fields.

### Q8 (D4/D5) — Theme + component path

- **Theme mechanism:** CSS variables on `<html>`. Base tokens live in `:root`/`.dark`; each theme is a `.theme-<name>` class. Dark mode is `.dark` plus the variant `@custom-variant dark (&:is(.dark *))`; `--radius` is `0rem` ([8bitcn `app/globals.css`](https://raw.githubusercontent.com/TheOrcDev/8bitcn-ui/main/app/globals.css)).
- **Theme count is 21, not 9:** `.theme-{default,sega,gameboy,atari,nintendo,arcade,neo-geo,soft-pop,vhs,pacman,rusty-byte,zelda,dungeon-torch,space-station,pixel-forest,ice-cavern,lava-core,glitch-mode,dwarven-vault,dragon-hoard,ancient-runes}` ([globals.css](https://raw.githubusercontent.com/TheOrcDev/8bitcn-ui/main/app/globals.css), [theme selector](https://8bitcn.com/r/theme-selector.json)).
- **Toggles:** `RetroModeSwitcher` is a light/dark toggle built on **`next-themes`** ([item](https://8bitcn.com/r/retro-mode-switcher.json)). `ThemeSelector` is a dropdown backed by **`nuqs`** URL state plus `src/lib/themes.ts`/`active-theme.tsx` ([item](https://8bitcn.com/r/theme-selector.json)). For a Vite app both need review: `next-themes@0.4.6` is React-only (peer `react`), not officially Vite-targeted; `nuqs` needs a router adapter, and the item ships `src/app/retro-globals.css` (Next convention). Simplest path: hard-code one `.theme-*` class on `<html>` and offer the `RetroModeSwitcher` only if light/dark is wanted.
- **Component path (D5):** the canonical shadcn path is `components/ui`, so 8bitcn lands in **`src/components/ui/8bit/**`** (verified by the live CLI). This **does not collide** with the existing `src/component/` (singular): `src/component` stays for app-level components during migration; `src/components/ui/8bit` holds the library. `@/lib/utils` → `src/lib/utils.ts`.

## Verified facts

| Fact | Evidence |
|------|----------|
| shadcn CLI 4.21.3 needs Node >=20.18.1 and does not depend on project `typescript` | [npm shadcn](https://registry.npmjs.org/shadcn/latest) |
| `@ts-morph/common` bundles its own TS (no `typescript` dep/peer) | [npm](https://registry.npmjs.org/@ts-morph/common/latest) |
| CLI resolves `@8bitcn/button` to `src/components/ui/8bit/button.tsx` with one `tsconfig.json` | live `add --dry-run` probe |
| CLI auto-writes `registries["@8bitcn"]` on a real `add` | live `add` probe (probe `components.json` after run) |
| TS 7.0.2 removes `baseUrl` (TS5102); `paths`-only compiles | repo's `typescript@7.0.2` binary on a probe config |
| `typescript@7.0.2` is npm `latest` | [dist-tags](https://registry.npmjs.org/-/package/typescript/dist-tags) |
| Tailwind v4 Vite plugin supports Vite 8; no PostCSS | [npm](https://registry.npmjs.org/@tailwindcss/vite/latest), [Tailwind guide](https://tailwindcss.com/docs/installation/using-vite) |
| 8bitcn uses Radix (`radix-ui`, `@radix-ui/react-select`, `@radix-ui/react-alert-dialog`) | [button](https://8bitcn.com/r/button.json), [select](https://8bitcn.com/r/select.json), [alert-dialog](https://8bitcn.com/r/alert-dialog.json) |
| 8bitcn Toast wraps sonner | [toast item](https://8bitcn.com/r/toast.json) |
| shadcn `sonner` item pulls `sonner` + `next-themes` and a `<Toaster />` | [sonner item](https://ui.shadcn.com/r/styles/new-york-v4/sonner.json) |
| `add` omits `lucide-react` and `class-variance-authority` though files import them | live aggregate dry-run output |
| 21 theme classes in 8bitcn globals | [globals.css](https://raw.githubusercontent.com/TheOrcDev/8bitcn-ui/main/app/globals.css) |
| All 17 requested slugs resolve | live aggregate dry-run |
| `theme-selector`/`retro-mode-switcher` install outside `8bit/` | live aggregate dry-run file list |

## Assumptions

| Assumption | Basis | Mitigation |
|------------|-------|------------|
| `shadcn init` seeds `class-variance-authority` + `lucide-react` in a normal setup | The Vite guide says `init` installs dependencies; these are standard shadcn base deps | If using the manual/foundation-first path, add them explicitly (see recipe) |
| Hardcoded registry targets map through `src/` because aliases point at `src` | Observed in probe with `aliases.components="@/components"` + `paths "@/*":["./src/*"]` | Re-verify on the real repo with `--dry-run` before applying |
| `next-themes` works under plain Vite/React 19 | Peer range includes `^19`; no Next import needed | Prefer a direct `.dark` class toggle; add `next-themes` only if the RetroModeSwitcher is adopted |

## Contradictions

| Claim (exploration/briefing) | Reality | Evidence |
|------------------------------|---------|----------|
| 8bitcn foundation is Base UI | Radix UI | [button](https://8bitcn.com/r/button.json), [select](https://8bitcn.com/r/select.json) |
| Add `baseUrl` + `paths` to tsconfig | `baseUrl` removed in TS 7 (TS5102) | [TS 7 probe], [dist-tags](https://registry.npmjs.org/-/package/typescript/dist-tags) |
| ~9 themes | 21 themes | [globals.css](https://raw.githubusercontent.com/TheOrcDev/8bitcn-ui/main/app/globals.css) |
| Combobox slug `combobox` | `combo-box` | [docs nav](https://8bitcn.com/docs/components), [combo-box item](https://8bitcn.com/r/combo-box.json) |
| Alias needs `tsconfig.app.json` | Only one `tsconfig.json` here; alias is `paths`-only | repo `tsconfig.json`, live CLI probe |
| 8bitcn hardcodes Next-style paths, may break Vite `src/` | CLI honors `src/` | live `add --dry-run` output |

## Gaps / unknowns

| Gap | Impact | Mitigation |
|-----|--------|------------|
| `theme-selector` ships `src/app/retro-globals.css` and depends on `nuqs` (router adapter) | Not drop-in for Vite; may write a stray `src/app/` file | Skip ThemeSelector for v1; hard-code one `.theme-*` class; adopt only if needed |
| 8bitcn `toast()` has no `success`/`error`/`info` variants | Hook call sites use `message.info/success/error` | Call `sonner` `toast.*` directly for typed toasts, or accept title-only toasts |
| `retro.css` `@import url(fonts.googleapis.com "Press Start 2P")` is injected per component | Network font fetch; offline/CSP concerns; duplicate import | Self-host the font in `src/` or consolidate into one CSS import |
| Vendored components carry `noUnusedLocals`/`noUnusedParameters` and oxlint `react/only-export-components` exposure | Vendored files may trip strict lint/type rules | Plan a vendored-file lint/type exemption or minimal patches in the install slice |
| CLI's `--base` default for this repo not fixed by probe | Could select base/aria components instead of radix | Set `"style": "new-york"` and rely on the observed radix resolution; if needed add `-b radix` |

## Recommendations (detail)

- **D6 — Toolchain/install.** Run `shadcn add` (it works). Do **not** add `baseUrl`. Manually ensure `class-variance-authority` and `lucide-react` exist. Keep the manual `view`/raw-JSON fallback documented.
- **D5 — Path.** Adopt `src/components/ui/8bit/**`; leave `src/component/` as-is for app components. Add `@/*` → `./src/*` via `paths` (tsconfig) and `resolve.alias` (Vite).
- **D3 — Icons.** `lucide-react` for app icons; delete `@ant-design/icons` in the final slice.
- **D2 — Toast.** sonner via 8bitcn wrapper + single `notify()` module + one `<Toaster />`.
- **D1 — Forms.** shadcn `Field` + manual validation now; RHF + zod as the documented escalation.

## Concrete setup recipe (toolchain slice)

```jsonc
// tsconfig.json — add ONLY paths (no baseUrl: removed in TS 7)
{
  "compilerOptions": {
    /* existing options unchanged */
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

```js
// vite.config.js — add alias without @types/node (config is plain JS)
import { fileURLToPath, URL } from 'node:url'
// ...inside the returned config:
resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } }
```

```css
/* src/index.css */
@import "tailwindcss";
```

```jsonc
// components.json (new, repo root)
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": { "config": "", "css": "src/index.css", "baseColor": "zinc", "cssVariables": true, "prefix": "" },
  "aliases": { "components": "@/components", "utils": "@/lib/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" },
  "iconLibrary": "lucide",
  "registries": { "@8bitcn": "https://8bitcn.com/r/{name}.json" }
}
```

Then: `npm i tailwindcss @tailwindcss/vite class-variance-authority lucide-react` and `npx shadcn@latest add @8bitcn/<slug>`. Verify first with `--dry-run`.

## Risk register

| Risk | Severity | Status |
|------|----------|--------|
| TS 7 `baseUrl` removal breaks typecheck if docs are followed literally | High | **Resolved** — use `paths` only |
| Missing `lucide-react`/`class-variance-authority` after `add` | High | Known — install explicitly |
| Duplicate `app/`-shaped paths from `theme-selector` | Medium | Avoid ThemeSelector in v1 |
| Google-font `@import` injected per component | Medium | Self-host or consolidate |
| Strict lint/type rules vs vendored code | Medium | Add exemptions in toolchain slice |
| Doctor/DRY run needed on the real repo before applying | Low | Run `--dry-run` in the install slice |

## Sources

- shadcn Vite install — https://ui.shadcn.com/docs/installation/vite
- shadcn components.json — https://ui.shadcn.com/docs/components-json
- shadcn registry namespaces — https://ui.shadcn.com/docs/registry/namespace
- shadcn registry-item.json — https://ui.shadcn.com/docs/registry/registry-item-json
- shadcn CLI — https://ui.shadcn.com/docs/cli
- shadcn React Hook Form guide — https://ui.shadcn.com/docs/forms/react-hook-form
- shadcn React 19 guide — https://ui.shadcn.com/docs/react-19
- shadcn Base UI Toast docs — https://ui.shadcn.com/docs/components/base/toast
- shadcn components.json schema — https://ui.shadcn.com/schema.json
- shadcn official `button` item — https://ui.shadcn.com/r/styles/new-york-v4/button.json
- shadcn official `select` item — https://ui.shadcn.com/r/styles/new-york-v4/select.json
- shadcn official `sonner` item — https://ui.shadcn.com/r/styles/new-york-v4/sonner.json
- Tailwind CSS Vite guide — https://tailwindcss.com/docs/installation/using-vite
- 8bitcn docs — https://8bitcn.com/docs
- 8bitcn components index — https://8bitcn.com/docs/components
- 8bitcn repo README — https://github.com/TheOrcDev/8bitcn-ui
- 8bitcn repo components.json — https://raw.githubusercontent.com/TheOrcDev/8bitcn-ui/main/components.json
- 8bitcn repo package.json — https://raw.githubusercontent.com/TheOrcDev/8bitcn-ui/main/package.json
- 8bitcn repo app/globals.css — https://raw.githubusercontent.com/TheOrcDev/8bitcn-ui/main/app/globals.css
- 8bitcn registry items — https://8bitcn.com/r/button.json, `card.json`, `input.json`, `select.json`, `combo-box.json`, `dialog.json`, `alert-dialog.json`, `toast.json`, `spinner.json`, `theme-selector.json`, `retro-mode-switcher.json`
- npm registry — `shadcn`, `@tailwindcss/vite`, `tailwindcss`, `typescript` dist-tags, `ts-morph`, `@ts-morph/common`, `radix-ui`, `@radix-ui/react-select`, `@radix-ui/react-progress`, `@radix-ui/react-scroll-area`, `class-variance-authority`, `cn`, `lucide-react`, `sonner`, `next-themes`, `cmdk`, `nuqs` (latest endpoints on https://registry.npmjs.org)

## Key Learnings

1. The shadcn CLI works against TypeScript 7 because it parses tsconfig with its bundled `ts-morph` compiler rather than the project's `typescript`.
2. TypeScript 7.0.2 removed the `baseUrl` option, so the correct Vite alias config is `paths` only, contradicting the shadcn Vite guide.
3. The CLI resolves 8bitcn's hardcoded registry targets through the `src/` prefix, landing files at `src/components/ui/8bit/` rather than the repo root.
4. 8bitcn components are built on Radix UI, not Base UI as the exploration assumed, and its Toast wraps sonner.
5. Installing 8bitcn items omits `lucide-react` and `class-variance-authority` even though generated files import both.
