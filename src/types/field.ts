export interface Field {
  id: number;
  name: string;
  address: string;
  type: string;
  localityId: string;
}

export type FieldInput = Omit<Field, 'id'>;
