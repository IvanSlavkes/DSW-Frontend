import api from './client';
import type { MatchTeam, MatchTeamInput } from '../types/match-team';

export async function getMatchTeams(): Promise<MatchTeam[]> {
  const res = await api.get<MatchTeam[]>('/match-teams');
  return res.data;
}

export async function createMatchTeam(
  data: MatchTeamInput,
): Promise<MatchTeam> {
  const res = await api.post<MatchTeam>('/match-teams', data);
  return res.data;
}

export async function updateMatchTeam(
  id: number,
  data: Partial<{ name: string; color: string }>,
): Promise<MatchTeam> {
  const res = await api.put<MatchTeam>(`/match-teams/${id}`, data);
  return res.data;
}

export async function deleteMatchTeam(id: number): Promise<void> {
  await api.delete(`/match-teams/${id}`);
}
