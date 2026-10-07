# chat-ui Specification

## Purpose

Presentation surface of the single-page chat app: shell, provider management, model picker, chat, visual identity, and layer boundaries. Replaces Ant Design with 8bitcn/ui components.

## Requirements

### Requirement: Application Shell

The app SHALL render its shell with 8bitcn/ui components, and the final state MUST NOT import `antd` or `@ant-design/icons`.

#### Scenario: Ant Design fully removed

- GIVEN the final slice is merged
- WHEN the source tree is searched for `antd` imports
- THEN no match exists

### Requirement: Fixed Visual Identity

Exactly ONE `.theme-*` class SHALL be set on `<html>`; icons SHALL come from `lucide-react`; the dependency tree MUST NOT contain `nuqs` or `next-themes`.

#### Scenario: Single theme and icon source

- GIVEN the app is loaded
- WHEN `<html>` and icon imports are inspected
- THEN exactly one `.theme-*` class is present
- AND every icon resolves from `lucide-react`, with no `nuqs` or `next-themes` in `package.json`

### Requirement: Provider Persistence

Providers SHALL persist under the unchanged localStorage key `mini-chat-ia/providers`, and the store contract MUST remain unchanged.

#### Scenario: Providers survive reload

- GIVEN a provider was created through the migrated dialog
- WHEN the page reloads
- THEN it is still present
- AND localStorage holds `mini-chat-ia/providers`

### Requirement: Searchable Model Picker

The picker SHALL filter models by query, SHALL reflect asynchronously loaded models, and SHALL disable selection while loading or when empty.

#### Scenario: Filter and async load

- GIVEN models are loading
- WHEN loading completes and the user types a query
- THEN only matching models are shown
- AND selecting one triggers the existing lifecycle unchanged

#### Scenario: Picker unavailable while loading

- GIVEN models are loading or the list is empty
- WHEN the user tries to select
- THEN selection is impossible

### Requirement: Provider Dialog CRUD

The dialog SHALL create, edit, and delete providers. It MUST manually validate `label`, `kind`, and `baseUrl`, SHALL display a field error for each missing value, MUST NOT write to the store while any is invalid, and MUST NOT offer delete when only one provider exists.

#### Scenario: Invalid submit rejected

- GIVEN the create dialog is open
- WHEN the user submits with an empty required field
- THEN a field error appears for that field
- AND no provider is created

#### Scenario: Valid create activates provider

- GIVEN the create dialog has valid values
- WHEN the user submits
- THEN the provider is stored and becomes active
- AND delete is hidden when only one provider exists

### Requirement: Chat Interaction

The message list SHALL keep `role="log"` and `aria-live="polite"`; the composer SHALL send on Enter and MUST be disabled while a send is in progress.

#### Scenario: Live region and streaming

- GIVEN a conversation is in progress
- WHEN the message list is inspected
- THEN it carries `role="log"` and `aria-live="polite"`
- AND streamed tokens append incrementally

#### Scenario: Enter sends when idle

- GIVEN the composer is non-empty and no send is running
- WHEN the user presses Enter
- THEN the message is sent
- AND Enter is ignored while a send is running

### Requirement: Model Unload Gating

The unload control SHALL render only when the active provider reports `capabilities.canManageModels === true`.

#### Scenario: Gating follows capability

- GIVEN the active provider and a selected model
- WHEN the shell renders
- THEN the unload control is present only if `canManageModels` is true

### Requirement: Boundary Preservation

The change MUST NOT modify `src/chat/providers/**`, `src/helper/{serviceHelper,chatHelper,modelHelper}.ts`, `src/store/**`, or `src/constants/**`.

#### Scenario: Non-visual layers unchanged

- GIVEN the completed change
- WHEN those paths are diffed
- THEN no behavioral change exists

### Requirement: Slice Verification Gate

Every slice SHALL end with `npm run lint`, `npm run typecheck`, and `npm run build` passing.

#### Scenario: Exit checks pass

- GIVEN a completed slice
- WHEN the three commands run
- THEN all three exit successfully
