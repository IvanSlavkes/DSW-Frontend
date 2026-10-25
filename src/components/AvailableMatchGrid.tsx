import { useEffect, useState } from "react";
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

function positionLabel(position: string | null | undefined) {
  if (!position) return "Posición sin definir";
  return position.charAt(0).toLocaleUpperCase("es-AR") + position.slice(1);
}

function MatchDetailsModal({ match, onClose }: { match: Match; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const teams = match.teams ?? [];
  const capacity = getMatchCapacity(match);
  const total = Number(match.field?.type) * 2 || capacity.total;
  const playerCount = Math.max(total, ...teams.map((team) => team.positions?.length ?? 0));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="match-modal-title" className="flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden rounded-none bg-[#F3F6F4] shadow-2xl sm:h-auto sm:max-h-[92dvh] sm:rounded-3xl">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-white p-5 sm:p-7">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap gap-2 text-xs font-bold text-[#08743A]">
              <span className="rounded-full bg-[#DDF3E4] px-3 py-1">{match.privacy === "public" ? "Público" : "Privado · requiere aprobación"}</span>
              {match.field?.type && <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">Fútbol {match.field.type}</span>}
            </div>
            <h2 id="match-modal-title" className="text-xl font-black text-[#1F2B24] sm:text-3xl">{match.name}</h2>
            {match.description && <p className="mt-1 text-sm text-slate-600">{match.description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar detalles" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-xl text-slate-700 hover:bg-slate-200">X</button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-7">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase text-slate-500">Fecha y horario</p><p className="mt-1 font-bold text-[#1F2B24]">{formatMatchDate(match.date)} · {match.time}</p><p className="text-sm text-slate-600">{match.duration} min</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase text-slate-500">Cancha</p><p className="mt-1 font-bold text-[#1F2B24]">{match.field?.name ?? `Cancha #${match.fieldId}`}</p><div className="mt-1 flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-slate-600">{match.field?.address ?? "Dirección no disponible"}</p>{match.field?.address && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match.field.address)}`} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-lg bg-[#E8F0FF] px-3 py-1.5 text-xs font-bold text-[#24466F] transition hover:bg-[#DCE8FF]">Ver en Google Maps</a>}</div></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase text-slate-500">Precio estimado por jugador</p><p className="mt-1 text-xl font-black text-[#08743A]">{formatPrice(total ? Math.round((match.field?.price ?? 0) / total) : 0)}</p><p className="text-sm text-slate-600">Creador: {match.creator ? `${match.creator.name} ${match.creator.lastName}` : "Usuario"}</p></div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-bold uppercase tracking-wide text-[#08743A]">Alineación táctica y convocatoria</p><h3 className="text-xl font-black text-[#1F2B24]">Pizarra de equipos</h3></div><span className="rounded-full bg-white px-3 py-2 text-sm font-bold text-slate-600">{capacity.confirmed}{total ? ` / ${total}` : ""} jugadores confirmados</span></div>
          <div className="my-4 flex items-center justify-center gap-3 rounded-2xl bg-[#E7EEE9] p-3 text-sm font-black text-[#1F2B24]"><span>{teams[0]?.name ?? "Equipo A"}</span><span className="rounded-full bg-white px-3 py-1 text-[#08743A]">VS</span><span>{teams[1]?.name ?? "Equipo B"}</span></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1].map((teamIndex) => {
              const team = teams[teamIndex];
              const positions = team?.positions ?? [];
              const slots = Math.max(positions.length, Math.ceil(playerCount / 2));
              return <section key={team?.id ?? teamIndex} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"><h4 className="mb-3 flex items-center gap-2 font-black text-[#1F2B24]"><span className="h-2.5 w-2.5 rounded-full bg-[#08743A]" />{team?.name ?? `Equipo ${teamIndex ? "B" : "A"}`}</h4><ul className="space-y-2">{Array.from({ length: slots }, (_, index) => {
                const player = positions[index];
                const name = player?.guestName || (player?.occupant ? `${player.occupant.name} ${player.occupant.lastName}` : "");
                const occupied = Boolean(name) || player?.status === "occupied";
                const isCaptain = player?.role?.toLowerCase() === "captain";
                return <li key={player?.id ?? index} className="flex min-h-14 items-center gap-3 rounded-xl bg-[#F5F7F5] px-3 py-2"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-[#D6E4DA] bg-white text-sm font-bold text-[#08743A]">{occupied ? name.charAt(0).toLocaleUpperCase("es-AR") : "+"}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-[#1F2B24]">{occupied ? `${name}${isCaptain ? " (Capitán)" : ""}` : "Lugar libre"}</span><span className="block text-xs text-slate-500">{positionLabel(player?.positionType)}</span></span>{occupied && <span className="rounded-full bg-[#DDF3E4] px-2 py-1 text-[10px] font-bold text-[#08743A]">Confirmado</span>}</li>;
              })}</ul></section>;
            })}
          </div>
          <p className="mt-4 text-center text-xs text-slate-500">La solicitud para unirse a un equipo estará disponible en una próxima etapa.</p>
        </div>
        <footer className="shrink-0 border-t border-slate-200 bg-white p-4 sm:px-7"><button type="button" onClick={onClose} className="w-full rounded-xl bg-green-700 px-5 py-3 font-bold text-white hover:bg-green-800">Cerrar</button></footer>
      </section>
    </div>
  );
}

export default function AvailableMatchGrid({
  matches,
  emptyMessage = "No hay partidos disponibles.",
}: Props) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  if (matches.length === 0) {
    return <p className="text-sm text-slate-600">{emptyMessage}</p>;
  }

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
      {matches.map((match) => {
        const positionCapacity = getMatchCapacity(match);
        const total = Number(match.field?.type) * 2 || positionCapacity.total;
        const capacity = { ...positionCapacity, total, free: Math.max(0, total - positionCapacity.confirmed) };
        const full = isMatchFull(match);
        const isOpen = match.status.toLowerCase() === "open" && !full;

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
            <p className={`mt-1 line-clamp-2 text-sm leading-5 text-slate-600 ${match.description ? "" : "italic"}`}>
              {match.description || "Sin descripción"}
            </p>

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

            <button type="button" onClick={() => setSelectedMatch(match)} className="mt-4 w-full rounded-xl bg-[#DCE8FF] px-4 py-3 text-sm font-extrabold text-[#24466F] transition hover:bg-[#CFDFFF]">Ver partido <span className="ml-2" aria-hidden="true">→</span></button>
          </article>
        );
      })}
      {selectedMatch && <MatchDetailsModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />}
    </div>
  );
}


