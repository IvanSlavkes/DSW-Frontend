import api from './client';
import type { Match, MatchInput } from '../types/match';

export async function getMatches(): Promise<Match[]> {
  const res = await api.get<Match[]>('/matches');
  return res.data;
}

export async function getMatch(id: number): Promise<Match> {
  const res = await api.get<Match>(`/matches/${id}`);
  return res.data;
}

export async function createMatch(data: MatchInput): Promise<Match> {
  const res = await api.post<Match>('/matches', data);
  return res.data;
}

export async function updateMatch(
  id: number,
  data: Partial<MatchInput>,
): Promise<Match> {
  const res = await api.put<Match>(`/matches/${id}`, data);
  return res.data;
}

export async function deleteMatch(id: number): Promise<void> {
  await api.delete(`/matches/${id}`);
}
