import api from './client';
import type { Rating, RatingInput } from '../types/rating';

export async function getRatings(): Promise<Rating[]> {
  const res = await api.get<Rating[]>('/ratings');
  return res.data;
}

export async function createRating(data: RatingInput): Promise<Rating> {
  const res = await api.post<Rating>('/ratings', data);
  return res.data;
}

export async function updateRating(
  id: number,
  data: Partial<{ stars: number; comment: string }>,
): Promise<Rating> {
  const res = await api.put<Rating>(`/ratings/${id}`, data);
  return res.data;
}

export async function deleteRating(id: number): Promise<void> {
  await api.delete(`/ratings/${id}`);
}
