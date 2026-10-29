# FUTGO — Frontend

Interfaz web de FUTGO, una aplicación para encontrar partidos de fútbol, crear encuentros y organizar la participación de jugadores. Está desarrollada con React, TypeScript, Vite y Tailwind CSS.

## Requisitos

- Node.js 20.19 o superior, o 22.12 o superior.
- npm.
- El repositorio [DSW-Backend](https://github.com/IvanSlavkes/DSW-Backend) instalado y configurado para las pantallas conectadas a la API.

## Instalación y ejecución local

```powershell
npm install
npm run dev
```

Con el backend escuchando en `http://localhost:3000`, Vite sirve la interfaz y reenvía las solicitudes de API al backend. La dirección local de la interfaz aparece en la terminal.

La variable `VITE_API_URL` es opcional. Si se deja vacía, se usa el proxy de Vite configurado en `vite.config.ts`. Para la demo con el comando de presentación debe permanecer vacía en `.env.local`.

## Presentación desde un celular

Con las dependencias instaladas en frontend y backend, y el backend configurado con la base Neon, ejecutar desde este repositorio:

```powershell
npm run presentacion
```

El comando inicia backend y frontend, crea un túnel temporal con Tunnelmole y muestra en la terminal la URL que se debe abrir en el celular. Requiere que los puertos `3000` y `5174` estén libres y que haya conexión a Internet. Mantener abierta la terminal durante la demostración. La URL puede cambiar en cada inicio.

## Scripts

| Comando | Uso |
| --- | --- |
| `npm run dev` | Inicia Vite para desarrollo local. |
| `npm run presentacion` | Inicia backend, frontend y túnel temporal para una demostración desde otra red. |
| `npm run build` | Comprueba TypeScript y genera la build en `dist/`. |
| `npm run lint` | Ejecuta ESLint. |
| `npm run preview` | Sirve localmente la última build. |

## Documentación

- [Documentación general, alcance de Regularidad y gestión del proyecto](docs/README.md).
- [Instalación, configuración y ejecución](docs/setup.md).
- [Pantallas y estado funcional](docs/product-status.md).
- [Documentación técnica del backend](https://github.com/IvanSlavkes/DSW-Backend/tree/main/docs).
