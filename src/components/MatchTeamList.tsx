import type { MatchTeam } from '../types/match-team';

interface Props {
  matchTeams: MatchTeam[];
  onEdit: (matchTeam: MatchTeam) => void;
  onDelete: (id: number) => void;
}

export default function MatchTeamList({ matchTeams, onEdit, onDelete }: Props) {
  if (matchTeams.length === 0) {
    return <p className="text-gray-500">No hay equipos cargados todavia.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {matchTeams.map((team) => (
        <div
          key={team.id}
          className="rounded-lg border border-gray-200 p-4 shadow-sm"
        >
          <h3 className="text-lg font-semibold">{team.name}</h3>
          <p className="text-sm text-gray-600">Color: {team.color}</p>
          <p className="text-sm text-gray-600">
            Partido: {team.match?.name ?? `#${team.matchId}`}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onEdit(team)}
              className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(team.id)}
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
