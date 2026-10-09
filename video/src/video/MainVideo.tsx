import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CodeBlock } from "../components/CodeBlock";
import { FileBadge } from "../components/FileBadge";
import { StatePanel } from "../components/StatePanel";
import { ValueChip } from "../components/ValueChip";
import {
    CODE_FONT_SIZE,
    CODE_LINE_PX,
    COLORS,
    MONO_FAMILY,
    SANS_FAMILY,
} from "../theme";
import {
    ASSISTANT_REPLY,
    INTRO_FRAMES,
    MAIN_VIDEO_DURATION,
    OUTRO_FRAMES,
    SNIPPETS,
    STEPS,
    STEP_FRAMES,
    stepAt,
    stepFrom,
    type SnippetKey,
} from "./steps";

/** Espacio a la derecha del codigo, reservado para el chip flotante. */
const CHIP_GUTTER = 260;
/** Padding vertical del bloque de codigo; el chip se alinea con esto. */
const CODE_PADDING = 24;
/** Frames que tarda el chip en viajar de una linea a la siguiente. */
const TRAVEL = 16;
/** Frames de cross-fade al cambiar de snippet. */
const SNIPPET_FADE = 12;

const SNIPPET_KEYS = Object.keys(SNIPPETS) as SnippetKey[];

/** Rango de frames en que cada snippet esta en pantalla. */
const SNIPPET_RANGES = STEPS.reduce<Record<string, [number, number]>>((acc, step, index) => {
    const start = stepFrom(index);
    const end = start + STEP_FRAMES;
    const current = acc[step.snippet];
    acc[step.snippet] = current
        ? [Math.min(current[0], start), Math.max(current[1], end)]
        : [start, end];
    return acc;
}, {});

/** Centro vertical de una linea del bloque de codigo, en px. */
function lineCenter(line: number): number {
    return CODE_PADDING + (line - 1) * CODE_LINE_PX + CODE_LINE_PX / 2;
}

/**
 * El recorrido de un mensaje, en una sola toma: el codigo va cambiando de
 * archivo mientras el chip de valor viaja por las lineas importantes.
 */
export function MainVideo() {
    const frame = useCurrentFrame();

    const stepIndex = stepAt(frame);
    const step = STEPS[stepIndex];
    const from = stepFrom(stepIndex);

    // El chip viaja de la linea anterior a la nueva, pero solo si seguimos en
    // el mismo snippet. Si cambia el codigo, aparece directo en la linea nueva.
    const target = lineCenter(step.chipLine);
    const prev = STEPS[stepIndex - 1];
    const sameSnippet = prev !== undefined && prev.snippet === step.snippet;
    const chipTop = sameSnippet
        ? interpolate(frame, [from, from + TRAVEL], [lineCenter(prev.chipLine), target], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
          })
        : target;

    const snippetOpacity = (key: SnippetKey): number => {
        const [start, end] = SNIPPET_RANGES[key];
        return interpolate(
            frame,
            [start - SNIPPET_FADE, start, end - SNIPPET_FADE, end],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
    };

    // En el ultimo paso la respuesta se escribe sola, caracter por caracter.
    const isLastStep = stepIndex === STEPS.length - 1;
    const reveal = interpolate(frame, [from, from + STEP_FRAMES - 20], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const assistantText = isLastStep
        ? ASSISTANT_REPLY.slice(0, Math.round(reveal * ASSISTANT_REPLY.length))
        : step.state.assistant;

    const outroStart = MAIN_VIDEO_DURATION - OUTRO_FRAMES;
    const introOpacity = interpolate(
        frame,
        [0, 12, INTRO_FRAMES - 14, INTRO_FRAMES],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const outroOpacity = interpolate(
        frame,
        [outroStart, outroStart + 14, MAIN_VIDEO_DURATION - 12, MAIN_VIDEO_DURATION],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <AbsoluteFill
            style={{
                backgroundColor: COLORS.background,
                padding: 56,
                flexDirection: "column",
                gap: 22,
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <FileBadge file={SNIPPETS[step.snippet].file} phase={step.phase} />
                <span style={{ fontFamily: MONO_FAMILY, fontSize: 16, color: COLORS.muted }}>
                    paso {stepIndex + 1} / {STEPS.length}
                </span>
            </div>

            <div style={{ flex: 1, display: "flex", gap: 40, minHeight: 0 }}>
                <div
                    style={{
                        position: "relative",
                        flex: 1,
                        backgroundColor: COLORS.codeBg,
                        border: `2px solid ${COLORS.border}`,
                        borderRadius: 18,
                        overflow: "hidden",
                    }}
                >
                    {SNIPPET_KEYS.map((key) => (
                        <div
                            key={key}
                            style={{
                                position: "absolute",
                                inset: 0,
                                padding: CODE_PADDING,
                                opacity: snippetOpacity(key),
                            }}
                        >
                            <CodeBlock
                                code={SNIPPETS[key].code}
                                focus={key === step.snippet ? step.focus : []}
                                reserveRight={CHIP_GUTTER}
                                fontSize={CODE_FONT_SIZE}
                            />
                        </div>
                    ))}

                    <div
                        style={{
                            position: "absolute",
                            right: 18,
                            top: chipTop,
                            transform: "translateY(-50%)",
                        }}
                    >
                        <ValueChip value={step.chipValue} tone={step.phase} />
                    </div>
                </div>

                <div style={{ width: 320, flexShrink: 0 }}>
                    <StatePanel user={step.state.user} assistant={assistantText} />
                </div>
            </div>

            <div
                style={{
                    fontFamily: SANS_FAMILY,
                    fontSize: 28,
                    color: COLORS.text,
                    minHeight: 40,
                }}
            >
                {step.caption}
            </div>

            {introOpacity > 0 ? (
                <AbsoluteFill
                    style={{
                        backgroundColor: COLORS.background,
                        opacity: introOpacity,
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 20,
                    }}
                >
                    <h1
                        style={{
                            margin: 0,
                            fontFamily: SANS_FAMILY,
                            fontSize: 76,
                            color: COLORS.text,
                        }}
                    >
                        El recorrido de un mensaje
                    </h1>
                    <p
                        style={{
                            margin: 0,
                            fontFamily: MONO_FAMILY,
                            fontSize: 26,
                            color: COLORS.crimsonSoft,
                        }}
                    >
                        linea por linea, hasta que vuelve la respuesta
                    </p>
                </AbsoluteFill>
            ) : null}

            {outroOpacity > 0 ? (
                <AbsoluteFill
                    style={{
                        backgroundColor: COLORS.background,
                        opacity: outroOpacity,
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 20,
                    }}
                >
                    <h1
                        style={{
                            margin: 0,
                            fontFamily: SANS_FAMILY,
                            fontSize: 64,
                            color: COLORS.text,
                        }}
                    >
                        Un token por vez
                    </h1>
                    <p
                        style={{
                            margin: 0,
                            fontFamily: MONO_FAMILY,
                            fontSize: 24,
                            color: COLORS.crimsonSoft,
                        }}
                    >
                        eso es todo el flujo
                    </p>
                </AbsoluteFill>
            ) : null}
        </AbsoluteFill>
    );
}
