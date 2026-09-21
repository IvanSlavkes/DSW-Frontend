import type { TeamPosition } from './team-position';
export interface MatchTeam {
  id: number;
  name: string;
  color: string;
  matchId: number;
  match?: {
    id: number;
    name: string;
  };
  positions?: TeamPosition[];
}

export type MatchTeamInput = {
  name: string;
  color: string;
  matchId: number;
};
