import type { Notification } from '../types/notification';

interface Props {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function NotificationList({
  notifications,
  onMarkAsRead,
  onDelete,
}: Props) {
  if (notifications.length === 0) {
    return <p className="text-gray-500">No hay notificaciones todavia.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded-lg border p-4 shadow-sm ${
            notification.read ? 'border-gray-200' : 'border-blue-400 bg-blue-50'
          }`}
        >
          <p className="text-xs uppercase text-gray-500">{notification.type}</p>
          <p className="text-sm">{notification.message}</p>
          {notification.match && (
            <p className="mt-1 text-xs text-gray-600">
              Partido: {notification.match.name}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {notification.read ? 'Leída' : 'No leída'}
          </p>
          <div className="mt-3 flex gap-2">
            {!notification.read && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
              >
                Marcar como leída
              </button>
            )}
            <button
              onClick={() => onDelete(notification.id)}
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
