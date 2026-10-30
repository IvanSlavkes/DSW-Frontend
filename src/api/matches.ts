import api from './client';
import type { Match, MatchInput, MatchParticipation, PlayerPosition, PositionRequest } from '../types/match';

export async function getMatches(): Promise<Match[]> {
  const res = await api.get<Match[]>('/matches');
  return res.data;
}

export async function getMatch(id: number): Promise<Match> {
  const res = await api.get<Match>(`/matches/${id}`);
  return res.data;
}

export async function getMyMatchParticipation(id: number): Promise<MatchParticipation> {
  const res = await api.get<MatchParticipation>(`/matches/${id}/my-participation`);
  return res.data;
}

export async function getPositionRequests(id: number): Promise<PositionRequest[]> {
  const res = await api.get<PositionRequest[]>(`/matches/${id}/position-requests`);
  return res.data;
}

export async function joinMatch(id: number, teamId: number, positionType: PlayerPosition | null, secondaryPositionType: PlayerPosition | null) {
  const res = await api.post(`/matches/${id}/join`, { teamId, positionType, secondaryPositionType });
  return res.data as { kind: "pending" | "joined" };
}

export async function respondToPositionRequest(id: number, requestId: number, decision: "accepted" | "rejected") {
  await api.patch(`/matches/${id}/position-requests/${requestId}`, { decision });
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
