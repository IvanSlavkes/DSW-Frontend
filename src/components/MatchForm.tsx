import { useState } from 'react';
import type { Match, MatchInput } from '../types/match';
import { argentinaDateTimeInput, startsAtInputToIso } from '../utils/matchDateTime';

interface Props {
  matchEditing: Match | null;
  onSubmit: (data: MatchInput) => void;
  onCancel: () => void;
}

const empty: MatchInput = {
  name: '',
  description: '',
  startsAt: '',
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
        startsAt: argentinaDateTimeInput(matchEditing.startsAt),
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
    if (name === 'date' || name === 'time') {
      const [currentDate = '', currentTime = ''] = form.startsAt.split('T');
      setForm({
        ...form,
        startsAt: name === 'date' ? `${value}T${currentTime}` : `${currentDate}T${value}`,
      });
      return;
    }
    const isNumberField = name === 'fieldId' || name === 'duration';
    setForm({ ...form, [name]: isNumberField ? Number(value) : value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ ...form, startsAt: startsAtInputToIso(form.startsAt) });
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

      <label className="flex flex-col gap-1 text-sm text-gray-600">Nombre del partido<input name="name" value={form.name} onChange={handleChange} className="rounded border border-gray-300 px-3 py-2" required /></label>
      <label className="flex flex-col gap-1 text-sm text-gray-600">Descripción (opcional)<textarea name="description" value={form.description ?? ''} onChange={handleChange} className="rounded border border-gray-300 px-3 py-2" /></label>
      <label className="flex flex-col gap-1 text-sm text-gray-600">Nombre del equipo<input name="teamAName" value={form.teamAName} onChange={handleChange} maxLength={50} className="rounded border border-gray-300 px-3 py-2" required /></label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-gray-600">Fecha<input name="date" type="date" value={form.startsAt.split('T')[0] ?? ''} onChange={handleChange} className="rounded border border-gray-300 px-3 py-2" required /></label>
        <label className="flex flex-col gap-1 text-sm text-gray-600">Hora<input name="time" type="time" value={form.startsAt.split('T')[1] ?? ''} onChange={handleChange} className="rounded border border-gray-300 px-3 py-2" required /></label>
      </div>
      <label className="flex flex-col gap-1 text-sm text-gray-600">Duración (minutos)<input name="duration" type="number" min="1" value={form.duration ?? 60} onChange={handleChange} className="rounded border border-gray-300 px-3 py-2" required /></label>
      <label className="flex flex-col gap-1 text-sm text-gray-600">Privacidad<select name="privacy" value={form.privacy} onChange={handleChange} className="rounded border border-gray-300 px-3 py-2"><option value="public">Público</option><option value="private">Privado</option></select></label>
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
