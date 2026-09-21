import api from './client';
import type { Locality, LocalityInput } from '../types/locality';

export async function getLocalities(): Promise<Locality[]> {
  const res = await api.get<Locality[]>('/localities');
  return res.data;
}

export async function createLocality(data: LocalityInput): Promise<Locality> {
  const res = await api.post<Locality>('/localities', data);
  return res.data;
}

export async function updateLocality(
  id: string,
  data: LocalityInput,
): Promise<Locality> {
  const res = await api.put<Locality>(`/localities/${id}`, data);
  return res.data;
}

export async function deleteLocality(id: string): Promise<void> {
  await api.delete(`/localities/${id}`);
}
