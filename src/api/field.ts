import api from "./client";
import type { Field, FieldInput } from "../types/field";

export async function getFields(): Promise<Field[]> {
  const res = await api.get<Field[]>("/fields");
  return res.data;
}

export async function createField(data: FieldInput): Promise<Field> {
  const res = await api.post<Field>("/fields", data);
  return res.data;
}

export async function updateField(
  id: number,
  data: Partial<FieldInput>
): Promise<Field> {
  const res = await api.put<Field>(`/fields/${id}`, data);
  return res.data;
}

export async function deleteField(id: number): Promise<void> {
  await api.delete(`/fields/${id}`);
}