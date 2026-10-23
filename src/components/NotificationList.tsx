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
    return (
      <div className="flex min-h-40 flex-col items-center justify-center gap-3 py-5 text-center text-white/80">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-10 w-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4"
          />
        </svg>
        <p className="max-w-48 text-sm leading-5">
          No tenés notificaciones
          <br />
          por el momento
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded-lg border p-4 shadow-sm ${
            notification.read
              ? 'border-white/15'
              : 'border-white/30 bg-white/10'
          }`}
        >
          <p className="text-xs uppercase text-white/70">{notification.type}</p>
          <p className="text-sm">{notification.message}</p>
          {notification.match && (
            <p className="mt-1 text-xs text-white/70">
              Partido: {notification.match.name}
            </p>
          )}
          <p className="mt-1 text-xs text-white/70">
            {notification.read ? 'Leída' : 'No leída'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {!notification.read && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="whitespace-nowrap rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
              >
                Marcar como leída
              </button>
            )}
            <button
              onClick={() => onDelete(notification.id)}
              className="whitespace-nowrap rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
