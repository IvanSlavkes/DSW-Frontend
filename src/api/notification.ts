import api from './client';
import type { Notification, NotificationInput } from '../types/notification';

export async function getNotifications(options: { all?: boolean } = {}): Promise<Notification[]> {
  const res = await api.get<Notification[]>('/notifications', {
    params: options.all ? { all: true } : undefined,
  });
  return res.data;
}

export async function createNotification(
  data: NotificationInput,
): Promise<Notification> {
  const res = await api.post<Notification>('/notifications', data);
  return res.data;
}

export async function markAsRead(id: number): Promise<Notification> {
  const res = await api.put<Notification>(`/notifications/${id}`, {
    read: true,
  });
  return res.data;
}

export async function deleteNotification(id: number): Promise<void> {
  await api.delete(`/notifications/${id}`);
}
