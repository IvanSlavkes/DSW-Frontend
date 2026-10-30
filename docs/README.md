# Documentación de FUTGO — Regularidad

FUTGO es una aplicación web full stack para encontrar partidos de fútbol y organizar equipos. El frontend y el backend son repositorios independientes que se comunican mediante una API REST.

Esta documentación cubre por ahora la entrega de **Regularidad**. No incluye los requisitos de Aprobación.

## Propuesta y repositorios

- **Propuesta de Regularidad:** archivo `proposal.md` en `Documentacion/Mis Archivos`, carpeta compartida fuera de este repositorio; adjuntarlo según el mecanismo de entrega de la cátedra.
- **Frontend:** [DSW-Frontend](https://github.com/IvanSlavkes/DSW-Frontend), [historial de commits](https://github.com/IvanSlavkes/DSW-Frontend/commits/main) y [pull requests](https://github.com/IvanSlavkes/DSW-Frontend/pulls). **PR de entrega requerido:** falta agregar el enlace específico.
- **Backend:** [DSW-Backend](https://github.com/IvanSlavkes/DSW-Backend), [historial de commits](https://github.com/IvanSlavkes/DSW-Backend/commits/main) y [pull requests](https://github.com/IvanSlavkes/DSW-Backend/pulls). **PR de entrega requerido:** falta agregar el enlace específico.

## Alcance funcional declarado para Regularidad

El grupo tiene tres integrantes; la propuesta contempla tres CRUD simples, dos CRUD dependientes, dos listados filtrables con detalle y dos casos de uso principales.

| Requisito | Funcionalidad de FUTGO | Estado observado |
| --- | --- | --- |
| CRUD simple | Usuarios, localidades y categorías de cancha. | Implementados mediante perfil/administración y gestión de localidades y categorías. |
| CRUD dependiente | Canchas, relacionadas con localidad y categoría; partidos, relacionados con cancha, equipos y posiciones. | Implementados. |
| Listado filtrable y detalle | Partidos filtrables por localidad, fecha, posición libre y privacidad; el detalle abre una página del partido. | Implementado. |
| Segundo listado filtrable y detalle | Jugadores filtrables por posición y rango de edad en el panel administrativo; la selección expande información y edición. | Implementado en administración; confirmar con la cátedra que ese alcance satisface el listado previsto. |
| Casos de uso | Crear un partido y unirse a un partido; el registro habilita la participación. | Implementados. En partidos privados la unión genera una solicitud que aprueba o rechaza el creador. |

La descripción completa y el diagrama del alcance están en la propuesta entregable ubicada en `Documentacion/Mis Archivos/proposal.md`. El estado de pantallas se detalla en [product-status.md](product-status.md).

## Instalación y ejecución

- [Guía de instalación y ejecución del frontend](setup.md).
- [Guía de instalación y ejecución del backend](https://github.com/IvanSlavkes/DSW-Backend/blob/main/docs/setup.md).
- [README principal del backend](https://github.com/IvanSlavkes/DSW-Backend#readme).

## Gestión y seguimiento del grupo

Las pautas requieren metodología de trabajo, minutas de reuniones y seguimiento de features, bugs e issues. Las minutas quedan pendientes. El grupo informa que todavía no tiene un archivo de issues; debe acordar dónde registrará el seguimiento y enlazar ese recurso antes de entregar.

- **Metodología utilizada:** pendiente de registrar.
- **Seguimiento de features, bugs e issues:** no hay archivo de issues disponible; falta definir y enlazar el registro del grupo.
- **Minutas de reunión y avance:** pendientes de incorporar o enlazar.
- **Pull requests de entrega:** los commits e historiales ayudan a ver los cambios, pero no reemplazan los enlaces a PR/MR requeridos por las pautas. Agregar los enlaces específicos o consultar a la cátedra si el grupo trabajó sin PR.

La documentación técnica describe el código y no reemplaza esos registros de trabajo grupal.

## Guías técnicas del frontend

- [Instalación, ejecución y estructura](setup.md).
- [Pantallas y estado funcional](product-status.md).

El backend mantiene su propio [índice de documentación](https://github.com/IvanSlavkes/DSW-Backend/tree/main/docs).
