import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, MONO_FAMILY, SANS_FAMILY } from "../theme";

type SceneStubProps = {
    title: string;
    subtitle: string;
};

/**
 * Placeholder para las escenas que todavia no estan armadas. Muestra el titulo
 * y el frame actual, para confirmar que el timeline avanza.
 */
export function SceneStub({ title, subtitle }: SceneStubProps) {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill
            style={{
                backgroundColor: COLORS.background,
                justifyContent: "center",
                alignItems: "center",
                padding: 120,
            }}
        >
            <div
                style={{
                    border: `2px dashed ${COLORS.border}`,
                    borderRadius: 24,
                    padding: "64px 88px",
                    textAlign: "center",
                    backgroundColor: COLORS.panel,
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontFamily: SANS_FAMILY,
                        fontSize: 64,
                        color: COLORS.text,
                    }}
                >
                    {title}
                </h2>
                <p
                    style={{
                        marginTop: 20,
                        marginBottom: 0,
                        fontFamily: MONO_FAMILY,
                        fontSize: 28,
                        color: COLORS.muted,
                    }}
                >
                    {subtitle}
                </p>
                <p
                    style={{
                        marginTop: 36,
                        marginBottom: 0,
                        fontFamily: MONO_FAMILY,
                        fontSize: 22,
                        color: COLORS.orange,
                    }}
                >
                    frame {frame}
                </p>
            </div>
        </AbsoluteFill>
    );
}
