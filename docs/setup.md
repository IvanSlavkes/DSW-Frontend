# Instalación y estructura del frontend

## Requisitos

- Node.js y npm compatibles con `package.json`.
- Backend iniciado y conectado a PostgreSQL para las pantallas que consultan o envían datos.

## Instalar e iniciar

Desde la raíz del repositorio frontend:

```powershell
npm install
npm run dev
```

Vite informa en la terminal la dirección local donde quedó disponible la aplicación.

## URL de la API

`src/api/client.ts` configura Axios con `http://localhost:3000` e incorpora el token guardado en `localStorage` como `Authorization: Bearer <token>`. El repositorio también tiene una variable `VITE_API_URL`, pero el cliente actualmente no la lee. Por eso, cambiar esa variable por sí solo no cambia el destino de las solicitudes.

## Verificación y producción

```powershell
npm run build
npm run preview
```

`npm run build` ejecuta `tsc -b` y genera la aplicación estática en `dist/`. `npm run lint` ejecuta ESLint. No existe actualmente un script de pruebas de componentes ni end-to-end.

## Estructura relevante

| Ruta | Responsabilidad |
| --- | --- |
| `src/pages/` | Home, login, registro, Dashboard, listado de partidos y creación de partidos. |
| `src/components/` | Header, Sidebar, tarjetas, formularios y componentes reutilizables. |
| `src/api/` | Cliente Axios y funciones para consumir recursos REST. |
| `src/types/` | Tipos TypeScript de modelos y cuerpos de entrada. |
| `src/router/ProtectedRoute.tsx` | Componente de protección disponible; revisar su integración en las rutas antes de considerar protegida la navegación del frontend. |
