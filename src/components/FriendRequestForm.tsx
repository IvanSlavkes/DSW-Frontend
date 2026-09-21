import { useState } from 'react';
import type { FriendRequestInput } from '../types/friend-request';

interface Props {
  onSubmit: (data: FriendRequestInput) => void;
}

const empty: FriendRequestInput = {
  requesterId: 0,
  receiverId: 0,
  status: 'pending',
};

export default function FriendRequestForm({ onSubmit }: Props) {
  const [form, setForm] = useState<FriendRequestInput>(empty);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
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
      <h2 className="text-lg font-semibold">Nueva solicitud de amistad</h2>

      <div>
        <label className="mb-1 block text-sm text-gray-600">
          ID de quien envía
        </label>
        <input
          name="requesterId"
          type="number"
          value={form.requesterId}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-600">
          ID de quien recibe
        </label>
        <input
          name="receiverId"
          type="number"
          value={form.receiverId}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Enviar Solicitud
      </button>
    </form>
  );
}
