# Pantallas y estado del producto

Este documento refleja el comportamiento visible en el código actual, no sustituye los tickets ni las minutas del grupo.

## Rutas

| Ruta | Pantalla |
| --- | --- |
| `/` | Home. |
| `/login` | Inicio de sesión. |
| `/register` | Registro de usuario. |
| `/dashboard` | Dashboard con perfil, notificaciones y próximos partidos disponibles. |
| `/matches` | Listado de partidos próximos, ordenable por horario o precio. |
| `/matches/create` | Formulario para crear partido, elegir cancha, equipo y posiciones del creador. |
| `/dashboard1` | Panel CRUD administrativo/experimental que permanece conectado en el router. |

El listado actual puede ordenarse por horario o precio, pero todavía no tiene filtros. La propuesta desactualizada menciona filtros por localidad, posición, tipo de cancha, día/hora y filtros para jugadores; esos criterios deben volver a validarse con el grupo y los docentes antes de tratarlos como alcance vigente.

## Tarjetas y detalle de partido

Las tarjetas del listado y del Dashboard muestran estado, privacidad, precio estimado por persona, fecha y hora, duración, cancha, dirección, formato, cantidad de jugadores y creador.

La interacción actual de detalle expande información dentro de la tarjeta. Todavía no hay un modal que solicite `GET /matches/:id` al backend ni una vista de jugadores por equipo.

El componente `ProtectedRoute` existe, pero las rutas visibles en `App.tsx` actualmente no están envueltas por él. La API sí exige token para la mayoría de los recursos.

## Decisiones acordadas para el siguiente flujo

- Los partidos privados permanecen visibles y se identifican como privados; unirse requiere aprobación del creador.
- El jugador elige si solicita un lugar en Equipo A o Equipo B.
- Cada usuario puede estar en un solo lugar por partido y no puede cambiar de equipo por ahora.
- El modal debe mostrar Equipo A y Equipo B en columnas, con foto, nombre, apellido y posición de cada jugador. Los lugares vacíos se muestran como “Libre” o como una acción para unirse.
- El creador del partido aprueba o rechaza las solicitudes privadas.

Estos puntos son decisiones de producto acordadas, no funcionalidades ya terminadas. El botón de unión actual es visual y `PositionRequest` aún no tiene endpoints conectados al frontend.
