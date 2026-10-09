import { CHIP_FONT_SIZE, COLORS, MONO_FAMILY } from "../theme";

type ValueChipProps = {
    value: string;
    /** "out" = el mensaje que sale, "in" = lo que vuelve. */
    tone?: "out" | "in";
};

/**
 * La burbuja de valor: muestra que vale la variable en este paso del recorrido.
 */
export function ValueChip({ value, tone = "out" }: ValueChipProps) {
    const accent = tone === "out" ? COLORS.outbound : COLORS.inbound;

    return (
        <div
            style={{
                maxWidth: 232,
                padding: "8px 14px",
                borderRadius: 999,
                backgroundColor: COLORS.panelAlt,
                border: `2px solid ${accent}`,
                fontFamily: MONO_FAMILY,
                fontSize: CHIP_FONT_SIZE,
                color: COLORS.text,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                boxShadow: `0 0 26px ${accent}55`,
            }}
        >
            {value}
        </div>
    );
}
