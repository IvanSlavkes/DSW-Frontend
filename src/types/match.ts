import type { Field } from './field';

export interface Match {
  id: number;
  name: string;
  date: string;
  time: string;
  fieldType: string;
  privacy: string;
  status: string;
  fieldId: number;
  creatorId: number;
  field?: Field;
  creator?: {
    id: number;
    name: string;
    lastName: string;
  };
}

export type MatchInput = {
  name: string;
  date: string;
  time: string;
  fieldType: string;
  privacy: string;
  fieldId: number;
  creatorId: number;
};
