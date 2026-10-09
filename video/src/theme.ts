/**
 * Tokens de diseno del video: un solo lugar para colores, tipografias y
 * medidas, asi las escenas no repiten valores magicos.
 */

export const COLORS = {
    background: "#0b0b0d",
    panel: "#15151a",
    panelAlt: "#1b1b22",
    text: "#e8e8ee",
    muted: "#8b8b96",
    border: "#26262e",
    orange: "#f97316",
    crimson: "#e11d48",
    crimsonSoft: "#fb7185",
    codeBg: "#101015",
    focusBar: "rgba(249, 115, 22, 0.14)",
    chipBg: "#1f2937",
    chipBorder: "#3b82f6",
    outbound: "#f97316",
    inbound: "#3b82f6",
} as const;

/** Solo fuentes del sistema: nada de red, asi el render es determinista. */
export const MONO_FAMILY =
    'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';

export const SANS_FAMILY =
    'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Metricas del bloque de codigo. La altura de linea sale de aca. */
export const CODE_FONT_SIZE = 20;
export const CODE_LINE_HEIGHT = 1.55;
export const CODE_LINE_PX = CODE_FONT_SIZE * CODE_LINE_HEIGHT;

export const CHIP_FONT_SIZE = 15;
