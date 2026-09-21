import { useState } from 'react';
import type { MatchTeam, MatchTeamInput } from '../types/match-team';

interface Props {
  matchTeamEditing: MatchTeam | null;
  onSubmit: (data: MatchTeamInput) => void;
  onCancel: () => void;
}

const empty: MatchTeamInput = {
  name: '',
  color: '',
  matchId: 0,
};

export default function MatchTeamForm({
  matchTeamEditing,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<MatchTeamInput>(() => {
    if (matchTeamEditing) {
      return {
        name: matchTeamEditing.name,
        color: matchTeamEditing.color,
        matchId: matchTeamEditing.matchId,
      };
    }
    return empty;
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'matchId' ? Number(value) : value });
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
        {matchTeamEditing ? 'Editar equipo' : 'Nuevo equipo'}
      </h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nombre del equipo (ej. Equipo A)"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />
      <input
        name="color"
        value={form.color}
        onChange={handleChange}
        placeholder="Color (ej. Rojo)"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />

      <div>
        <label className="mb-1 block text-sm text-gray-600">
          ID del Partido
        </label>
        <input
          name="matchId"
          type="number"
          value={form.matchId}
          onChange={handleChange}
          disabled={!!matchTeamEditing}
          className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          required
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          {matchTeamEditing ? 'Guardar Cambios' : 'Crear Equipo'}
        </button>
        {matchTeamEditing && (
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
