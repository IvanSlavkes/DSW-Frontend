import { useState } from 'react';
import type { Locality, LocalityInput } from '../types/locality';

interface Props {
  localityEditing: Locality | null;
  onSubmit: (data: LocalityInput) => void;
  onCancel: () => void;
}

const empty: LocalityInput = {
  nombre: '',
};

export default function LocalityForm({
  localityEditing,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<LocalityInput>(() => {
    if (localityEditing) {
      return { nombre: localityEditing.nombre };
    }
    return empty;
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
    setForm(empty);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-3 rounded-lg border border-gray-200 p-4"
    >
      <h2 className="text-lg font-semibold">
        {localityEditing ? 'Editar localidad' : 'Nueva localidad'}
      </h2>

      <input
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre (ej. Rosario)"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          {localityEditing ? 'Guardar Cambios' : 'Crear Localidad'}
        </button>
        {localityEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
