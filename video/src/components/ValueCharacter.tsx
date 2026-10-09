import { CHIP_FONT_SIZE, COLORS, MONO_FAMILY } from "../theme";

type ValueCharacterProps = {
    /** El valor que lleva el personaje en este momento. */
    value: string;
    /** Radio del borde: es lo que hace que "cambie de forma". */
    radius: number;
    dashed: boolean;
    filled: boolean;
    accent: string;
    /** Escala del "pop" al aterrizar. */
    scale: number;
};

function Eyes({ color }: { color: string }) {
    return (
        <span style={{ display: "flex", gap: 3, flexShrink: 0 }}>
            <span style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: color }} />
            <span style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: color }} />
        </span>
    );
}

/**
 * El personaje: lleva el valor y va cambiando de forma segun en que parte del
 * codigo este. Los dos puntitos son la carita, para que se lea como alguien que
 * viaja por el codigo y no como una etiqueta.
 */
export function ValueCharacter({
    value,
    radius,
    dashed,
    filled,
    accent,
    scale,
}: ValueCharacterProps) {
    const ink = filled ? "#ffffff" : COLORS.text;

    return (
        <div style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    maxWidth: 268,
                    padding: "7px 13px",
                    borderRadius: radius,
                    border: `2px ${dashed ? "dashed" : "solid"} ${accent}`,
                    backgroundColor: filled ? accent : COLORS.panelAlt,
                    fontFamily: MONO_FAMILY,
                    fontSize: CHIP_FONT_SIZE,
                    color: ink,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    boxShadow: `0 0 26px ${accent}66`,
                }}
            >
                <Eyes color={filled ? "#ffffff" : accent} />
                <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {value}
                </span>
            </div>
        </div>
    );
}
