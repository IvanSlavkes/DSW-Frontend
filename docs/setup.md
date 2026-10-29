# Instalación y ejecución del frontend

## Requisitos

- Node.js 20.19 o superior, o 22.12 o superior (requisito de Vite 8).
- npm.
- Backend configurado y disponible en el puerto `3000` para usar las pantallas que consultan datos.

## Instalación y ejecución local

Desde la raíz de `DSW-Frontend`:

```powershell
npm install
npm run dev
```

Vite informa la dirección local en la terminal. En paralelo, iniciar el backend desde `DSW-Backend` con `npm run dev`.

## URL de la API

`src/api/client.ts` lee `VITE_API_URL`. Si no se define, usa `http://localhost:3000`; si se define como cadena vacía, Axios usa rutas relativas y Vite reenvía las rutas de API al backend local mediante el proxy de `vite.config.ts`.

Para conservar el proxy local, crear `.env.local` con:

```dotenv
VITE_API_URL=
```

Este archivo es local y no se debe subir al repositorio. El cliente agrega automáticamente el token de sesión como `Authorization: Bearer <token>` a las llamadas hechas con `src/api/client.ts`.

## Demostración móvil con Tunnelmole

1. Confirmar que el backend tiene configuradas las variables de Neon en `DSW-Backend/.env` y que `.env.local` contiene `VITE_API_URL=` vacío.
2. Instalar dependencias en ambos repositorios si todavía no se hizo (`npm install`).
3. Cerrar otros procesos que ocupen los puertos `3000` o `5174`.
4. Ejecutar desde `DSW-Frontend`:

   ```powershell
   npm run presentacion
   ```

5. Abrir en el celular la URL `https://...tunnelmole.net` que imprime la terminal. Mantener esa terminal abierta hasta terminar.

El comando automatiza el arranque del backend, Vite y Tunnelmole. Requiere conexión a Internet y el dominio temporal puede cambiar en cada ejecución.

## Compilación

```powershell
npm run build
npm run preview
```

`npm run build` ejecuta TypeScript y genera la aplicación estática en `dist/`. `npm run lint` ejecuta ESLint.

## Estructura relevante

| Ruta | Responsabilidad |
| --- | --- |
| `src/pages/` | Home, login, registro, Dashboard, partidos, detalle, perfil y panel administrativo. |
| `src/components/` | Encabezado reutilizable, Sidebar, tarjetas, formularios y componentes compartidos. |
| `src/api/` | Cliente Axios y funciones para consumir la API REST. |
| `src/types/` | Tipos TypeScript para modelos y cuerpos de entrada. |
| `src/router/` | Protección de rutas autenticadas y acceso administrativo. |
| `scripts/presentacion.mjs` | Arranque coordinado de backend, Vite y Tunnelmole para una demo. |
