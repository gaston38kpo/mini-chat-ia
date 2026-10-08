/**
 * Tokens de diseno del video: un solo lugar para colores, tipografias y
 * duraciones, asi las escenas no repiten valores magicos.
 */

export const COLORS = {
    background: "#0b0b0d",
    panel: "#15151a",
    text: "#e8e8ee",
    muted: "#8b8b96",
    border: "#26262e",
    orange: "#f97316",
    crimson: "#e11d48",
    crimsonSoft: "#fb7185",
    codeBg: "#101015",
    focusBar: "rgba(249, 115, 22, 0.14)",
} as const;

/** Solo fuentes del sistema: nada de red, asi el render es determinista. */
export const MONO_FAMILY =
    'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';

export const SANS_FAMILY =
    'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Duracion de cada escena, en frames (30 fps). */
export const DURATIONS = {
    s01: 150,
    s02: 180,
    s03: 240,
    s04: 360,
    s05: 150,
} as const;

/**
 * Cada transicion "se come" estos frames. Por eso el total del video NO es la
 * suma de las escenas: es la suma menos (transiciones x cantidad).
 */
export const TRANSITION_DURATION = 15;
