export interface Field {
  id: number;
  name: string;
  address: string;
  type: string;
  locationId: string;
  locationName: string;
}

export type FieldInput = Omit<Field, "id">;