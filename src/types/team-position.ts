export interface TeamPosition {
  id: number;
  positionType: string | null;
  secondaryPositionType: string | null;
  guestName: string | null;
  status: string;
  role: string;
  matchTeamId: number;
  occupantId: number | null;
  date: string;
  matchTeam?: {
    id: number;
    name: string;
  };
  occupant?: {
    id: number;
    name: string;
    lastName: string;
  } | null;
}

export type TeamPositionInput = {
  positionType?: string | null | undefined;
  secondaryPositionType?: string | null | undefined;
  guestName?: string | null | undefined;
  matchTeamId: number;
  occupantId?: number | undefined;
  role?: string | undefined;
};

export type TeamPositionUpdateInput = Partial<
  Pick<
    TeamPosition,
    'positionType' | 'secondaryPositionType' | 'guestName' | 'status' | 'role' | 'occupantId'
  >
>;
