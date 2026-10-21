import { useState } from "react";
import type { Match } from "../types/match";
import { getMatchCapacity, isMatchFull } from "../utils/matchAvailability";

interface Props {
  matches: Match[];
  emptyMessage?: string;
}

function formatMatchDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const now = new Date();
  if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()) {
    return "Hoy";
  }
  const formatted = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
  }).format(date);
  return formatted.charAt(0).toLocaleUpperCase("es-AR") + formatted.slice(1);
}

function formatPrice(value: number) {
  if (value === 0) return "Gratis";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AvailableMatchGrid({
  matches,
  emptyMessage = "No hay partidos disponibles.",
}: Props) {
  const [expandedMatchId, setExpandedMatchId] = useState<number | null>(null);

  if (matches.length === 0) {
    return <p className="text-sm text-slate-600">{emptyMessage}</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {matches.map((match) => {
        const positionCapacity = getMatchCapacity(match);
        const total = Number(match.field?.type) * 2 || positionCapacity.total;
        const capacity = { ...positionCapacity, total, free: Math.max(0, total - positionCapacity.confirmed) };
        const full = isMatchFull(match);
        const isOpen = match.status.toLowerCase() === "open" && !full;
        const expanded = expandedMatchId === match.id;

        return (
          <article key={match.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 text-[#1F2B24] shadow-[0_4px_14px_rgba(15,23,42,0.07)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${isOpen ? "bg-[#DDF3E4] text-[#08743A]" : "bg-slate-200 text-slate-700"}`}>
                  <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-[#00843D]" : "bg-[#667085]"}`} />
                  {isOpen ? "Abierto" : full ? "Completo" : match.status}
                </span>
                <span className="rounded-full bg-[#E8F0FF] px-2.5 py-1 text-[11px] font-semibold text-blue-800">
                  {match.privacy === "public" ? "Público" : "Privado"}
                </span>
              </div>
              <strong className="shrink-0 text-lg font-extrabold text-[#08743A]">
                {formatPrice(total > 0 ? Math.round((match.field?.price ?? 0) / total) : (match.field?.price ?? 0))}
              </strong>
            </div>

            <h2 className="mt-4 text-lg font-extrabold leading-snug">{match.name}</h2>
            {match.description && <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">{match.description}</p>}

            <div className="mt-4 flex flex-wrap gap-2 rounded-xl bg-[#EEF4FF] px-3 py-2.5 text-xs font-semibold text-[#24466F]">
              <span>{formatMatchDate(match.date)}</span>
              <span aria-hidden="true">·</span>
              <span>{match.time}</span>
              <span aria-hidden="true">·</span>
              <span>{match.duration} min</span>
            </div>

            <div className="mt-3 rounded-xl bg-[#F7F9F8] px-3 py-3 text-sm text-slate-700">
              <p className="font-bold text-[#1F2B24]">{match.field?.name ?? `Cancha #${match.fieldId}`}</p>
              <p className="mt-0.5 text-slate-600">{match.field?.address ?? "Dirección no disponible"}</p>
              {match.field?.type && <p className="mt-1 text-xs font-semibold text-slate-500">Fútbol {match.field.type}</p>}
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-xs font-semibold text-slate-600">
                <span>Jugadores confirmados</span>
                {capacity.total > 0 ? <span>{capacity.confirmed} / {capacity.total}</span> : <span>Cupos sin configurar</span>}
              </div>
              {capacity.total > 0 && (
                <div className="h-2 overflow-hidden rounded-full bg-[#E5ECF8]">
                  <div className={`h-full rounded-full ${full ? "bg-slate-500" : "bg-green-700"}`} style={{ width: `${Math.min(100, (capacity.confirmed / capacity.total) * 100)}%` }} />
                </div>
              )}
              {capacity.total > 0 && <p className="mt-1.5 text-right text-xs font-bold text-[#08743A]">{capacity.free} cupos libres</p>}
            </div>

            <div className="mt-3 flex items-center gap-2.5 text-sm font-semibold text-[#1F2B24]">
              <span aria-hidden="true" className="h-9 w-9 shrink-0 rounded-full border-2 border-[#D6E4DA] bg-white shadow-inner" />
              <span>{match.creator ? `${match.creator.name} ${match.creator.lastName}` : "Usuario"}</span>
            </div>

            {expanded && (
              <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600">
                <p className="mt-1">{match.privacy === "public" ? "Cualquier jugador puede solicitar un lugar." : "Este partido es privado."}</p>
              </div>
            )}

            <button
              type="button"
              aria-expanded={isOpen ? undefined : expanded}
              onClick={isOpen ? undefined : () => setExpandedMatchId(expanded ? null : match.id)}
              className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-extrabold transition ${isOpen ? "bg-green-700 text-white hover:bg-green-800" : "bg-[#DCE8FF] text-[#24466F] hover:bg-[#CFDFFF]"}`}
            >
              {isOpen ? "Unirse al partido" : expanded ? "Ocultar detalles" : "Ver detalles"}
              <span className="ml-2" aria-hidden="true">→</span>
            </button>
          </article>
        );
      })}
    </div>
  );
}
