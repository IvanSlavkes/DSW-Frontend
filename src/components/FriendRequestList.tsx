import type { FriendRequest } from '../types/friend-request';

interface Props {
  friendRequests: FriendRequest[];
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function FriendRequestList({
  friendRequests,
  onAccept,
  onReject,
  onDelete,
}: Props) {
  if (friendRequests.length === 0) {
    return (
      <p className="text-gray-500">No hay solicitudes cargadas todavia.</p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {friendRequests.map((request) => (
        <div
          key={request.id}
          className="rounded-lg border border-gray-200 p-4 shadow-sm"
        >
          <p className="text-sm">
            {request.requester
              ? `${request.requester.name} ${request.requester.lastName}`
              : `#${request.requesterId}`}
            {' → '}
            {request.receiver
              ? `${request.receiver.name} ${request.receiver.lastName}`
              : `#${request.receiverId}`}
          </p>
          <p className="mt-1 text-sm text-gray-600">Estado: {request.status}</p>
          <div className="mt-3 flex gap-2">
            {request.status === 'pending' && (
              <>
                <button
                  onClick={() => onAccept(request.id)}
                  className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => onReject(request.id)}
                  className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                >
                  Rechazar
                </button>
              </>
            )}
            <button
              onClick={() => onDelete(request.id)}
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
