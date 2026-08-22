import type { Field } from "../types/field";

interface Props {
  fields: Field[];
  onEdit: (field: Field) => void;
  onDelete: (id: number) => void;
}

export default function FieldList({ fields, onEdit, onDelete }: Props) {
  if (fields.length === 0) {
    return <p className="text-gray-500">No hay canchas cargadas todavia.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <div
          key={field.id}
          className="rounded-lg border border-gray-200 p-4 shadow-sm"
        >
          <h3 className="text-lg font-semibold">{field.name}</h3>
          <p className="text-sm text-gray-600">{field.address}</p>
          <p className="text-sm text-gray-600">Type: {field.type}</p>
          <p className="text-sm text-gray-600">
            Localidad: {field.locationName}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onEdit(field)}
              className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(field.id)}
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