# FUTGO — Frontend

Aplicación web para explorar partidos de fútbol, administrar el perfil y crear partidos. Está implementada con React, TypeScript, Vite y Tailwind CSS.

## Inicio rápido

```powershell
npm install
npm run dev
```

Iniciar también el backend para utilizar las pantallas que consultan datos. El cliente HTTP apunta actualmente a `http://localhost:3000`; la variable `VITE_API_URL` que pueda estar en `.env` aún no es utilizada por el cliente.

La documentación del frontend está en [`docs/README.md`](docs/README.md). La API y el modelo de datos se documentan en el [repositorio backend](https://github.com/IvanSlavkes/DSW-Backend/tree/main/docs).

## Scripts

| Comando | Uso |
| --- | --- |
| `npm run dev` | Inicia Vite en desarrollo. |
| `npm run build` | Ejecuta la comprobación TypeScript y genera la build de producción. |
| `npm run lint` | Ejecuta ESLint. |
| `npm run preview` | Sirve localmente la última build. |

Todavía no hay un script de pruebas automatizadas configurado.
