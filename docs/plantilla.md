# Usar esta plantilla

Este repo es una base para tu propio chat de IA. Este documento es el checklist
para clonarlo y dejarlo tuyo en unos minutos.

## Camino rapido

1. Copia el proyecto (o usa "Use this template" en GitHub, ver abajo).
2. Cambia la marca en `src/constants/appConfig.ts`.
3. Crea tu `.env` a partir de `.env.example`.
4. Corre `npm install && npm run dev`, elige un proveedor y un modelo.

## Que cambiar

| Que | Donde | Nota |
| --- | --- | --- |
| Nombre y marca | `src/constants/appConfig.ts` | `APP_NAME`; `title` y `modelsSectionTitle` se derivan del label del proveedor activo. |
| Backend | UI (`ProviderSelector`) o `.env` | Los proveedores se editan en la UI y se persisten en `localStorage`; `VITE_API_BASE_URL` y `VITE_PROVIDER` solo siembran. Ver [`providers.md`](./providers.md). |
| API key | UI o `.env` -> `VITE_API_KEY` | Se guarda en `localStorage` para el proveedor activo; no la commitees. |
| Host por defecto | `src/constants/appConstants.ts` | `LM_STUDIO_DEFAULT_BASE_URL` (`localhost:1234`) y el fallback de `VITE_API_BASE_URL` son de desarrollo; cámbialos por los tuyos. |
| Tema y tipografia | `index.html`, `src/index.css`, `src/assets/fonts/` | Tema oscuro fijo (`theme-sega`); fuentes Press Start 2P y VT323 self-hosted. |
| Idioma de la UI | `src/component/*.tsx`, `src/helper/toastMessages.ts` | Los textos estan en espanol. |
| Planning docs | carpeta `odd/` | Es local (gitignoreada); borrala si no la usas. |

## Marcar como GitHub Template

En GitHub: **Settings -> General -> Template repository**. Una vez activado,
aparece el boton "Use this template" en el repo. Es una configuracion de la UI,
no codigo.

## Checklist

- [ ] `npm install` corre sin errores.
- [ ] `npm run dev` levanta la app.
- [ ] `npm run lint`, `npm run typecheck` y `npm run build` pasan.
- [ ] La marca en `appConfig.ts` es la tuya.
- [ ] Tus proveedores y tu backend apuntan a donde deben.
- [ ] (Si publicas) borraste `odd/` y no commiteaste ningun `.env`.

## Siguiente paso

- Arquitectura: [`arquitectura.md`](./arquitectura.md)
- Agregar un backend: [`providers.md`](./providers.md)
