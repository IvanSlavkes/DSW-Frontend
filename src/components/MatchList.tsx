import type { Match } from '../types/match';

interface Props {
  matches: Match[];
  onEdit: (match: Match) => void;
  onDelete: (id: number) => void;
}

export default function MatchList({ matches, onEdit, onDelete }: Props) {
  if (matches.length === 0) {
    return <p className="text-gray-500">No hay partidos cargados todavia.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {matches.map((match) => (
        <div
          key={match.id}
          className="rounded-lg border border-gray-200 p-4 shadow-sm"
        >
          <h3 className="text-lg font-semibold">{match.name}</h3>
          <p className="text-sm text-gray-600">
            {match.date.slice(0, 10)} - {match.time}
          </p>
          <p className="text-sm text-gray-600">
            Cancha: {match.field?.name ?? `#${match.fieldId}`}
          </p>
          <p className="text-sm text-gray-600">
            Creador:{' '}
            {match.creator
              ? `${match.creator.name} ${match.creator.lastName}`
              : `#${match.creatorId}`}
          </p>
          <p className="text-sm text-gray-600">Estado: {match.status}</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onEdit(match)}
              className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(match.id)}
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
