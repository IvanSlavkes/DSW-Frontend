export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  password: string;
  description?: string;
  position: string;
  averageRating: number;
  matchesPlayed: number;
  birthDate: string;
  role: string;
  localityId: string;
  locality?: {
    id: string;
    nombre: string;
  };
}

export type UserInput = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  description?: string;
  position: string;
  birthDate: string;
  localityId: string;
};
