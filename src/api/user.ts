import api from './client';
import type { User, UserInput } from '../types/user';

export async function getUsers(): Promise<User[]> {
  const res = await api.get<User[]>('/users');
  return res.data;
}

export async function createUser(data: UserInput): Promise<User> {
  const res = await api.post<User>('/users', data);
  return res.data;
}

export async function updateUser(
  id: number,
  data: Partial<UserInput>,
): Promise<User> {
  const res = await api.put<User>(`/users/${id}`, data);
  return res.data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}
