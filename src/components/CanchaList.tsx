import type { Cancha } from "../types/cancha";

interface Props {
  canchas: Cancha[];
  onEdit: (cancha: Cancha) => void;
  onDelete: (id: number) => void;
}

export default function CanchaList({ canchas, onEdit, onDelete }: Props) {
  if (canchas.length === 0) {
    return <p className="text-gray-500">No hay canchas cargadas todavía.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {canchas.map((cancha) => (
        <div
          key={cancha.id}
          className="rounded-lg border border-gray-200 p-4 shadow-sm"
        >
          <h3 className="text-lg font-semibold">{cancha.nombre}</h3>
          <p className="text-sm text-gray-600">{cancha.direccion}</p>
          <p className="text-sm text-gray-600">Tipo: {cancha.tipo}</p>
          <p className="text-sm text-gray-600">
            Localidad: {cancha.localidadNombre}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onEdit(cancha)}
              className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(cancha.id)}
              className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
            >
              Borrar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}