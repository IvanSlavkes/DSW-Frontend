import type { Locality } from '../types/locality';

interface Props {
  localities: Locality[];
  onEdit: (locality: Locality) => void;
  onDelete: (id: string) => void;
}

export default function LocalityList({ localities, onEdit, onDelete }: Props) {
  if (localities.length === 0) {
    return (
      <p className="text-gray-500">No hay localidades cargadas todavia.</p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {localities.map((locality) => (
        <div
          key={locality.id}
          className="rounded-lg border border-gray-200 p-4 shadow-sm"
        >
          <h3 className="text-lg font-semibold">{locality.nombre}</h3>
          <p className="text-sm text-gray-600">ID: {locality.id}</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onEdit(locality)}
              className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(locality.id)}
              className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
