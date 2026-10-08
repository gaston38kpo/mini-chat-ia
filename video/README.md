# video/ — el video explicativo

Proyecto Remotion aparte que renderiza un video explicando el flujo del codigo de
`mini-chat-ia`: `App -> useLocalChat -> lmStudioClient -> LM Studio -> tokens`.

Esta separado a proposito. Remotion trae su propio bundler y dependencias
pesadas; el proyecto de la app tiene que seguir siendo chico.

## Como correrlo

```bash
cd video
npm install
npm run dev
```

## Comandos

| Comando                 | Que hace                                    |
| ----------------------- | ------------------------------------------- |
| `npm run dev`           | Remotion Studio (preview con timeline)      |
| `npm run typecheck`     | `tsc --noEmit`                              |
| `npm run compositions`  | Lista las composiciones registradas         |
| `npm run build`         | Renderiza `out/video.mp4`                   |

## Estructura

- `src/theme.ts` — colores, tipografias y duraciones.
- `src/Root.tsx` — registra las composiciones.
- `src/video/MainVideo.tsx` — arma el video completo con `TransitionSeries`.
- `src/scenes/` — una escena por tramo del flujo.
- `src/components/CodeBlock.tsx` — codigo real resaltado con Shiki.
- `src/snippets/` — copias curadas del codigo de la app.

## Regla de oro

Toda animacion sale de `useCurrentFrame()` + `interpolate()` / `spring()`.
Nada de `transition`/`animation` de CSS y nada de `useState` para animar: si no,
el preview de Studio y el render final no coinciden.

## Ojo con los snippets

`src/snippets/` son copias a mano de `src/lmStudioClient.ts`. Remotion no usa
Vite, asi que no se puede importar el archivo real con `?raw`. Si cambia el
original, actualiza las copias.
