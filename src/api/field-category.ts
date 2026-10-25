import api from "./client";
import type { FieldCategory } from "../types/field";

export type FieldCategoryInput = Omit<FieldCategory, "id">;

export async function getFieldCategories(): Promise<FieldCategory[]> {
  const response = await api.get<FieldCategory[]>("/field-categories");
  return response.data;
}

export async function createFieldCategory(data: FieldCategoryInput): Promise<FieldCategory> {
  const response = await api.post<FieldCategory>("/field-categories", data);
  return response.data;
}

export async function updateFieldCategory(id: number, data: Partial<FieldCategoryInput>): Promise<FieldCategory> {
  const response = await api.put<FieldCategory>(`/field-categories/${id}`, data);
  return response.data;
}

export async function deleteFieldCategory(id: number): Promise<void> {
  await api.delete(`/field-categories/${id}`);
}
