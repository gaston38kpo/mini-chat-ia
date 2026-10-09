import { COLORS, MONO_FAMILY } from "../theme";

type FileBadgeProps = {
    file: string;
    phase: "out" | "in";
};

/** Indicador persistente: en que archivo estamos y en que mitad del recorrido. */
export function FileBadge({ file, phase }: FileBadgeProps) {
    const accent = phase === "out" ? COLORS.outbound : COLORS.inbound;

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span
                style={{
                    fontFamily: MONO_FAMILY,
                    fontSize: 23,
                    color: COLORS.text,
                    backgroundColor: COLORS.panelAlt,
                    border: `2px solid ${accent}`,
                    borderRadius: 10,
                    padding: "6px 16px",
                }}
            >
                {file}
            </span>
            <span style={{ fontFamily: MONO_FAMILY, fontSize: 16, color: accent }}>
                {phase === "out" ? "→ sale el mensaje" : "← vuelve la respuesta"}
            </span>
        </div>
    );
}
