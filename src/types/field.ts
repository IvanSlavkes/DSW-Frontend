import type { Locality } from "./locality";

export interface FieldCategory {
  id: number;
  name: string;
  surfaceType: string;
  playersPerTeam: number;
}

export interface Field {
  id: number;
  name: string;
  address: string;
  categoryId: number;
  category: FieldCategory;
  price: number;
  localityId: string;
  locality?: Locality;
}

export type FieldInput = Omit<Field, "id" | "locality" | "category">;
