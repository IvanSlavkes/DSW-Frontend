import type { TeamPosition } from '../types/team-position';

interface Props {
  teamPositions: TeamPosition[];
  onEdit: (teamPosition: TeamPosition) => void;
  onDelete: (id: number) => void;
}

export default function TeamPositionList({
  teamPositions,
  onEdit,
  onDelete,
}: Props) {
  if (teamPositions.length === 0) {
    return <p className="text-gray-500">No hay posiciones cargadas todavia.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {teamPositions.map((position) => (
        <div
          key={position.id}
          className="rounded-lg border border-gray-200 p-4 shadow-sm"
        >
          <h3 className="text-lg font-semibold">{position.positionType}</h3>
          <p className="text-sm text-gray-600">
            Equipo: {position.matchTeam?.name ?? `#${position.matchTeamId}`}
          </p>
          <p className="text-sm text-gray-600">
            Ocupante:{' '}
            {position.occupant
              ? `${position.occupant.name} ${position.occupant.lastName}`
              : 'Vacante'}
          </p>
          <p className="text-sm text-gray-600">Rol: {position.role}</p>
          <p className="text-sm text-gray-600">Estado: {position.status}</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onEdit(position)}
              className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(position.id)}
              className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
