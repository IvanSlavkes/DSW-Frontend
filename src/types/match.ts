import type { Field } from './field';

export type PlayerPosition = 'arquero' | 'defensor' | 'centrocampista' | 'delantero';

export interface Match {
  id: number;
  name: string;
  description: string | null;
  startsAt: string;
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

export interface MatchParticipation {
  isCreator: boolean;
  position: { id: number; positionType: string | null; secondaryPositionType: string | null; matchTeam: { id: number; name: string } } | null;
  request: { id: number; status: "pending" | "accepted" | "rejected"; positionType: string | null; secondaryPositionType: string | null; matchTeam: { id: number; name: string } } | null;
}

export interface PositionRequest {
  id: number;
  status: "pending" | "accepted" | "rejected";
  positionType: string | null;
  secondaryPositionType: string | null;
  user: { id: number; name: string; lastName: string };
  matchTeam: { id: number; name: string };
}

export type MatchInput = {
  name: string;
  description?: string | undefined;
  startsAt: string; // ISO 8601 con offset explícito
  duration?: number | undefined;
  privacy: "public" | "private";
  fieldId: number;
  teamAName: string;
  positionType?: PlayerPosition | undefined;
  secondaryPositionType?: PlayerPosition | undefined;
};
