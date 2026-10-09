import { CHIP_FONT_SIZE, COLORS, MONO_FAMILY } from "../theme";

type ValueCharacterProps = {
    /** Lo que va antes del hueco. Es el contenedor que se abre. */
    before: string;
    /** Lo que ocupa el hueco. Es lo que viaja. */
    value: string;
    /** Lo que va despues del hueco. Es el contenedor que se cierra. */
    after: string;
    /** Radio del borde: es lo que hace que el personaje "cambie de forma". */
    radius: number;
    dashed: boolean;
    filled: boolean;
    accent: string;
    /** Escala del "pop". */
    scale: number;
    /** 0..1: cuanto se ve el contenedor. Sube ANTES de que entre el valor. */
    containerOpacity: number;
    /** 0..1: cuanto se ve el valor que ocupa el hueco. */
    payloadOpacity: number;
    /** Cuanto le falta al valor para llegar al hueco, en px. */
    payloadShift: number;
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
 * El personaje: lleva el valor y va cambiando de forma. El contenedor (`before`
 * y `after`) se muestra vacio ANTES de que el valor entre al hueco, para que la
 * transformacion se vea como un proceso y no como un salto magico.
 */
export function ValueCharacter({
    before,
    value,
    after,
    radius,
    dashed,
    filled,
    accent,
    scale,
    containerOpacity,
    payloadOpacity,
    payloadShift,
}: ValueCharacterProps) {
    const ink = filled ? "#ffffff" : COLORS.text;

    const containerStyle = {
        opacity: containerOpacity,
        fontFamily: MONO_FAMILY,
        fontSize: CHIP_FONT_SIZE,
        color: accent,
        whiteSpace: "pre" as const,
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 6,
                maxWidth: 380,
                justifyContent: "flex-end",
            }}
        >
            {before !== "" ? <span style={containerStyle}>{before}</span> : null}

            <div
                style={{
                    opacity: payloadOpacity,
                    transform: `translateX(${payloadShift}px) scale(${scale})`,
                    transformOrigin: "center",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        maxWidth: 340,
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

            {after !== "" ? <span style={containerStyle}>{after}</span> : null}
        </div>
    );
}
