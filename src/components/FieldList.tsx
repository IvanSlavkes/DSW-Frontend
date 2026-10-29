import { useMemo, useState } from 'react';
import type { Field, FieldInput } from '../types/field';
import FieldForm from './FieldForm';

interface Props {
  fields: Field[];
  onSave: (field: Field, data: FieldInput) => void;
  onDelete: (id: number) => void;
}

export default function FieldList({ fields, onSave, onDelete }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [playersPerTeam, setPlayersPerTeam] = useState('');
  const [sort, setSort] = useState('name-asc');

  const formats = useMemo(() => [...new Set(fields.map((field) => field.category?.playersPerTeam).filter((value): value is number => typeof value === 'number'))].sort((a, b) => a - b), [fields]);
  const filteredFields = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return fields.filter((field) => {
      const matchesSearch = !query || field.name.toLocaleLowerCase().includes(query) || String(field.id).includes(query);
      return matchesSearch && (!playersPerTeam || field.category?.playersPerTeam === Number(playersPerTeam));
    }).sort((a, b) => {
      if (sort === 'name-asc' || sort === 'name-desc') {
        const comparison = a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
        return sort === 'name-asc' ? comparison : -comparison;
      }
      if (sort === 'type-asc' || sort === 'type-desc') {
        const comparison = (a.category?.playersPerTeam ?? 0) - (b.category?.playersPerTeam ?? 0);
        return sort === 'type-asc' ? comparison : -comparison;
      }
      return sort === 'price-asc' ? a.price - b.price : b.price - a.price;
    });
  }, [fields, search, playersPerTeam, sort]);

  if (fields.length === 0) return <p className="text-white/65">No hay canchas cargadas todavía.</p>;

  return (
    <div className="space-y-2">
      <div className="grid gap-2 rounded-2xl border border-white/10 bg-[#09241B] p-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs text-white/70">Buscar canchas<input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Buscar canchas por nombre o ID" className="min-w-0 rounded-lg border border-white/10 bg-[#10372A] px-3 py-2 text-sm text-white" /></label>
        <select value={playersPerTeam} onChange={(event) => setPlayersPerTeam(event.target.value)} aria-label="Filtrar por tipo de cancha" className="rounded-lg border border-white/10 bg-[#10372A] px-3 py-2 text-sm text-white">
          <option value="">Todos los tipos</option>
          {formats.map((format) => <option key={format} value={format}>Fútbol {format}</option>)}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar canchas" className="rounded-lg border border-white/10 bg-[#10372A] px-3 py-2 text-sm text-white">
          <option value="name-asc">Nombre: A a Z</option>
          <option value="name-desc">Nombre: Z a A</option>
          <option value="type-asc">Tipo: menor a mayor</option>
          <option value="type-desc">Tipo: mayor a menor</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>
      </div>
      <p className="px-1 text-xs text-white/60">Mostrando {filteredFields.length} de {fields.length} canchas</p>
      {filteredFields.length === 0 && <p className="rounded-xl border border-white/10 bg-[#09241B] px-4 py-5 text-sm text-white/65">No se encontraron canchas con esos filtros.</p>}
      {filteredFields.map((field) => {
        const expanded = expandedId === field.id;
        return (
          <article key={field.id} className="overflow-hidden rounded-xl border border-white/10 bg-[#09241B]">
            <button type="button" aria-expanded={expanded} onClick={() => setExpandedId(expanded ? null : field.id)} className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-left transition hover:bg-white/5">
              <span className="min-w-0 flex-1 truncate font-semibold text-white">{field.name}</span>
              <span className="text-sm text-white/70">{field.locality?.name ?? field.localityId}</span>
              <span className="text-xs text-white/60">{field.category?.name ?? 'Sin categoría'}</span>
              <span className="text-sm font-semibold text-[#70DB9A]">${field.price}</span>
              <span className="text-sm text-[#70DB9A]">{expanded ? 'Cerrar' : 'Detalles'}⌄</span>
            </button>
            {expanded && (
              <div className="border-t border-white/10 p-3 sm:p-4">
                <p className="mb-3 text-xs text-white/60">{field.address} · Fútbol {field.category?.playersPerTeam ?? '—'} por equipo · {field.category?.surfaceType ?? 'Superficie sin especificar'}</p>
                <FieldForm key={`${field.id}-${field.name}-${field.categoryId}-${field.price}-${field.localityId}`} fieldEditing={field} onSubmit={(data) => onSave(field, data)} onCancel={() => setExpandedId(null)} />
                <div className="flex justify-end">
                  <button type="button" onClick={() => onDelete(field.id)} className="rounded-lg border border-red-400/30 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-400/10">Eliminar cancha</button>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
