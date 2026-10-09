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

export const USER_MESSAGE = "Hola";
export const ASSISTANT_REPLY = "¡Hola! ¿En qué te ayudo?";

export type ChatState = { user: string | null; assistant: string };

export type Step = {
    snippet: SnippetKey;
    /** Lineas (1-based) que se encienden en este paso. */
    focus: number[];
    /** Linea junto a la que flota el chip de valor. */
    chipLine: number;
    /** Que vale la variable en este paso. */
    chipValue: string;
    caption: string;
    phase: "out" | "in";
    state: ChatState;
};

const EMPTY: ChatState = { user: null, assistant: "" };
const SENT: ChatState = { user: USER_MESSAGE, assistant: "" };
const FIRST: ChatState = { user: USER_MESSAGE, assistant: "¡Hola" };
const DONE: ChatState = { user: USER_MESSAGE, assistant: ASSISTANT_REPLY };

/** El guion del recorrido: sale el mensaje, vuelve la respuesta. */
export const STEPS: Step[] = [
    {
        snippet: "appSubmit",
        focus: [7],
        chipLine: 7,
        chipValue: '"Hola"',
        caption: "Escribis y el formulario llama a send(input).",
        phase: "out",
        state: EMPTY,
    },
    {
        snippet: "hookSend",
        focus: [6, 8],
        chipLine: 6,
        chipValue: '"Hola"',
        caption: "El hook limpia el texto y chequea que no este vacio.",
        phase: "out",
        state: EMPTY,
    },
    {
        snippet: "hookSend",
        focus: [10],
        chipLine: 10,
        chipValue: "history",
        caption: "Arma el historial completo: la API no guarda estado.",
        phase: "out",
        state: EMPTY,
    },
    {
        snippet: "hookSend",
        focus: [12],
        chipLine: 12,
        chipValue: 'content: ""',
        caption: "Muestra tu mensaje y una burbuja vacia del asistente.",
        phase: "out",
        state: SENT,
    },
    {
        snippet: "clientFetch",
        focus: [5, 8, 10, 11],
        chipLine: 10,
        chipValue: "messages",
        caption: "Le manda el historial con stream: true.",
        phase: "out",
        state: SENT,
    },
    {
        snippet: "clientReader",
        focus: [1, 2, 3, 6, 9],
        chipLine: 9,
        chipValue: "bytes",
        caption: "Vuelven bytes. Los decodifica y los acumula en el buffer.",
        phase: "in",
        state: SENT,
    },
    {
        snippet: "clientFrames",
        focus: [1, 2, 4, 5],
        chipLine: 5,
        chipValue: "data:",
        caption: "Parte por evento SSE y busca la linea data:.",
        phase: "in",
        state: SENT,
    },
    {
        snippet: "clientFrames",
        focus: [9, 11, 13, 15],
        chipLine: 13,
        chipValue: '"¡Hola"',
        caption: "Saca el pedacito de texto y lo emite con onToken.",
        phase: "in",
        state: FIRST,
    },
    {
        snippet: "hookToken",
        focus: [1, 7],
        chipLine: 7,
        chipValue: "content + token",
        caption: "El callback le pega el token al ultimo mensaje.",
        phase: "in",
        state: FIRST,
    },
    {
        snippet: "appRender",
        focus: [4],
        chipLine: 4,
        chipValue: "content",
        caption: "Y la burbuja se llena sola, token por token.",
        phase: "in",
        state: DONE,
    },
];

export const INTRO_FRAMES = 90;
export const STEP_FRAMES = 84;
export const OUTRO_FRAMES = 90;

/** 90 + (10 x 84) + 90 = 1020 frames = 34 s a 30 fps. */
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
