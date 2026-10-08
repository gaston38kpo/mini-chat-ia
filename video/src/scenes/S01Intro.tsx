import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { DataFlowDiagram } from "../components/DataFlowDiagram";
import { COLORS, MONO_FAMILY, SANS_FAMILY } from "../theme";

/** Escena 1: el mapa completo del flujo, antes de mirar codigo. */
export function S01Intro() {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    const titleOpacity = interpolate(frame, [0, 18], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill
            style={{
                backgroundColor: COLORS.background,
                opacity: fadeOut,
                padding: 90,
                justifyContent: "center",
            }}
        >
            <h1
                style={{
                    margin: 0,
                    fontFamily: SANS_FAMILY,
                    fontSize: 72,
                    color: COLORS.text,
                    opacity: titleOpacity,
                }}
            >
                El flujo, de punta a punta
            </h1>
            <p
                style={{
                    marginTop: 14,
                    marginBottom: 64,
                    fontFamily: MONO_FAMILY,
                    fontSize: 26,
                    color: COLORS.crimsonSoft,
                    opacity: titleOpacity,
                }}
            >
                Cuatro archivos, un solo camino
            </p>
            <DataFlowDiagram />
        </AbsoluteFill>
    );
}
