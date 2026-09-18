import { useState } from 'react';
import type { Rating, RatingInput } from '../types/rating';

interface Props {
  ratingEditing: Rating | null;
  onSubmit: (data: RatingInput) => void;
  onCancel: () => void;
}

const empty: RatingInput = {
  matchId: 0,
  raterId: 0,
  ratedId: 0,
  stars: 5,
  comment: '',
};

export default function RatingForm({
  ratingEditing,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<RatingInput>(() => {
    if (ratingEditing) {
      return {
        matchId: ratingEditing.matchId,
        raterId: ratingEditing.raterId,
        ratedId: ratingEditing.ratedId,
        stars: ratingEditing.stars,
        comment: ratingEditing.comment,
      };
    }
    return empty;
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    const isNumberField =
      name === 'matchId' ||
      name === 'raterId' ||
      name === 'ratedId' ||
      name === 'stars';
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
        {ratingEditing ? 'Editar calificación' : 'Nueva calificación'}
      </h2>

      <div>
        <label className="mb-1 block text-sm text-gray-600">
          ID del Partido
        </label>
        <input
          name="matchId"
          type="number"
          value={form.matchId}
          onChange={handleChange}
          disabled={!!ratingEditing}
          className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-600">
          ID de quien califica
        </label>
        <input
          name="raterId"
          type="number"
          value={form.raterId}
          onChange={handleChange}
          disabled={!!ratingEditing}
          className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-600">
          ID de quien es calificado
        </label>
        <input
          name="ratedId"
          type="number"
          value={form.ratedId}
          onChange={handleChange}
          disabled={!!ratingEditing}
          className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-600">
          Estrellas (1 a 5)
        </label>
        <select
          name="stars"
          value={form.stars}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>

      <textarea
        name="comment"
        value={form.comment}
        onChange={handleChange}
        placeholder="Comentario"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          {ratingEditing ? 'Guardar Cambios' : 'Crear Calificación'}
        </button>
        {ratingEditing && (
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
