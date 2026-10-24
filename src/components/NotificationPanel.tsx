import { useState } from 'react';
import NotificationList from './NotificationList';
import type { Notification } from '../types/notification';

interface Props {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function NotificationPanel({
  notifications,
  onMarkAsRead,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <section className="rounded-2xl border border-white/15 bg-[#1C2928] text-white shadow-lg">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-controls="notification-panel-body"
        className="flex w-full items-center justify-between gap-3 rounded-2xl p-5 text-left transition hover:bg-white/5 sm:px-6"
      >
        <span className="flex items-center gap-3">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4"
            />
          </svg>
          <span className="text-lg font-bold">Notificaciones</span>
        </span>

        <span className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 9l6 6 6-6"
            />
          </svg>
        </span>
      </button>

      {open && (
        <div
          id="notification-panel-body"
          className="border-t border-white/15 px-5 pb-5 pt-4 sm:px-6"
        >
          <div
            className={`overflow-y-auto pr-1 ${expanded ? 'max-h-[28rem]' : 'max-h-64'}`}
          >
            <NotificationList
              notifications={notifications}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDelete}
            />
          </div>

          {notifications.length > 2 && (
            <button
              type="button"
              onClick={() => setExpanded((previous) => !previous)}
              className="mt-3 w-full rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
            >
              {expanded ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
