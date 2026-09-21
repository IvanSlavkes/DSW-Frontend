export interface FriendRequest {
  id: number;
  requesterId: number;
  receiverId: number;
  status: string;
  date: string;
  requester?: {
    id: number;
    name: string;
    lastName: string;
  };
  receiver?: {
    id: number;
    name: string;
    lastName: string;
  };
}

export type FriendRequestInput = {
  requesterId: number;
  receiverId: number;
  status: string;
};
