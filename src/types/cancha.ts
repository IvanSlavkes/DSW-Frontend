export interface Cancha {
  id: number;
  nombre: string;
  direccion: string;
  tipo: string;
  localidadId: string;
  localidadNombre: string;
}

export type CanchaInput = Omit<Cancha, "id">;