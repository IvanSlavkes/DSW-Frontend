import { useState } from "react";
import type { Field, FieldInput } from "../types/field";

interface Props {
  fieldEditing: Field | null;
  onSubmit: (data: FieldInput) => void;
  onCancel: () => void;
}

const empty: FieldInput = {
  name: "",
  address: "",
  type: "",
  locationId: "",
  locationName: "",
};

export default function FieldForm({ fieldEditing, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<FieldInput>(() => {
    if (fieldEditing) {
      const { ...rest } = fieldEditing;
      return rest;
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
        {fieldEditing ? "Editar cancha" : "Nueva cancha"}
      </h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nombre"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />
      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Direccion"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />
      <input
        name="type"
        value={form.type}
        onChange={handleChange}
        placeholder="Tipo (ej. Futbol 5)"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />
      <input
        name="locationId"
        value={form.locationId}
        onChange={handleChange}
        placeholder="ID Localidad"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />
      <input
        name="locationName"
        value={form.locationName}
        onChange={handleChange}
        placeholder="Nombre Localidad"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          {fieldEditing ? "Guardar Cambios" : "Crear Cancha"}
        </button>
        {fieldEditing && (
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