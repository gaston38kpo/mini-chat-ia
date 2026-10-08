import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CodeBlock } from "../components/CodeBlock";
import { COLORS, MONO_FAMILY, SANS_FAMILY } from "../theme";
import { SNIPPET_FRAMES, SNIPPET_READER, SNIPPET_REQUEST } from "../snippets/lmStudioClient";

type PaneKey = "request" | "reader" | "frames";

/**
 * Los tres pedazos de codigo. Se montan TODOS desde el frame 0 a proposito:
 * asi Shiki resuelve una sola vez y no hay flash al cambiar de panel.
 */
const PANES: { key: PaneKey; code: string }[] = [
    { key: "request", code: SNIPPET_REQUEST },
    { key: "reader", code: SNIPPET_READER },
    { key: "frames", code: SNIPPET_FRAMES },
];

type Beat = {
    from: number;
    to: number;
    pane: PaneKey;
    focus: number[];
    caption: string;
};

/** Los 5 beats del parseo SSE, en frames (30 fps). Total: 360. */
const BEATS: Beat[] = [
    {
        from: 0,
        to: 72,
        pane: "request",
        focus: [1, 2, 7],
        caption: "Le pedimos al modelo con stream: true.",
    },
    {
        from: 72,
        to: 144,
        pane: "request",
        focus: [11, 12],
        caption: "Si la respuesta no es valida, cortamos con un error.",
    },
    {
        from: 144,
        to: 216,
        pane: "reader",
        focus: [1, 2, 3, 6, 10],
        caption: "response.body es un stream de bytes: lo leemos con un reader.",
    },
    {
        from: 216,
        to: 288,
        pane: "frames",
        focus: [1, 2, 4, 5],
        caption:
            "Los eventos se separan con una linea en blanco. El ultimo puede venir cortado: lo guardamos.",
    },
    {
        from: 288,
        to: 360,
        pane: "frames",
        focus: [9, 11, 13, 15],
        caption: "Sacamos el texto del delta y lo emitimos. Un token por vez.",
    },
];

/** Cuantos frames dura el cross-fade entre paneles. */
const FADE = 10;

/** Rango visible de cada panel: de su primer beat a su ultimo. */
const PANE_RANGES = BEATS.reduce<Record<string, [number, number]>>((acc, beat) => {
    const current = acc[beat.pane];
    acc[beat.pane] = current
        ? [Math.min(current[0], beat.from), Math.max(current[1], beat.to)]
        : [beat.from, beat.to];
    return acc;
}, {});

/** Escena 4: el parseo de SSE, paso a paso. Es la escena que ensena. */
export function S04LmStudioClient() {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    const foundIndex = BEATS.findIndex((beat) => frame >= beat.from && frame < beat.to);
    const activeIndex = foundIndex === -1 ? BEATS.length - 1 : foundIndex;
    const activeBeat = BEATS[activeIndex];

    const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill
            style={{ backgroundColor: COLORS.background, opacity: fadeOut, padding: 70 }}
        >
            <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
                <h2
                    style={{
                        margin: 0,
                        fontFamily: SANS_FAMILY,
                        fontSize: 48,
                        color: COLORS.text,
                    }}
                >
                    lmStudioClient.ts
                </h2>
                <span style={{ fontFamily: MONO_FAMILY, fontSize: 24, color: COLORS.orange }}>
                    la leccion
                </span>
            </div>

            <div
                style={{
                    position: "relative",
                    flex: 1,
                    marginTop: 28,
                    backgroundColor: COLORS.codeBg,
                    border: `2px solid ${COLORS.border}`,
                    borderRadius: 18,
                }}
            >
                {PANES.map((pane) => {
                    const [start, end] = PANE_RANGES[pane.key];
                    const opacity = interpolate(
                        frame,
                        [start - FADE, start, end - FADE, end],
                        [0, 1, 1, 0],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    );

                    return (
                        <div
                            key={pane.key}
                            style={{ position: "absolute", inset: "26px 18px", opacity }}
                        >
                            <CodeBlock
                                code={pane.code}
                                lang="ts"
                                focus={activeBeat.pane === pane.key ? activeBeat.focus : []}
                                fontSize={24}
                            />
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 24 }}>
                <div
                    style={{
                        flex: 1,
                        fontFamily: SANS_FAMILY,
                        fontSize: 30,
                        color: COLORS.text,
                        minHeight: 46,
                    }}
                >
                    {activeBeat.caption}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    {BEATS.map((beat, index) => (
                        <div
                            key={beat.from}
                            style={{
                                width: index === activeIndex ? 34 : 12,
                                height: 12,
                                borderRadius: 6,
                                backgroundColor:
                                    index === activeIndex ? COLORS.orange : COLORS.border,
                            }}
                        />
                    ))}
                </div>
            </div>
        </AbsoluteFill>
    );
}
