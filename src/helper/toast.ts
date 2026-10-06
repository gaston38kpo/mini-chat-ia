import { toast } from "sonner";

export type NotifyLevel = "info" | "success" | "error";

/**
 * Single imperative notification entry point for the app. It calls sonner
 * directly so the info/success/error severities are preserved (the 8bitcn
 * `toast()` wrapper is title-only). It is callable from non-component hooks
 * because sonner is an imperative singleton; the one `<Toaster />` host is
 * mounted in `App.tsx`. Message strings stay sourced from `toastMessages.ts`.
 */
export function notify(message: string, level: NotifyLevel = "info"): void {
    if (level === "success") {
        toast.success(message);
        return;
    }

    if (level === "error") {
        toast.error(message);
        return;
    }

    toast.info(message);
}
