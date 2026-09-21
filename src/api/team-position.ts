import api from './client';
import type { TeamPosition, TeamPositionInput } from '../types/team-position';

export async function getTeamPositions(): Promise<TeamPosition[]> {
  const res = await api.get<TeamPosition[]>('/team-positions');
  return res.data;
}

export async function createTeamPosition(
  data: TeamPositionInput,
): Promise<TeamPosition> {
  const res = await api.post<TeamPosition>('/team-positions', data);
  return res.data;
}

export async function updateTeamPosition(
  id: number,
  data: Partial<{
    status: string;
    role: string;
    occupantId: number;
    requesterId: number;
  }>,
): Promise<TeamPosition> {
  const res = await api.put<TeamPosition>(`/team-positions/${id}`, data);
  return res.data;
}

export async function deleteTeamPosition(id: number): Promise<void> {
  await api.delete(`/team-positions/${id}`);
}
