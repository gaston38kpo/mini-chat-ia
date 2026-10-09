import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CodeBlock } from "../components/CodeBlock";
import { FileBadge } from "../components/FileBadge";
import { StatePanel } from "../components/StatePanel";
import { ValueCharacter } from "../components/ValueCharacter";
import { CODE_FONT_SIZE, CODE_LINE_PX, COLORS, MONO_FAMILY, SANS_FAMILY } from "../theme";
import {
    ASSISTANT_REPLY,
    FORMS,
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

/** Espacio a la derecha del codigo, reservado para el personaje. */
const CHIP_GUTTER = 288;
/** Padding vertical del bloque de codigo; el personaje se alinea con esto. */
const CODE_PADDING = 24;
/** Frames que dura el salto hasta la proxima linea. */
const HOP_FRAMES = 20;
/** Frames que tarda en cambiar de forma al aterrizar. */
const MORPH_FRAMES = 14;
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
 * El recorrido de un mensaje, en una sola toma: un personaje lleva el valor
 * real por las lineas del codigo, salta de una a otra, y cambia de forma cada
 * vez que cruza una puerta.
 */
export function MainVideo() {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const stepIndex = stepAt(frame);
    const step = STEPS[stepIndex];
    const from = stepFrom(stepIndex);
    const landFrame = from + HOP_FRAMES;
    const prev = STEPS[stepIndex - 1];

    // Solo salta si seguimos dentro del mismo snippet. Si cambia el codigo, el
    // personaje aparece directo en la linea nueva.
    const hops = prev !== undefined && prev.snippet === step.snippet;
    const arrived = !hops || frame >= landFrame;

    // Mientras viaja sigue llevando el valor viejo; al aterrizar, se transforma.
    const carriedValue = arrived ? step.carries.value : (prev?.carries.value ?? step.carries.value);

    const fromForm = FORMS[prev?.carries.form ?? step.carries.form];
    const toForm = FORMS[step.carries.form];
    const morph = arrived
        ? interpolate(frame, [landFrame, landFrame + MORPH_FRAMES], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
          })
        : 0;

    const radius = interpolate(morph, [0, 1], [fromForm.radius, toForm.radius]);
    const accent = morph > 0.5 ? toForm.accent : fromForm.accent;
    const dashed = morph > 0.5 ? toForm.dashed : fromForm.dashed;
    const filled = morph > 0.5 ? toForm.filled : fromForm.filled;

    // El salto: spring en vertical (con rebote) y un arco horizontal.
    const hop = spring({ frame: frame - from, fps, config: { damping: 14, stiffness: 130 } });
    const targetY = lineCenter(step.chipLine);
    const prevY = hops ? lineCenter(prev.chipLine) : targetY;
    const charY = hops ? interpolate(hop, [0, 1], [prevY, targetY]) : targetY;
    const arcX = hops ? -Math.sin(Math.min(Math.max(hop, 0), 1) * Math.PI) * 46 : 0;

    // Pop al aterrizar + un vaiven chiquito para que se lea como un personaje.
    const pop = arrived && hops ? spring({ frame: frame - landFrame, fps, config: { damping: 9, stiffness: 200 } }) : 0;
    const scale = 1 + Math.min(pop, 1.4) * 0.16;
    const bob = Math.sin(frame / 13) * 2.5;

    // La puerta se ilumina cuando el personaje la cruza.
    const doorPulse = interpolate(frame, [landFrame, landFrame + 18], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const snippetOpacity = (key: SnippetKey): number => {
        const [start, end] = SNIPPET_RANGES[key];
        return interpolate(
            frame,
            [start - SNIPPET_FADE, start, end - SNIPPET_FADE, end],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
    };

    // En el ultimo paso la respuesta termina de escribirse sola.
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
                                focusPulse={key === step.snippet ? doorPulse : 0}
                                reserveRight={CHIP_GUTTER}
                                fontSize={CODE_FONT_SIZE}
                            />
                        </div>
                    ))}

                    <div
                        style={{
                            position: "absolute",
                            right: 18,
                            top: charY + bob,
                            transform: `translateY(-50%) translateX(${arcX}px)`,
                        }}
                    >
                        <ValueCharacter
                            value={carriedValue}
                            radius={radius}
                            dashed={dashed}
                            filled={filled}
                            accent={accent}
                            scale={scale}
                        />
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
                        un personaje que viaja por el codigo y cambia de forma
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
                        asi se arma la respuesta
                    </p>
                </AbsoluteFill>
            ) : null}
        </AbsoluteFill>
    );
}
