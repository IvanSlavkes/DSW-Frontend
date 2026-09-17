import { useState } from 'react';
import type { NotificationInput } from '../types/notification';

interface Props {
  onSubmit: (data: NotificationInput) => void;
}

const empty: NotificationInput = {
  userId: 0,
  matchId: undefined,
  type: '',
  message: '',
};

export default function NotificationForm({ onSubmit }: Props) {
  const [form, setForm] = useState<NotificationInput>(empty);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === 'userId' || name === 'matchId') {
      setForm({ ...form, [name]: value === '' ? undefined : Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
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
      <h2 className="text-lg font-semibold">Nueva notificación</h2>

      <div>
        <label className="mb-1 block text-sm text-gray-600">
          ID del Usuario
        </label>
        <input
          name="userId"
          type="number"
          value={form.userId}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-600">
          ID del Partido (opcional)
        </label>
        <input
          name="matchId"
          type="number"
          value={form.matchId ?? ''}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <input
        name="type"
        value={form.type}
        onChange={handleChange}
        placeholder="Tipo (ej. match_reminder)"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />
      <input
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Mensaje"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />

      <button
        type="submit"
        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Crear Notificación
      </button>
    </form>
  );
}
