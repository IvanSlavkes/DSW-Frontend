import type { Locality } from "./locality";

export interface Field {
  id: number;
  name: string;
  address: string;
  type: string;
  price: number;
  localityId: string;
  locality?: Locality;
}

export type FieldInput = Omit<Field, "id" | "locality">;  
