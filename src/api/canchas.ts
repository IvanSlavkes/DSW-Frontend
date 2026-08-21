import api from "./client";
import type { Cancha, CanchaInput } from "../types/cancha";

export async function getCanchas(): Promise<Cancha[]> {
  const res = await api.get<Cancha[]>("/canchas");
  return res.data;
}

export async function createCancha(data: CanchaInput): Promise<Cancha> {
  const res = await api.post<Cancha>("/canchas", data);
  return res.data;
}

export async function updateCancha(
  id: number,
  data: Partial<CanchaInput>
): Promise<Cancha> {
  const res = await api.put<Cancha>(`/canchas/${id}`, data);
  return res.data;
}

export async function deleteCancha(id: number): Promise<void> {
  await api.delete(`/canchas/${id}`);
}