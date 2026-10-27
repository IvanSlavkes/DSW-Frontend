export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  password: string;
  description?: string;
  position: string;
  averageRating: number; // Promedio de las calificaciones recibidas.
  matchesPlayed: number; // Partidos únicos con una calificación dada o recibida.
  birthDate: string;
  role: string;
  localityId: string;
  locality?: {
    id: string;
    name: string;
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
  role?: 'user' | 'moderator' | 'admin';
};
