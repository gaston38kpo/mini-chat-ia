import type { CSSProperties } from "react";
import { COLORS, MONO_FAMILY, SANS_FAMILY } from "../theme";

type StatePanelProps = {
    user: string | null;
    assistant: string;
};

function bubbleStyle(role: "user" | "assistant"): CSSProperties {
    const base: CSSProperties = {
        display: "inline-block",
        maxWidth: "88%",
        padding: "10px 16px",
        borderRadius: 16,
        fontFamily: SANS_FAMILY,
        fontSize: 17,
        lineHeight: 1.35,
        whiteSpace: "pre-wrap",
        textAlign: "left",
    };

    return role === "user"
        ? { ...base, backgroundColor: COLORS.crimson, color: "#ffffff" }
        : { ...base, backgroundColor: COLORS.panelAlt, color: COLORS.text };
}

/**
 * La app en miniatura. Refleja el estado real del chat en cada paso, para ver
 * como la respuesta va llenando la burbuja.
 */
export function StatePanel({ user, assistant }: StatePanelProps) {
    return (
        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: COLORS.panel,
                border: `2px solid ${COLORS.border}`,
                borderRadius: 18,
                padding: 20,
                gap: 14,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    fontFamily: SANS_FAMILY,
                    fontSize: 21,
                    fontWeight: 700,
                    color: COLORS.text,
                }}
            >
                🔥 Chat con LM Studio
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                {user === null ? (
                    <div style={{ fontFamily: MONO_FAMILY, fontSize: 14, color: COLORS.muted }}>
                        (todavia no hay mensajes)
                    </div>
                ) : null}

                {user !== null ? (
                    <div style={{ textAlign: "right" }}>
                        <span style={bubbleStyle("user")}>{user}</span>
                    </div>
                ) : null}

                {user !== null ? (
                    <div style={{ textAlign: "left" }}>
                        <span style={bubbleStyle("assistant")}>{assistant || "…"}</span>
                    </div>
                ) : null}
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
                <span
                    style={{
                        flex: 1,
                        fontFamily: MONO_FAMILY,
                        fontSize: 14,
                        color: COLORS.muted,
                        border: `2px solid ${COLORS.border}`,
                        borderRadius: 999,
                        padding: "8px 14px",
                    }}
                >
                    Escribi tu mensaje
                </span>
                <span
                    style={{
                        fontFamily: SANS_FAMILY,
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#ffffff",
                        backgroundColor: COLORS.crimson,
                        borderRadius: 999,
                        padding: "8px 18px",
                    }}
                >
                    Enviar
                </span>
            </div>
        </div>
    );
}
