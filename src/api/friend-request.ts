import api from './client';
import type {
  FriendRequest,
  FriendRequestInput,
} from '../types/friend-request';

export async function getFriendRequests(): Promise<FriendRequest[]> {
  const res = await api.get<FriendRequest[]>('/friend-requests');
  return res.data;
}

export async function createFriendRequest(
  data: FriendRequestInput,
): Promise<FriendRequest> {
  const res = await api.post<FriendRequest>('/friend-requests', data);
  return res.data;
}

export async function updateFriendRequestStatus(
  id: number,
  status: 'accepted' | 'rejected',
): Promise<FriendRequest> {
  const res = await api.put<FriendRequest>(`/friend-requests/${id}`, {
    status,
  });
  return res.data;
}

export async function deleteFriendRequest(id: number): Promise<void> {
  await api.delete(`/friend-requests/${id}`);
}
