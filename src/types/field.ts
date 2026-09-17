export interface Field {
  id: number;
  name: string;
  address: string;
  type: string;
  locationId: string;
  localityId: string;
}

export type FieldInput = Omit<Field, 'id'>;
