export interface Rating {
  id: number;
  matchId: number;
  raterId: number;
  ratedId: number;
  stars: number;
  comment: string;
  date: string;
  match?: {
    id: number;
    name: string;
  };
  rater?: {
    id: number;
    name: string;
    lastName: string;
  };
  rated?: {
    id: number;
    name: string;
    lastName: string;
  };
}

export type RatingInput = {
  matchId: number;
  raterId: number;
  ratedId: number;
  stars: number;
  comment: string;
};
