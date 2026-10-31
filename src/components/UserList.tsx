import { useMemo, useState } from 'react';
import type { User, UserInput } from '../types/user';
import UserForm from './UserForm';

interface Props {
  users: User[];
  onSave: (user: User, data: UserInput) => void;
  onDelete: (id: number) => void;
}

type SortOption = 'name-asc' | 'name-desc' | 'age-asc' | 'age-desc';

function ageOf(birthDate: string) {
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const beforeBirthday = today.getMonth() < birth.getMonth()
    || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export default function UserList({ users, onSave, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [sort, setSort] = useState<SortOption>('name-asc');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const positions = useMemo(() => [...new Set(users.map((user) => user.position).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es')), [users]);
  const filteredUsers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return users.filter((user) => {
      const matchesQuery = !query
        || `${user.name} ${user.lastName}`.toLocaleLowerCase().includes(query)
        || String(user.id).includes(query);
      const age = ageOf(user.birthDate);
      return matchesQuery
        && (!position || user.position === position)
        && (!minAge || (age !== null && age >= Number(minAge)))
        && (!maxAge || (age !== null && age <= Number(maxAge)));
    }).sort((a, b) => {
      if (sort.startsWith('name')) {
        const result = `${a.name} ${a.lastName}`.localeCompare(`${b.name} ${b.lastName}`, 'es', { sensitivity: 'base' });
        return sort === 'name-asc' ? result : -result;
      }
      const ageA = ageOf(a.birthDate) ?? -1;
      const ageB = ageOf(b.birthDate) ?? -1;
      return sort === 'age-asc' ? ageA - ageB : ageB - ageA;
    });
  }, [users, search, position, minAge, maxAge, sort]);

  return (
    <section className="space-y-3">
      <div className="grid gap-2 rounded-2xl border border-white/10 bg-[#09241B] p-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="flex flex-col gap-1 text-xs text-white/70">Buscar usuarios<input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Buscar jugadores por nombre o ID" className="min-w-0 rounded-lg border border-white/10 bg-[#10372A] px-3 py-2 text-sm text-white" /></label>
        <label className="flex flex-col gap-1 text-xs text-white/70">Posiciones
          <select value={position} onChange={(event) => setPosition(event.target.value)} aria-label="Filtrar por posición" className="rounded-lg border border-white/10 bg-[#10372A] px-3 py-2 text-sm text-white">
            <option value="">Todas las posiciones</option>
            {positions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-white/70">Edad mínima<input type="number" min="0" value={minAge} onChange={(event) => setMinAge(event.target.value)} aria-label="Edad mínima" className="min-w-0 rounded-lg border border-white/10 bg-[#10372A] px-3 py-2 text-sm text-white" /></label>
        <label className="flex flex-col gap-1 text-xs text-white/70">Edad máxima<input type="number" min="0" value={maxAge} onChange={(event) => setMaxAge(event.target.value)} aria-label="Edad máxima" className="min-w-0 rounded-lg border border-white/10 bg-[#10372A] px-3 py-2 text-sm text-white" /></label>
        
        <label className="flex flex-col gap-1 text-xs text-white/70">Filtrar por
          <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} aria-label="Ordenar jugadores" className="rounded-lg border border-white/10 bg-[#10372A] px-3 py-2 text-sm text-white">
            <option value="name-asc">Nombre: A a Z</option>
            <option value="name-desc">Nombre: Z a A</option>
            <option value="age-asc">Edad: menor a mayor</option>
            <option value="age-desc">Edad: mayor a menor</option>
          </select>
        </label>
      </div>

      <p className="px-1 text-xs text-white/60">Mostrando {filteredUsers.length} de {users.length} jugadores</p>
      {filteredUsers.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-[#09241B] px-4 py-5 text-sm text-white/65">No se encontraron jugadores con esos filtros.</p>
      ) : (
        <div className="space-y-2">
          {filteredUsers.map((user) => {
            const expanded = expandedId === user.id;
            return (
              <article key={user.id} className="overflow-hidden rounded-xl border border-white/10 bg-[#09241B]">
                <button type="button" onClick={() => setExpandedId(expanded ? null : user.id)} aria-expanded={expanded} className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-left transition hover:bg-white/5">
                  <span className="min-w-0 flex-1 truncate font-semibold text-white">{user.name} {user.lastName}</span>
                  <span className="text-xs text-white/55">#{user.id}</span>
                  <span className="text-sm text-white/75">{ageOf(user.birthDate) ?? '—'} años</span>
                  <span className="rounded-full bg-[#10372A] px-2.5 py-1 text-xs text-white/80">{user.position || 'Sin posición'}</span>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/75">{user.role}</span>
                  <span className="text-sm text-[#70DB9A]">{expanded ? 'Cerrar' : 'Detalles'}⌄</span>
                </button>
                {expanded && (
                  <div className="border-t border-white/10 p-3 sm:p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-white/60">
                      <span>{user.email}</span>
                      <span>{user.locality?.name ?? 'Sin localidad'} · {user.matchesPlayed} partidos · Promedio {Number(user.averageRating || 0).toFixed(1)}</span>
                    </div>
                    <UserForm key={`${user.id}-${user.role}`} userEditing={user} onSubmit={(data) => onSave(user, data)} onCancel={() => setExpandedId(null)} />
                    <div className="flex justify-end">
                      <button type="button" onClick={() => onDelete(user.id)} className="rounded-lg border border-red-400/30 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-400/10">Eliminar jugador</button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
