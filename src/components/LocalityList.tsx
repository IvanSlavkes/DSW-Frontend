import { useMemo, useState } from 'react';
import type { Locality, LocalityInput } from '../types/locality';
import LocalityForm from './LocalityForm';

interface Props {
  localities: Locality[];
  onSave: (locality: Locality, data: LocalityInput) => void;
  onDelete: (id: string) => void;
}

export default function LocalityList({ localities, onSave, onDelete }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'name-asc' | 'name-desc'>('name-asc');
  const filteredLocalities = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return localities
      .filter((locality) => !query || locality.name.toLocaleLowerCase().includes(query))
      .sort((a, b) => {
        const comparison = a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
        return sort === 'name-asc' ? comparison : -comparison;
      });
  }, [localities, search, sort]);

  if (localities.length === 0) return <p className="text-white/65">No hay localidades cargadas todavía.</p>;

  return (
    <div className="space-y-2">
      <div className="grid gap-2 rounded-2xl border border-white/10 bg-[#09241B] p-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-white/70">Buscar localidades<input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Buscar localidades por nombre" className="min-w-0 rounded-lg border border-white/10 bg-[#10372A] px-3 py-2 text-sm text-white" /></label>
        
        <label className="flex flex-col gap-1 text-xs text-white/70">Orderar por
          <select value={sort} onChange={(event) => setSort(event.target.value as 'name-asc' | 'name-desc')} aria-label="Ordenar localidades" className="rounded-lg border border-white/10 bg-[#10372A] px-3 py-2 text-sm text-white">
            <option value="name-asc">Nombre: A a Z</option>
            <option value="name-desc">Nombre: Z a A</option>
          </select>
        </label>

      </div>
      <p className="px-1 text-xs text-white/60">Mostrando {filteredLocalities.length} de {localities.length} localidades</p>
      {filteredLocalities.length === 0 && <p className="rounded-xl border border-white/10 bg-[#09241B] px-4 py-5 text-sm text-white/65">No se encontraron localidades con ese nombre.</p>}
      {filteredLocalities.map((locality) => {
        const expanded = expandedId === locality.id;
        return (
          <article key={locality.id} className="overflow-hidden rounded-xl border border-white/10 bg-[#09241B]">
            <button type="button" aria-expanded={expanded} onClick={() => setExpandedId(expanded ? null : locality.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5">
              <span className="min-w-0 flex-1 truncate font-semibold text-white">{locality.name}</span>
              <span className="text-xs text-white/55">ID: {locality.id}</span>
              <span className="text-sm text-[#70DB9A]">{expanded ? 'Cerrar' : 'Detalles'}⌄</span>
            </button>
            {expanded && (
              <div className="border-t border-white/10 p-3 sm:p-4">
                <LocalityForm key={`${locality.id}-${locality.name}`} localityEditing={locality} onSubmit={(data) => onSave(locality, data)} onCancel={() => setExpandedId(null)} />
                <div className="flex justify-end">
                  <button type="button" onClick={() => onDelete(locality.id)} className="rounded-lg border border-red-400/30 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-400/10">Eliminar localidad</button>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
