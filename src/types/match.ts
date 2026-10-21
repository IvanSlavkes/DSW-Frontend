import type { Field } from './field';

export interface Match {
  id: number;
  name: string;
  description: string | null;
  date: string;
  time: string;
  duration: number;
  createdAt: string;
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
  description?: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  duration?: number;
  privacy: string;
  fieldId: number;
  creatorId: number;
};
