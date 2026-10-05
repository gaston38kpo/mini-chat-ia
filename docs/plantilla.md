# Usar esta plantilla

Este repo es una base para tu propio chat de IA. Este documento es el checklist
para clonarlo y dejarlo tuyo en unos minutos.

## Camino rapido

1. Copia el proyecto (o usa "Use this template" en GitHub, ver abajo).
2. Cambia la marca en `src/constants/appConfig.ts`.
3. Crea tu `.env` a partir de `.env.example`.
4. Corre `npm install && npm run dev` y elegi un modelo.

## Que cambiar

| Que | Donde | Nota |
| --- | --- | --- |
| Nombre y marca | `src/constants/appConfig.ts` | `title` y `modelsSectionTitle` se derivan de `APP_NAME` + `PROVIDER_LABEL`. |
| Backend | `.env` -> `VITE_API_BASE_URL`, `VITE_PROVIDER` | Ver [`providers.md`](./providers.md). |
| API key | `.env` -> `VITE_API_KEY` | Opcional; solo backends que la usan. |
| Host por defecto | `src/constants/appConstants.ts` | El default `192.168.1.68` es de desarrollo; cambialo por el tuyo o `localhost`. |
| Idioma de la UI | `src/component/*.tsx`, `src/helper/toastMessages.ts` | Los textos estan en espanol. |
| Planning docs | carpeta `odd/` | Es local (gitignoreada); borrala si no la queres. |

## Marcar como GitHub Template

En GitHub: **Settings -> General -> Template repository**. Una vez activado,
aparece el boton "Use this template" en el repo. Es una configuracion de la UI,
no codigo.

## Checklist

- [ ] `npm install` corre sin errores.
- [ ] `npm run dev` levanta la app.
- [ ] `npm run lint`, `npm run typecheck` y `npm run build` pasan.
- [ ] La marca en `appConfig.ts` es la tuya.
- [ ] Tu `.env` apunta a tu backend.
- [ ] (Si publicas) borraste `odd/` y no commiteaste ningun `.env`.

## Siguiente paso

- Arquitectura: [`arquitectura.md`](./arquitectura.md)
- Agregar un backend: [`providers.md`](./providers.md)
