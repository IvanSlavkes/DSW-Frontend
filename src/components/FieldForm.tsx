import { useState } from "react";
import LocationSelect from "./LocalitySelect";
import type { Field, FieldInput } from "../types/field";

interface Props {
  fieldEditing: Field | null;
  onSubmit: (data: FieldInput) => void;
  onCancel: () => void;
}

const empty = { name: "", address: "", type: "" };

export default function FieldForm({ fieldEditing, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState(() =>
    fieldEditing
      ? { name: fieldEditing.name, address: fieldEditing.address, type: fieldEditing.type }
      : empty
  );
  const [localityId, setLocalityId] = useState(fieldEditing?.localityId ?? "");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ ...form, localityId });
    setForm(empty);
    setLocalityId("");
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold">{fieldEditing ? "Editar cancha" : "Nueva cancha"}</h2>

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
        placeholder="Dirección"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="rounded border border-gray-300 px-3 py-2"
        required
      >
        <option value="">Seleccionar tipo</option>
        <option value="5">Fútbol 5</option>
        <option value="7">Fútbol 7</option>
        <option value="11">Fútbol 11</option>
      </select>

      <LocationSelect localityId={localityId} onChange={setLocalityId} />

      <div className="flex gap-2">
        <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
          {fieldEditing ? "Guardar cambios" : "Crear cancha"}
        </button>
        {fieldEditing && (
          <button type="button" onClick={onCancel} className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}