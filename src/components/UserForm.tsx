import { useState } from 'react';
import type { User, UserInput } from '../types/user';

interface Props {
  userEditing: User | null;
  onSubmit: (data: UserInput) => void;
  onCancel: () => void;
}

const empty: UserInput = {
  name: '',
  lastName: '',
  email: '',
  password: '',
  description: '',
  position: '',
  birthDate: '',
  localityId: '',
};

export default function UserForm({ userEditing, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<UserInput>(() => {
    if (userEditing) {
      return {
        name: userEditing.name,
        lastName: userEditing.lastName,
        email: userEditing.email,
        password: '',
        description: userEditing.description ?? '',
        position: userEditing.position,
        birthDate: userEditing.birthDate.slice(0, 10),
        localityId: userEditing.localityId,
      };
    }
    return empty;
  });

  const [showPassword, setShowPassword] = useState(false);

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
        {userEditing ? 'Editar usuario' : 'Nuevo usuario'}
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
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        placeholder="Apellido"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />

      <div>
        <label className="mb-1 block text-sm text-gray-600">
          {userEditing
            ? 'Nueva contraseña (dejar vacío para no cambiarla)'
            : 'Contraseña'}
        </label>
        <div className="flex gap-2">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2"
            required={!userEditing}
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </div>

      <input
        name="position"
        value={form.position}
        onChange={handleChange}
        placeholder="Posición (ej. Delantero)"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />
      <input
        name="birthDate"
        type="date"
        value={form.birthDate}
        onChange={handleChange}
        className="rounded border border-gray-300 px-3 py-2"
        required
      />
      <input
        name="localityId"
        value={form.localityId}
        onChange={handleChange}
        placeholder="ID Localidad"
        className="rounded border border-gray-300 px-3 py-2"
        required
      />
      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Descripción (opcional)"
        className="rounded border border-gray-300 px-3 py-2"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          {userEditing ? 'Guardar Cambios' : 'Crear Usuario'}
        </button>
        {userEditing && (
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
