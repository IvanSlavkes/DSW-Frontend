import type { Match } from '../types/match';

interface Props {
  matches: Match[];
  onEdit?: (match: Match) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
  emptyMessage?: string;
}

export default function MatchList({ matches, onEdit, onDelete, showActions = true, emptyMessage = "No hay partidos cargados todavia." }: Props) {
  if (matches.length === 0) {
    return <p className="text-white/70">{emptyMessage}</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {matches.map((match) => (
        <div
          key={match.id}
          className="rounded-lg border border-white/15 p-4 shadow-sm"
        >
          <h3 className="text-lg font-semibold">{match.name}</h3>
          <p className="text-sm text-white/70">
            {match.date.slice(0, 10)} - {match.time}
          </p>
          <p className="text-sm text-white/70">
            Cancha: {match.field?.name ?? `#${match.fieldId}`}
          </p>
          {match.field?.address && <p className="text-sm text-white/70">Dirección: {match.field.address}</p>}
          {match.field?.category?.name && <p className="text-sm text-white/70">{match.field.category.name} · {match.duration} min</p>}
          <p className="text-sm text-white/70">
            Creador:{' '}
            {match.creator
              ? `${match.creator.name} ${match.creator.lastName}`
              : `#${match.creatorId}`}
          </p>
          <p className="text-sm text-white/70">Estado: {match.status}</p>
          {showActions && (onEdit || onDelete) && (
            <div className="mt-3 flex gap-2">
              {onEdit && <button onClick={() => onEdit(match)} className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600">Editar</button>}
              {onDelete && <button onClick={() => onDelete(match.id)} className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600">Eliminar</button>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}




