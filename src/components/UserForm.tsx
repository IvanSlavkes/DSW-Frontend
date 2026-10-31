import { useState } from 'react';
import type { User, UserInput } from '../types/user';
import LocalitySelect from './LocalitySelect';
import PositionSelect from './PositionSelect';

interface Props {
  userEditing: User | null;
  onSubmit: (data: UserInput) => void;
  onCancel: () => void;
  profileStyle?: boolean;
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
  role: 'user',
};

export default function UserForm({ userEditing, onSubmit, onCancel, profileStyle = false }: Props) {
  // Inicializamos el estado una sola vez basándonos en userEditing
  const [form, setForm] = useState<UserInput>(() => {
    if (userEditing) {
      return {
        name: userEditing.name,
        lastName: userEditing.lastName,
        email: userEditing.email,
        password: '',
        description: userEditing.description ?? '',
        position: userEditing.position,
        birthDate: userEditing.birthDate ? userEditing.birthDate.slice(0, 10) : '',
        localityId: userEditing.localityId,
        role: ['user', 'moderator', 'admin', 'disabled'].includes(userEditing.role)
          ? userEditing.role as UserInput['role']
          : 'user',
      };
    }
    return empty;
  });

  const [showPassword, setShowPassword] = useState(false);
  const fieldClass = profileStyle
    ? "w-full rounded-xl border border-white/10 bg-[#10372A] px-3 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#01AB48]"
    : "rounded border border-gray-300 bg-white px-3 py-2 text-gray-900";
  const labelClass = `flex flex-col gap-1 text-sm ${profileStyle ? "font-semibold text-white/85" : ""}`;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
    if (!userEditing) {
      setForm(empty);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`mb-6 grid grid-cols-1 gap-3 rounded-lg ${profileStyle ? "text-gray-900 lg:grid-cols-2" : "border border-white/20 p-4 text-white"}`}
    >
      <h2 className={`text-lg font-semibold ${profileStyle ? "text-white lg:col-span-2" : ""}`}>
        {userEditing ? 'Editar usuario' : 'Nuevo usuario'}
      </h2>

      <label className={labelClass}>
        Nombre
        <input name="name" value={form.name} onChange={handleChange} className={fieldClass} required />
      </label>
      <label className={labelClass}>
        Apellido
        <input name="lastName" value={form.lastName} onChange={handleChange} className={fieldClass} required />
      </label>
      <label className={`${labelClass} ${profileStyle ? "lg:col-span-2" : ""}`}>
        Correo electrónico
        <input name="email" type="email" value={form.email} onChange={handleChange} className={fieldClass} required />
      </label>

      <div className={profileStyle ? "lg:col-span-2" : ""}>
        <label className={`mb-1 block text-sm ${profileStyle ? "font-semibold text-white/85" : "text-white/85"}`}>
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
            className={fieldClass}
            required={!userEditing}
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`rounded border px-3 py-2 text-sm ${profileStyle ? "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200" : "border-white/30 bg-[#1F2B24] text-white hover:bg-[#34463A]"}`}
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </div>

      <label className={labelClass}>
        Posición
        <PositionSelect
          value={form.position}
          onChange={(position) => setForm((prev) => ({ ...prev, position }))}
          className={fieldClass}
        />
      </label>

      <label className={labelClass}>
        Rol
        <select
          name="role"
          value={form.role ?? 'user'}
          onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as UserInput['role'] }))}
          className={fieldClass}
        >
          <option value="user">Usuario</option>
          <option value="moderator">Moderador</option>
          <option value="disabled">Desactivado</option>
          {userEditing?.role === 'admin' && <option value="admin" disabled>Administrador (sin cambios)</option>}
        </select>
      </label>
       
      <label className={labelClass}>
        Fecha de nacimiento
        <input name="birthDate" type="date" value={form.birthDate} onChange={handleChange} className={fieldClass} required />
      </label>
      <LocalitySelect 
        localityId={form.localityId} 
        onChange={(localityId) => setForm((prev) => ({ ...prev, localityId }))} 
        labelClassName={profileStyle ? "font-semibold text-white/85" : undefined}
        inputClassName={fieldClass}
      />
      <label className={`${labelClass} ${profileStyle ? "lg:col-span-2" : ""}`}>
        Descripción (opcional)
        <input name="description" value={form.description} onChange={handleChange} className={fieldClass} />
      </label>

      <div className={`flex gap-2 ${profileStyle ? "lg:col-span-2" : ""}`}>
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
            className="rounded bg-gray-300 px-4 py-2 text-gray-900 hover:bg-gray-400"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
