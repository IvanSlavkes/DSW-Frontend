# Pantallas y estado funcional

Este documento describe las pantallas conectadas actualmente en el frontend.

## Rutas

| Ruta | Acceso | Funcionalidad |
| --- | --- | --- |
| `/` | Público | Presentación de FUTGO y accesos a registro e inicio de sesión. |
| `/login` | Público | Inicio de sesión; informa credenciales incorrectas y cuentas desactivadas. |
| `/register` | Público | Registro en tres pasos: cuenta; localidad y fecha de nacimiento; posiciones y descripción opcional. Valida edad mínima de 18 años, formato de correo, contraseña y repetición de contraseña. |
| `/dashboard` | Autenticado | Partidos creados y partidos a los que se unió el usuario, datos del perfil y notificaciones. |
| `/matches` | Autenticado | Listado de partidos futuros con filtros por localidad, fecha, posición libre y privacidad, más orden por fecha o precio. |
| `/matches/:id` | Autenticado | Detalle del partido, equipos, lugares, participación del usuario y, para el creador de partidos privados, gestión de solicitudes. |
| `/matches/create` | Autenticado | Creación de partido con cancha, fecha, horario, privacidad, equipo y posiciones iniciales del creador. |
| `/profile` | Autenticado | Consulta y edición del perfil. |
| `/admin` | Administrador | Gestión de usuarios, canchas, categorías, partidos, localidades, equipos, posiciones, notificaciones, calificaciones y amistades. |
| `/dashboard1` | Redirección | Redirige al panel administrativo `/admin`. |

## Flujos principales

### Registro e inicio de sesión

El registro divide los campos en pasos para reducir el tamaño del formulario. El correo debe tener formato válido, la contraseña debe tener al menos seis caracteres y repetirse correctamente, la fecha debe corresponder a una persona de 18 años o más y la posición principal es obligatoria. La segunda posición y la descripción son opcionales; ambas posiciones no pueden ser iguales. El inicio de sesión rechaza cuentas con rol `disabled` y muestra el mensaje “Usuario desactivado”.

### Encontrar y consultar partidos

El listado excluye partidos pasados y permite filtrar por localidad, fecha, privacidad y posición libre. Se puede ordenar por horario o precio. Al abrir una tarjeta se navega a `/matches/:id`, donde se muestran cancha, creador, equipos, integrantes, posiciones y cupos.

### Crear y unirse a partidos

Al crear un partido se generan dos equipos y los lugares disponibles de acuerdo con la categoría de la cancha. El creador ocupa el primer lugar de su equipo y figura como capitán. Unirse a un partido público ocupa un lugar libre; un partido privado envía una solicitud que el creador puede aceptar o rechazar.

### Dashboard y perfil

El Dashboard separa partidos creados de partidos donde el usuario ocupa un lugar. También presenta notificaciones y un resumen del perfil. El encabezado reutilizable muestra avatar con iniciales, nombre y menú para abrir el perfil o cerrar sesión en las páginas autenticadas que usan `AppHeader`.

### Administración

El panel `/admin` está protegido en el frontend y las operaciones administrativas relevantes también requieren rol de administrador en el backend. La gestión de usuarios permite cambiar su rol, incluido `disabled`.

## Diseño adaptable y errores

Las pantallas usan estilos responsive con puntos de quiebre de Tailwind y el menú lateral se superpone en pantallas móviles. Los formularios de registro e inicio de sesión muestran errores junto a los campos o en el formulario; las acciones principales de partidos y perfil muestran mensajes dentro de la pantalla.

El estado de gestión del proyecto y el cumplimiento de los requisitos de Regularidad se resume en el [índice general de documentación](README.md).
