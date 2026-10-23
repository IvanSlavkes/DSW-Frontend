import { useState } from 'react';
import type { Match, MatchInput } from '../types/match';

interface Props {
  matchEditing: Match | null;
  onSubmit: (data: MatchInput) => void;
  onCancel: () => void;
}

const empty: MatchInput = {
  name: '',
  description: '',
  date: '',
  time: '',
  duration: 60,
  privacy: 'public',
  fieldId: 0,
  teamAName: '',
};

export default function MatchForm({ matchEditing, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<MatchInput>(() => {
    if (matchEditing) {
      return {
        name: matchEditing.name,
        description: matchEditing.description ?? '',
        date: matchEditing.date.slice(0, 10),
        time: matchEditing.time,
        duration: matchEditing.duration,
        privacy: matchEditing.privacy as MatchInput['privacy'],
        fieldId: matchEditing.fieldId,
        teamAName: matchEditing.teams?.[0]?.name ?? '',
      };
    }
    return empty;
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    const isNumberField = name === 'fieldId' || name === 'duration';
    setForm({ ...form, [name]: isNumberField ? Number(value) : value });
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
        {matchEditing ? 'Editar partido' : 'Nuevo partido'}
      </h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nombre del partido"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />
      <textarea
        name="description"
        value={form.description ?? ''}
        onChange={handleChange}
        placeholder="Descripción (opcional)"
        className="rounded border border-gray-300 px-3 py-2"
      />
      <input
        name="teamAName"
        value={form.teamAName}
        onChange={handleChange}
        placeholder="Nombre de tu equipo"
        maxLength={50}
        className="rounded border border-gray-300 px-3 py-2"
        required
      />
      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        className="rounded border border-gray-300 px-3 py-2"
        required
      />
      <input
        name="time"
        value={form.time}
        onChange={handleChange}
        placeholder="Hora (ej. 20:00)"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />
      <input
        name="duration"
        type="number"
        min="1"
        value={form.duration ?? 60}
        onChange={handleChange}
        className="rounded border border-gray-300 px-3 py-2"
        required
      />
      <select
        name="privacy"
        value={form.privacy}
        onChange={handleChange}
        className="rounded border border-gray-300 px-3 py-2"
      >
        <option value="public">Público</option>
        <option value="private">Privado</option>
      </select>
      <div>
        <label className="mb-1 block text-sm text-gray-600">
          ID de la Cancha
        </label>
        <input
          name="fieldId"
          type="number"
          value={form.fieldId}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 px-3 py-2"
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          {matchEditing ? 'Guardar Cambios' : 'Crear Partido'}
        </button>
        {matchEditing && (
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
