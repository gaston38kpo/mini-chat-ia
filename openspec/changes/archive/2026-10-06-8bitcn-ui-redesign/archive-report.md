# Archive Report: 8bitcn/ui Full UI Redesign

| Field | Value |
|-------|-------|
| Change | `8bitcn-ui-redesign` |
| Artifact store | openspec (file-based) |
| Archived to | `openspec/changes/archive/2026-10-06-8bitcn-ui-redesign/` |
| Archive date | 2026-10-06 |
| Branch | `feat/8bitcn-ui-redesign` @ `ee8c17e` |
| Verification outcome | PASS WITH WARNINGS — 14/14 requirements, 17/17 scenarios, 0 CRITICAL |
| Cycle status | COMPLETE |

## Final State (authoritative at close)

This report describes the change AT CLOSE. Per the Final-State Authority hierarchy, the final-state facts supplied at close outrank the intermediate `apply-progress` (Engram #306) and `verify-report` snapshots; snapshot-derived statements are attributed to their source and time.

- **All 5 slices applied and committed** on `feat/8bitcn-ui-redesign`: S1 `e090c9a` (toolchain), S2 `5dafd75` (RPG shell), S3 `0612dae` (roster + dialogs), S4 `2a8dacc` (chronicle + toast), S5 `ee8c17e` (delete antd).
- **Ant Design fully removed**: `antd` and `@ant-design/icons` removed from `package.json`; the `antd/dist/reset.css` import dropped from `src/main.tsx`; `grep` finds 0 antd references in `src/**`.
- **Final build green**: `lint` exit 0, `typecheck` exit 0, `build` exit 0; 2216 modules; JS 550.89 kB, CSS 99.54 kB, self-hosted font 12.51 kB.
- **Protected layers byte-identical** to the branch point `e090c9a^` (empty diff): `src/chat/providers/**`, `src/helper/{serviceHelper,chatHelper,modelHelper}.ts`, `src/store/**`, `src/constants/**`.
- **Verification**: PASS WITH WARNINGS — 14/14 requirements and 17/17 scenarios compliant; no CRITICAL findings.

## Task Completion Gate

The persisted tasks artifact (`tasks.md`) shows **26/26 implementation tasks checked `[x]`** across Phases 1–5 (S1–S5). No stale unchecked implementation tasks remained, so no archive-time reconciliation was required. The archived `tasks.md` carries the complete audit trail.

## Specs Synced

`openspec/specs/` was **empty** (0 entries) at close. No main spec existed for either capability, so each delta spec IS a full spec and was copied mechanically into the canonical location. **No destructive deltas were merged** — the `openspec/config.yaml` `archive` rule "Warn before merging destructive deltas" therefore **did not trigger** (there was nothing to remove, modify, or rename against an existing main spec).

| Domain | Action | Details |
|--------|--------|---------|
| `chat-ui` | Created | New capability. Full spec copied: 9 requirements, 12 scenarios (app shell, fixed visual identity, provider persistence, searchable model picker, provider dialog CRUD, chat interaction, model unload gating, boundary preservation, slice verification gate). |
| `ui-notifications` | Created | New capability. Full spec copied: 5 requirements, 5 scenarios (single toast host, imperative notify wrapper, message source, notification-only hook changes, failure notifications). |

**Source of truth updated:**
- `openspec/specs/chat-ui/spec.md`
- `openspec/specs/ui-notifications/spec.md`

## Archive Contents

All artifacts preserved; none dropped.

- `proposal.md`
- `exploration.md`
- `research.md`
- `specs/chat-ui/spec.md`
- `specs/ui-notifications/spec.md`
- `design.md`
- `tasks.md` (26/26 complete)
- `verify-report.md`
- `archive-report.md` (this file, additive)

## Mechanical Copy Verification

The archive move is a mechanical filesystem operation; no artifact content passed through the model Read/Write path. Directory rename (`git mv`/`mv`) is blocked inside this workspace by the runtime directory watcher (Windows `Permission denied` on directory rename, reproduced on a fresh test directory), so the move used native `cp -R` + `diff -r` readback + `rm -rf` of the source — still shell-only, byte-identical, and independently verified.

**Verbatim `diff -r` readback output — Step 2 (spec promotion):**
```
=== readback: diff -r openspec/changes/8bitcn-ui-redesign/specs/chat-ui/spec.md openspec/specs/chat-ui/.spec.md.8wIo6M ===
diff_status=0  (0 = empty = pass)
=== final: diff -r openspec/changes/8bitcn-ui-redesign/specs/chat-ui/spec.md openspec/specs/chat-ui/spec.md ===
final_diff_status=0  (0 = empty = pass)
=== readback: diff -r openspec/changes/8bitcn-ui-redesign/specs/ui-notifications/spec.md openspec/specs/ui-notifications/.spec.md.r0QPpd ===
diff_status=0  (0 = empty = pass)
=== final: diff -r openspec/changes/8bitcn-ui-redesign/specs/ui-notifications/spec.md openspec/specs/ui-notifications/spec.md ===
final_diff_status=0  (0 = empty = pass)
```

**Verbatim `diff -r` readback output — Step 3 (archive move):**
```
=== readback 1: diff -r openspec/changes/8bitcn-ui-redesign openspec/changes/archive/2026-10-06-8bitcn-ui-redesign ===
diff_status=0  (0 = empty = pass)
=== readback 2: diff -r /tmp/sdd-archive.WKnFzf/source openspec/changes/archive/2026-10-06-8bitcn-ui-redesign ===
diff_status=0  (0 = empty = pass)
```

Empty `diff -r` output (no differences) is the only passing evidence; both readbacks are empty. `archive-report.md` is additive-only and excluded from the source/destination comparison because it did not exist in the source change folder.

## Accepted Warnings (non-blocking)

- **W1 — Historical per-slice exit checks not independently re-executed.** Per `verify-report` at verification time, S1–S3 commits were not re-run because S5 removed `antd` from `node_modules`, making earlier commits non-rebuildable without reinstalling their dependencies (`package-lock.json` is gitignored). Final state confirms the trio (`lint`/`typecheck`/`build`) green on the completed state. **Accepted as non-blocking.**
- **W2 — Pre-existing `useModelList.ts` unhandled rejection.** `src/component/useModelList.ts` `unloadInstances()` cleanup lacks a `.catch`; an aborted `listModels` becomes an unhandled rejection. Present before this change (both at `e090c9a^` and current) and not introduced or worsened by it. **Accepted as non-blocking; retained as an open follow-up.**

## Accepted Size Exceptions

The default 400-changed-line review budget was exceeded by two slices and explicitly accepted by the user:

| Slice | Authored lines | Status |
|-------|----------------|--------|
| S2 Shell | 465 | `size:exception` — accepted by user |
| S3 Roster & dialogs | 489 | `size:exception` — accepted by user |
| S4 Chronicle & toast | 325 | Within budget |
| S5 Delete antd | 13 | Within budget |

## Delivery

- Chained PRs, **stacked-to-main**; **no PRs opened** (human decision).
- The branch stacks on `feat/pluggable-chat-providers`, which is 8 commits ahead of `main` and unmerged — PRs targeting `main` would include those commits.

## Native Review

Not available in this runtime: `gentle-ai 4.0.0` reports that opencode is not eligible for immutable receipt review. The user chose slice exit checks plus manual inspection. **No native receipt exists** for this change.

## Follow-up (open, out of scope)

- Pre-existing `src/component/useModelList.ts` `unloadInstances()` unhandled rejection (W2). Still deferred; out of this change's scope.

## Artifact Provenance

| Artifact | Source read | Observation / path |
|----------|-------------|--------------------|
| proposal | file | `openspec/changes/8bitcn-ui-redesign/proposal.md` |
| specs | file | `openspec/changes/8bitcn-ui-redesign/specs/{chat-ui,ui-notifications}/spec.md` |
| design | file | `openspec/changes/8bitcn-ui-redesign/design.md` |
| tasks | file | `openspec/changes/8bitcn-ui-redesign/tasks.md` |
| verify-report | file | `openspec/changes/8bitcn-ui-redesign/verify-report.md` |
| apply-progress | Engram | `sdd/8bitcn-ui-redesign/apply-progress` (observation #306) |

## SDD Cycle Complete

The change has been fully planned, implemented, verified, and archived. The two new capability specs are now the project's source of truth. Ready for the next change.
