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

export type Step = {
    snippet: SnippetKey;
    /** Lineas (1-based) que se encienden: la "puerta" que el personaje cruza. */
    focus: number[];
    /** Linea en la que se para el personaje. */
    chipLine: number;
    /** Lo que lleva el personaje: el valor real, no el nombre de la variable. */
    carries: { value: string; form: FormKey };
    caption: string;
    phase: "out" | "in";
    state: ChatState;
};

const EMPTY: ChatState = { user: null, assistant: "" };
const SENT: ChatState = { user: USER_MESSAGE, assistant: "" };
const T1: ChatState = { user: USER_MESSAGE, assistant: "¡Hola" };
const T2: ChatState = { user: USER_MESSAGE, assistant: "¡Hola! ¿En qué" };
const T3: ChatState = { user: USER_MESSAGE, assistant: "¡Hola! ¿En qué te ayudo" };
const T4: ChatState = { user: USER_MESSAGE, assistant: ASSISTANT_REPLY };

/**
 * El guion del recorrido. Primero el string viaja hasta el modelo cambiando de
 * forma en cada puerta; despues vuelven los tokens, uno por vuelta del loop.
 */
export const STEPS: Step[] = [
    {
        snippet: "appSubmit",
        focus: [7],
        chipLine: 7,
        carries: { value: "Hola", form: "string" },
        caption: "Escribis \"Hola\" y el formulario lo manda a send(input).",
        phase: "out",
        state: EMPTY,
    },
    {
        snippet: "hookSend",
        focus: [6, 8],
        chipLine: 6,
        carries: { value: "Hola", form: "string" },
        caption: "El string entra al hook: se limpia y se chequea que no este vacio.",
        phase: "out",
        state: EMPTY,
    },
    {
        snippet: "hookSend",
        focus: [10],
        chipLine: 10,
        carries: { value: '[ user: "Hola" ]', form: "array" },
        caption: "Ahora es parte de una lista: el historial que recibe el modelo.",
        phase: "out",
        state: EMPTY,
    },
    {
        snippet: "hookSend",
        focus: [12],
        chipLine: 12,
        carries: { value: "burbuja vacia", form: "ui" },
        caption: "Y aparece en pantalla al instante, con una burbuja vacia esperando.",
        phase: "out",
        state: SENT,
    },
    {
        snippet: "clientFetch",
        focus: [5, 8, 10, 11],
        chipLine: 10,
        carries: { value: "{ messages, stream }", form: "request" },
        caption: "Se convierte en el cuerpo del request y viaja a LM Studio.",
        phase: "out",
        state: SENT,
    },
    {
        snippet: "clientReader",
        focus: [1, 2, 3, 6, 9],
        chipLine: 9,
        carries: { value: "bytes…", form: "bytes" },
        caption: "Del otro lado no vuelve texto: vuelven bytes.",
        phase: "in",
        state: SENT,
    },
    {
        snippet: "clientFrames",
        focus: [1, 2, 4, 5],
        chipLine: 5,
        carries: { value: "data: {…}", form: "event" },
        caption: "Se decodifican y se parten por evento SSE. Aparece la linea data:.",
        phase: "in",
        state: SENT,
    },
    {
        snippet: "clientFrames",
        focus: [9, 11, 13, 15],
        chipLine: 13,
        carries: { value: "¡Hola", form: "token" },
        caption: "Primer token: el pedacito de texto que devuelve el modelo.",
        phase: "in",
        state: T1,
    },
    {
        snippet: "hookToken",
        focus: [1, 7],
        chipLine: 7,
        carries: { value: "¡Hola", form: "token" },
        caption: "onToken lo manda de vuelta al hook y se pega al ultimo mensaje.",
        phase: "in",
        state: T1,
    },
    {
        snippet: "clientFrames",
        focus: [9, 11, 13, 15],
        chipLine: 13,
        carries: { value: "! ¿En qué", form: "token" },
        caption: "El loop arranca de nuevo: el modelo sigue mandando tokens.",
        phase: "in",
        state: T2,
    },
    {
        snippet: "clientFrames",
        focus: [9, 11, 13, 15],
        chipLine: 13,
        carries: { value: " te ayudo", form: "token" },
        caption: "Otro token mas. Y asi hasta que llega [DONE].",
        phase: "in",
        state: T3,
    },
    {
        snippet: "appRender",
        focus: [4],
        chipLine: 4,
        carries: { value: ASSISTANT_REPLY, form: "reply" },
        caption: "La respuesta completa, armada token por token.",
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
