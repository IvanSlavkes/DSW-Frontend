import { useState } from 'react';
import type { TeamPosition, TeamPositionInput } from '../types/team-position';

interface Props {
  teamPositionEditing: TeamPosition | null;
  onCreate: (data: TeamPositionInput) => void;
  onUpdate: (
    data: Partial<{
      status: string;
      role: string;
      occupantId: number;
      requesterId: number;
    }>,
  ) => void;
  onCancel: () => void;
}

const empty: TeamPositionInput = {
  positionType: '',
  matchTeamId: 0,
  occupantId: undefined,
  requesterId: undefined,
  role: 'player',
};

export default function TeamPositionForm({
  teamPositionEditing,
  onCreate,
  onUpdate,
  onCancel,
}: Props) {
  const [createForm, setCreateForm] = useState<TeamPositionInput>(empty);
  const [editForm, setEditForm] = useState({
    status: 'free',
    role: 'player',
    occupantId: '',
    requesterId: '',
  });

  function handleCreateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const isNumberField =
      name === 'matchTeamId' || name === 'occupantId' || name === 'requesterId';
    setCreateForm({
      ...createForm,
      [name]: isNumberField
        ? value === ''
          ? undefined
          : Number(value)
        : value,
    });
  }

  function handleEditChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    onCreate(createForm);
    setCreateForm(empty);
  }

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    onUpdate({
      status: editForm.status,
      role: editForm.role,
      occupantId:
        editForm.occupantId === '' ? undefined : Number(editForm.occupantId),
      requesterId:
        editForm.requesterId === '' ? undefined : Number(editForm.requesterId),
    });
  }

  if (teamPositionEditing) {
    return (
      <form
        onSubmit={handleEditSubmit}
        className="mb-6 flex flex-col gap-3 rounded-lg border border-gray-200 p-4"
      >
        <h2 className="text-lg font-semibold">
          Editar posición ({teamPositionEditing.positionType})
        </h2>

        <div>
          <label className="mb-1 block text-sm text-gray-600">Estado</label>
          <select
            name="status"
            value={editForm.status}
            onChange={handleEditChange}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="free">free</option>
            <option value="occupied">occupied</option>
          </select>
        </div>

        <input
          name="role"
          value={editForm.role}
          onChange={handleEditChange}
          placeholder="Rol (ej. player)"
          className="rounded border border-gray-300 px-3 py-2"
        />

        <div>
          <label className="mb-1 block text-sm text-gray-600">
            ID Ocupante (dejar vacío para ninguno)
          </label>
          <input
            name="occupantId"
            type="number"
            value={editForm.occupantId}
            onChange={handleEditChange}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleCreateSubmit}
      className="mb-6 flex flex-col gap-3 rounded-lg border border-gray-200 p-4"
    >
      <h2 className="text-lg font-semibold">Nueva posición</h2>

      <input
        name="positionType"
        value={createForm.positionType}
        onChange={handleCreateChange}
        placeholder="Tipo de posición (ej. Arquero)"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />

      <div>
        <label className="mb-1 block text-sm text-gray-600">
          ID del Equipo
        </label>
        <input
          name="matchTeamId"
          type="number"
          value={createForm.matchTeamId}
          onChange={handleCreateChange}
          className="w-full rounded border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-600">
          ID Ocupante (opcional)
        </label>
        <input
          name="occupantId"
          type="number"
          value={createForm.occupantId ?? ''}
          onChange={handleCreateChange}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Crear Posición
      </button>
    </form>
  );
}
