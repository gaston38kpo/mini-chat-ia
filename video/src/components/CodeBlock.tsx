import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender } from "remotion";
import { createHighlighter, type Highlighter, type ThemedToken } from "shiki";
import { CODE_FONT_SIZE, CODE_LINE_HEIGHT, COLORS, MONO_FAMILY } from "../theme";

const THEME_NAME = "github-dark";

/**
 * Un unico highlighter para todo el video. Crear uno por componente seria
 * carisimo: Shiki carga gramaticas y temas cada vez.
 */
let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
    highlighterPromise ??= createHighlighter({
        themes: [THEME_NAME],
        langs: ["ts", "tsx", "json"],
    });
    return highlighterPromise;
}

type CodeBlockProps = {
    code: string;
    lang?: "ts" | "tsx" | "json";
    /** Lineas (1-based) que van en foco en este frame. Vacio = todo apagado. */
    focus?: number[];
    /** 0..1: cuanto brilla la linea en foco. Sube cuando el personaje aterriza. */
    focusPulse?: number;
    /** Opacidad de las lineas que NO estan en foco. */
    dimOpacity?: number;
    fontSize?: number;
    lineHeight?: number;
    /** Espacio a la derecha para que el personaje no tape el codigo. */
    reserveRight?: number;
};

export function CodeBlock({
    code,
    lang = "ts",
    focus = [],
    focusPulse = 0,
    dimOpacity = 0.3,
    fontSize = CODE_FONT_SIZE,
    lineHeight = CODE_LINE_HEIGHT,
    reserveRight = 0,
}: CodeBlockProps) {
    // delayRender le dice a Remotion "todavia no renderices este frame".
    // Va en useState y no en useEffect para que se pida UNA sola vez.
    const [handle] = useState(() => delayRender("shiki-highlight"));
    const [lines, setLines] = useState<ThemedToken[][] | null>(null);

    useEffect(() => {
        getHighlighter()
            .then((highlighter) => {
                const result = highlighter.codeToTokens(code, { lang, theme: THEME_NAME });
                setLines(result.tokens);
                continueRender(handle);
            })
            .catch((error: unknown) => {
                cancelRender(error);
            });
    }, [code, lang, handle]);

    if (lines === null) {
        return null;
    }

    const focusSet = new Set(focus);
    const barAlpha = 0.14 + focusPulse * 0.26;

    return (
        <div
            style={{
                paddingRight: reserveRight,
                fontFamily: MONO_FAMILY,
                fontSize,
                lineHeight,
            }}
        >
            {lines.map((line, index) => {
                const lineNumber = index + 1;
                const isFocused = focusSet.has(lineNumber);

                return (
                    <div
                        key={lineNumber}
                        style={{
                            display: "flex",
                            gap: 18,
                            opacity: isFocused ? 1 : dimOpacity,
                            backgroundColor: isFocused
                                ? `rgba(249, 115, 22, ${barAlpha})`
                                : "transparent",
                            borderLeft: `3px solid ${isFocused ? COLORS.orange : "transparent"}`,
                            paddingLeft: 14,
                            paddingRight: 18,
                        }}
                    >
                        <span
                            style={{
                                width: 34,
                                flexShrink: 0,
                                textAlign: "right",
                                color: COLORS.muted,
                            }}
                        >
                            {lineNumber}
                        </span>
                        <span style={{ whiteSpace: "pre" }}>
                            {line.map((token, tokenIndex) => (
                                <span key={tokenIndex} style={{ color: token.color }}>
                                    {token.content}
                                </span>
                            ))}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
