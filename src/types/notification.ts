export interface Notification {
  id: number;
  userId: number;
  matchId?: number;
  type: string;
  message: string;
  date: string;
  read: boolean;
  user?: {
    id: number;
    name: string;
    lastName: string;
  };
  match?: {
    id: number;
    name: string;
  };
}

export type NotificationInput = {
  userId: number;
  matchId?: number;
  type: string;
  message: string;
};
