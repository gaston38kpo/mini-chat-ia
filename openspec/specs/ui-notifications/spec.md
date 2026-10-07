# ui-notifications Specification

## Purpose

The toast contract of the app. It defines one imperative notification entry point and one mounted toast host, both built on sonner, with all message strings sourced from the existing helper module.

## Requirements

### Requirement: Single Toast Host

Exactly one `<Toaster />` SHALL be mounted in the application tree; no other component MAY mount another instance.

#### Scenario: One host in the tree

- GIVEN the app is rendered
- WHEN the component tree is inspected
- THEN exactly one `<Toaster />` is mounted

### Requirement: Imperative Notify Wrapper

A single `notify()` function SHALL be the only notification entry point, implemented over sonner. It MUST be callable imperatively from non-component hooks (`useChat.ts`, `useModelList.ts`, `useSelectedModel.ts`) without a React component at the call site.

#### Scenario: Hook calls notify without rendering

- GIVEN `notify()` is imported by a hook
- WHEN the hook invokes it outside render
- THEN a toast is displayed via the mounted host
- AND no component context is required

### Requirement: Message Source

Toast messages SHALL be sourced from `src/helper/toastMessages.ts`, and toasts SHALL be title-only unless variants are trivially available.

#### Scenario: Titles come from the helper

- GIVEN a model load fails
- WHEN the corresponding notification is triggered
- THEN the displayed title equals the `toastMessages.ts` string

### Requirement: Notification-Only Hook Changes

Swapping notification calls in the hooks MUST NOT change hook logic; only the notification call SHALL be replaced.

#### Scenario: Hook behavior unchanged

- GIVEN the migrated hooks
- WHEN send, load, and unload flows run
- THEN their control flow and store interactions match the previous behavior
- AND only the notification call differs

### Requirement: Failure Notifications

Failed send, load, and unload operations SHALL each raise a notification through `notify()`.

#### Scenario: Failure surfaces a toast

- GIVEN a chat send fails
- WHEN the failure is handled
- THEN a toast is displayed through `notify()`
