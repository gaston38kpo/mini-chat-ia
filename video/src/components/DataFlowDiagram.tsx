import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, MONO_FAMILY } from "../theme";

const BOXES = [
    { title: "App.tsx", detail: "form + lista" },
    { title: "useLocalChat.ts", detail: "estado + send" },
    { title: "lmStudioClient.ts", detail: "fetch + SSE" },
    { title: "LM Studio", detail: "/v1/chat/completions" },
] as const;

/** Frames entre la aparicion de una caja y la siguiente. */
const STEP = 16;

/**
 * El diagrama de las 4 cajas con la ida y la vuelta. Cada caja entra con un
 * pequeno desplazamiento, todo derivado del frame.
 */
export function DataFlowDiagram() {
    const frame = useCurrentFrame();
    const lastBoxEnd = (BOXES.length - 1) * STEP + STEP;

    const returnOpacity = interpolate(frame, [lastBoxEnd, lastBoxEnd + 25], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <div style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {BOXES.map((box, index) => {
                    const start = index * STEP;
                    const appear = interpolate(frame, [start, start + STEP], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    });
                    const lift = interpolate(frame, [start, start + STEP], [22, 0], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    });
                    const isLesson = index === 2;

                    return (
                        <div
                            key={box.title}
                            style={{ display: "flex", alignItems: "center", flex: 1 }}
                        >
                            <div
                                style={{
                                    flex: 1,
                                    opacity: appear,
                                    transform: `translateY(${lift}px)`,
                                    backgroundColor: COLORS.panel,
                                    border: `2px solid ${isLesson ? COLORS.orange : COLORS.border}`,
                                    borderRadius: 18,
                                    padding: "26px 18px",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontFamily: MONO_FAMILY,
                                        fontSize: 30,
                                        color: isLesson ? COLORS.orange : COLORS.text,
                                    }}
                                >
                                    {box.title}
                                </div>
                                <div
                                    style={{
                                        fontFamily: MONO_FAMILY,
                                        fontSize: 18,
                                        color: COLORS.muted,
                                        marginTop: 10,
                                    }}
                                >
                                    {box.detail}
                                </div>
                            </div>
                            {index < BOXES.length - 1 ? (
                                <div
                                    style={{
                                        padding: "0 8px",
                                        fontSize: 32,
                                        color: COLORS.crimson,
                                        opacity: appear,
                                    }}
                                >
                                    →
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </div>

            <div
                style={{
                    marginTop: 46,
                    opacity: returnOpacity,
                    border: `2px dashed ${COLORS.crimson}`,
                    borderRadius: 14,
                    padding: "16px 22px",
                    fontFamily: MONO_FAMILY,
                    fontSize: 22,
                    color: COLORS.crimsonSoft,
                    textAlign: "center",
                }}
            >
                ← vuelve un stream de tokens (SSE), uno por vez
            </div>
        </div>
    );
}
