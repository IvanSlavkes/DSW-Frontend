import type { User } from '../types/user';

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export default function UserList({ users, onEdit, onDelete }: Props) {
  if (users.length === 0) {
    return <p className="text-gray-500">No hay usuarios cargados todavia.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="rounded-lg border border-gray-200 p-4 shadow-sm"
        >
          <h3 className="text-lg font-semibold">
            {user.name} {user.lastName}
          </h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-600">Posición: {user.position}</p>
          <p className="text-sm text-gray-600">
            Localidad: {user.locality?.nombre ?? user.localityId}
          </p>
          <p className="text-sm text-gray-600">
            Rating: {user.averageRating} - Partidos jugados:{' '}
            {user.matchesPlayed}
          </p>
          <p className="text-xs text-gray-400">Rol: {user.role}</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onEdit(user)}
              className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(user.id)}
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
