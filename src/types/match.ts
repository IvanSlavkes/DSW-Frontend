import type { Field } from './field';

export type PlayerPosition = 'arquero' | 'defensor' | 'centrocampista' | 'delantero';

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
  teams?: {
    id: number;
    name: string;
    positions?: {
      id: number;
      status: string;
      occupantId: number | null;
      positionType?: string | null;
      secondaryPositionType?: string | null;
      role?: string;
      guestName?: string | null;
      occupant?: { id: number; name: string; lastName: string } | null;
    }[];
  }[];
  creator?: {
    id: number;
    name: string;
    lastName: string;
  };
}

export type MatchInput = {
  name: string;
  description?: string | undefined;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  duration?: number | undefined;
  privacy: "public" | "private";
  fieldId: number;
  teamAName: string;
  positionType?: PlayerPosition | undefined;
  secondaryPositionType?: PlayerPosition | undefined;
};
