import { COLORS } from "../theme";
import {
    SNIPPET_APP_RENDER,
    SNIPPET_APP_SUBMIT,
    SNIPPET_CLIENT_FETCH,
    SNIPPET_CLIENT_FRAMES,
    SNIPPET_CLIENT_READER,
    SNIPPET_HOOK_SEND,
    SNIPPET_HOOK_TOKEN,
} from "../snippets/code";

export type SnippetKey =
    | "appSubmit"
    | "hookSend"
    | "clientFetch"
    | "clientReader"
    | "clientFrames"
    | "hookToken"
    | "appRender";

/** Cada snippet sabe de que archivo sale, para el indicador de arriba. */
export const SNIPPETS: Record<SnippetKey, { file: string; code: string }> = {
    appSubmit: { file: "App.tsx", code: SNIPPET_APP_SUBMIT },
    hookSend: { file: "useLocalChat.ts", code: SNIPPET_HOOK_SEND },
    clientFetch: { file: "lmStudioClient.ts", code: SNIPPET_CLIENT_FETCH },
    clientReader: { file: "lmStudioClient.ts", code: SNIPPET_CLIENT_READER },
    clientFrames: { file: "lmStudioClient.ts", code: SNIPPET_CLIENT_FRAMES },
    hookToken: { file: "useLocalChat.ts", code: SNIPPET_HOOK_TOKEN },
    appRender: { file: "App.tsx", code: SNIPPET_APP_RENDER },
};

/**
 * Las formas que va tomando el personaje. `radius` es lo que se interpola
 * cuando cambia de forma: circulo -> caja -> cuadradito -> burbuja.
 */
export type FormKey =
    | "string"
    | "array"
    | "ui"
    | "request"
    | "bytes"
    | "event"
    | "token"
    | "reply";

export type FormSpec = {
    radius: number;
    dashed: boolean;
    filled: boolean;
    accent: string;
};

export const FORMS: Record<FormKey, FormSpec> = {
    string: { radius: 999, dashed: false, filled: false, accent: COLORS.outbound },
    array: { radius: 14, dashed: false, filled: false, accent: COLORS.outbound },
    ui: { radius: 14, dashed: false, filled: false, accent: COLORS.outbound },
    request: { radius: 8, dashed: false, filled: false, accent: COLORS.outbound },
    bytes: { radius: 999, dashed: true, filled: false, accent: COLORS.inbound },
    event: { radius: 12, dashed: false, filled: false, accent: COLORS.inbound },
    token: { radius: 6, dashed: false, filled: true, accent: COLORS.inbound },
    reply: { radius: 999, dashed: false, filled: true, accent: COLORS.inbound },
};

export const USER_MESSAGE = "Hola";
export const ASSISTANT_REPLY = "¡Hola! ¿En qué te ayudo?";

export type ChatState = { user: string | null; assistant: string };

/**
 * Lo que lleva el personaje. El valor se parte en tres para que el hueco sea
 * literal: `before` y `after` son el contenedor, `value` es lo que entra.
 *
 * RIGOR DE TIPOS: cada `value` se muestra con la notacion real del tipo.
 * Los strings van entre comillas (aunque la UI no las muestre), los bytes como
 * Uint8Array, y los contenedores con la forma real del dato.
 */
export type Carried = {
    before: string;
    value: string;
    after: string;
    form: FormKey;
};

export type Step = {
    snippet: SnippetKey;
    /** Lineas (1-based) que se encienden: la "puerta" que el personaje cruza. */
    focus: number[];
    /** Linea en la que se para el personaje. */
    chipLine: number;
    carries: Carried;
    caption: string;
    phase: "out" | "in";
    state: ChatState;
};

const EMPTY: ChatState = { user: null, assistant: "" };
const SENT: ChatState = { user: USER_MESSAGE, assistant: "" };
const T1: ChatState = { user: USER_MESSAGE, assistant: "¡Hola" };
const T2: ChatState = { user: USER_MESSAGE, assistant: "¡Hola! ¿En qué" };
const T4: ChatState = { user: USER_MESSAGE, assistant: ASSISTANT_REPLY };

/** El campo `content` del ultimo mensaje, que es donde se acumulan los tokens. */
const CONTENT_OPEN = '{ role: "assistant", content: ';
const CONTENT_CLOSE = " }";

/** El historial, con el mensaje del usuario ya adentro. */
const HISTORY_OPEN = '[ { role: "user", content: ';

/**
 * El guion del recorrido. Cada paso dice que valor viaja, con que tipo real, y
 * en que contenedor vive: el contenedor se muestra vacio antes de que entre.
 */
export const STEPS: Step[] = [
    {
        snippet: "appSubmit",
        focus: [7],
        chipLine: 7,
        carries: { before: "", value: '"Hola"', after: "", form: "string" },
        caption: "El input es un string: \"Hola\". El formulario lo manda a send(input).",
        phase: "out",
        state: EMPTY,
    },
    {
        snippet: "hookSend",
        focus: [6, 8],
        chipLine: 6,
        carries: { before: "", value: '"Hola"', after: "", form: "string" },
        caption: "El hook lo limpia con trim(). Sigue siendo un string, y no esta vacio.",
        phase: "out",
        state: EMPTY,
    },
    {
        snippet: "hookSend",
        focus: [10],
        chipLine: 10,
        carries: {
            before: HISTORY_OPEN,
            value: '"Hola"',
            after: " } ]",
            form: "array",
        },
        caption: "Ahora el string entra en un ChatMessage, dentro del historial.",
        phase: "out",
        state: EMPTY,
    },
    {
        snippet: "hookSend",
        focus: [12],
        chipLine: 12,
        carries: {
            before: HISTORY_OPEN,
            value: '"Hola"',
            after: ', { role: "assistant", content: "" } ]',
            form: "ui",
        },
        caption: "El historial suma un segundo mensaje, con el content vacio.",
        phase: "out",
        state: SENT,
    },
    {
        snippet: "clientFetch",
        focus: [5, 8, 10, 11],
        chipLine: 10,
        carries: {
            before: '{ model: "local-model", messages: [ { role: "user", content: ',
            value: '"Hola"',
            after: ', { role: "assistant", content: "" } ], stream: true }',
            form: "request",
        },
        caption: "Todo eso entra en el body del request, junto con stream: true.",
        phase: "out",
        state: SENT,
    },
    {
        snippet: "clientReader",
        focus: [1, 2, 3, 6],
        chipLine: 6,
        carries: {
            before: "",
            value: "Uint8Array(87) [100, 97, 116, 97, 58, 32, …]",
            after: "",
            form: "bytes",
        },
        caption: "Del otro lado no vuelve texto: vuelve un Uint8Array. Son bytes.",
        phase: "in",
        state: SENT,
    },
    {
        snippet: "clientFrames",
        focus: [1, 2, 4, 5],
        chipLine: 5,
        carries: {
            before: "",
            value: `'data: {"choices":[{"delta":{"content":"¡Hola"}}]}'`,
            after: "",
            form: "event",
        },
        caption: "El decoder los pasa a texto y queda un evento SSE: un string.",
        phase: "in",
        state: SENT,
    },
    {
        snippet: "clientFrames",
        focus: [9, 11, 13, 15],
        chipLine: 13,
        carries: { before: "", value: '"¡Hola"', after: "", form: "token" },
        caption: "El modelo devuelve un string: el primer token.",
        phase: "in",
        state: T1,
    },
    {
        snippet: "hookToken",
        focus: [1, 7],
        chipLine: 7,
        carries: {
            before: CONTENT_OPEN,
            value: '"¡Hola"',
            after: CONTENT_CLOSE,
            form: "token",
        },
        caption: "onToken lo pega al content del ultimo mensaje. Ese content era \"\".",
        phase: "in",
        state: T1,
    },
    {
        snippet: "clientFrames",
        focus: [9, 11, 13, 15],
        chipLine: 13,
        carries: { before: "", value: '"! ¿En qué"', after: "", form: "token" },
        caption: "El loop arranca de nuevo: otro evento, otro string.",
        phase: "in",
        state: T1,
    },
    {
        snippet: "hookToken",
        focus: [1, 7],
        chipLine: 7,
        carries: {
            before: CONTENT_OPEN,
            value: '"¡Hola! ¿En qué"',
            after: CONTENT_CLOSE,
            form: "token",
        },
        caption: "Y se vuelve a pegar. El content del asistente va creciendo.",
        phase: "in",
        state: T2,
    },
    {
        snippet: "appRender",
        focus: [4],
        chipLine: 4,
        carries: {
            before: "",
            value: '"¡Hola! ¿En qué te ayudo?"',
            after: "",
            form: "reply",
        },
        caption: "Al final el content completo. La respuesta entera, token por token.",
        phase: "in",
        state: T4,
    },
];

export const INTRO_FRAMES = 90;
export const STEP_FRAMES = 84;
export const OUTRO_FRAMES = 90;

/** 90 + (12 x 84) + 90 = 1188 frames = 39,6 s a 30 fps. */
export const MAIN_VIDEO_DURATION =
    INTRO_FRAMES + STEPS.length * STEP_FRAMES + OUTRO_FRAMES;

export function stepFrom(index: number): number {
    return INTRO_FRAMES + index * STEP_FRAMES;
}

/** En que paso estamos, con clamp en los extremos. */
export function stepAt(frame: number): number {
    const raw = Math.floor((frame - INTRO_FRAMES) / STEP_FRAMES);
    return Math.min(Math.max(raw, 0), STEPS.length - 1);
}
