export interface TeamPosition {
  id: number;
  positionType: string;
  status: string;
  role: string;
  matchTeamId: number;
  occupantId?: number;
  requesterId?: number;
  date: string;
  matchTeam?: {
    id: number;
    name: string;
  };
  occupant?: {
    id: number;
    name: string;
    lastName: string;
  };
  requester?: {
    id: number;
    name: string;
    lastName: string;
  };
}

export type TeamPositionInput = {
  positionType: string;
  matchTeamId: number;
  occupantId?: number;
  requesterId?: number;
  role?: string;
};
