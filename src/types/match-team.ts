export interface MatchTeam {
  id: number;
  name: string;
  color: string;
  matchId: number;
  match?: {
    id: number;
    name: string;
  };
  positions?: unknown[];
}

export type MatchTeamInput = {
  name: string;
  color: string;
  matchId: number;
};
