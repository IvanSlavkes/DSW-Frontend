import { useState } from "react";
import type { Cancha, CanchaInput } from "../types/cancha";

interface Props {
  canchaEditando: Cancha | null;
  onSubmit: (data: CanchaInput) => void;
  onCancel: () => void;
}

const vacio: CanchaInput = {
  nombre: "",
  direccion: "",
  tipo: "",
  localidadId: "",
  localidadNombre: "",
};

export default function CanchaForm({ canchaEditando, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<CanchaInput>(() => {
    if (canchaEditando) {
      const { ...resto } = canchaEditando;
      return resto;
    }
    return vacio;
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
    setForm(vacio);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-3 rounded-lg border border-gray-200 p-4"
    >
      <h2 className="text-lg font-semibold">
        {canchaEditando ? "Editar cancha" : "Nueva cancha"}
      </h2>

      <input
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />
      <input
        name="direccion"
        value={form.direccion}
        onChange={handleChange}
        placeholder="Dirección"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />
      <input
        name="tipo"
        value={form.tipo}
        onChange={handleChange}
        placeholder="Tipo (ej: Fútbol 5)"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />
      <input
        name="localidadId"
        value={form.localidadId}
        onChange={handleChange}
        placeholder="ID de localidad"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />
      <input
        name="localidadNombre"
        value={form.localidadNombre}
        onChange={handleChange}
        placeholder="Nombre de localidad"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          {canchaEditando ? "Guardar cambios" : "Crear cancha"}
        </button>
        {canchaEditando && (
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