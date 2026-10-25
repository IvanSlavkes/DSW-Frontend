import { useEffect, useState } from "react";
import { CalendarDays, Clock3, Eye, LockKeyhole, MapPin, UserRound } from "lucide-react";
import type { Match, PlayerPosition } from "../types/match";
import { getMatchCapacity, isMatchFull } from "../utils/matchAvailability";

interface Props { matches: Match[]; emptyMessage?: string; }
type PositionInfo = { type: PlayerPosition; short: string; color: string };
const positionStyles: PositionInfo[] = [
  { type: "arquero", short: "Arq", color: "bg-amber-400 text-amber-950" },
  { type: "defensor", short: "Def", color: "bg-green-500 text-white" },
  { type: "centrocampista", short: "Md", color: "bg-orange-400 text-orange-950" },
  { type: "delantero", short: "Del", color: "bg-sky-400 text-sky-950" },
];
function formatMatchDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "long" }).format(new Date(year, month - 1, day));
}
function formatPrice(value: number) {
  if (!value) return "Gratis";
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);
}
function MatchDetailsModal({ match, onClose }: { match: Match; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown); document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.style.overflow = ""; };
  }, [onClose]);
  const teams = match.teams ?? [];
  const capacity = getMatchCapacity(match);
  const total = capacity.total;
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-5" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="match-modal-title" className="flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden rounded-none bg-[#F3F6F4] shadow-2xl sm:h-auto sm:max-h-[92dvh] sm:rounded-3xl">
      <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-white p-5 sm:p-7"><div><h2 id="match-modal-title" className="text-xl font-black text-[#1F2B24] sm:text-3xl">{match.name}</h2><p className="mt-2 text-sm text-slate-600">{formatMatchDate(match.date)} · {match.time} · {match.duration} min</p></div><button type="button" onClick={onClose} aria-label="Cerrar detalles" className="rounded-lg bg-slate-100 px-3 py-2 font-bold">Cerrar</button></header>
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-7"><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-white p-4"><b>{match.field?.name ?? `Cancha #${match.fieldId}`}</b><p>{match.field?.address}</p><p>{match.field?.locality?.nombre}</p></div><div className="rounded-2xl bg-white p-4"><b>{formatPrice(match.field?.price ?? 0)}</b><p>Precio de la cancha</p></div><div className="rounded-2xl bg-white p-4"><b>{capacity.confirmed} / {total} jugadores</b><p>{capacity.free} cupos libres</p></div></div>
        <div className="my-4 flex items-center justify-center gap-3 rounded-2xl bg-white p-3 font-black"><span>{teams[0]?.name ?? "Equipo A"}</span><span className="rounded-full bg-[#09241B] px-3 py-1 text-white">VS</span><span>{teams[1]?.name ?? "Equipo B"}</span></div>
        <div className="grid gap-4 sm:grid-cols-2">{[0, 1].map((teamIndex) => { const team = teams[teamIndex]; return <section key={team?.id ?? teamIndex} className="rounded-2xl bg-white p-4"><h3 className="mb-3 font-black">{team?.name ?? `Equipo ${teamIndex ? "B" : "A"}`}</h3><ul className="space-y-2">{(team?.positions ?? []).map((slot) => { const name = slot.guestName || (slot.occupant ? `${slot.occupant.name} ${slot.occupant.lastName}` : ""); const occupied = Boolean(name) || slot.status === "occupied"; return <li key={slot.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span>{name || "Lugar libre"}</span><span className="text-xs text-slate-500">{slot.positionType ?? "Posición sin definir"}</span>{occupied && <span className="text-xs font-bold text-green-700">Confirmado</span>}</li>; })}</ul></section>; })}</div>
      </div><footer className="border-t border-slate-200 bg-white p-4"><button type="button" onClick={onClose} className="w-full rounded-xl bg-[#01AB48] px-5 py-3 font-bold text-white">Cerrar</button></footer>
    </section>
  </div>;
}

export default function AvailableMatchGrid({ matches, emptyMessage = "No hay partidos disponibles." }: Props) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  if (!matches.length) return <p className="rounded-2xl bg-[#09241B] p-6 text-sm text-white/75">{emptyMessage}</p>;
  return <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{matches.map((match) => {
    const capacity = getMatchCapacity(match);
    const total = capacity.total || Number(match.field?.type) * 2;
    const full = isMatchFull(match);
    const isOpen = match.status.toLowerCase() === "open" && !full;
    const freePositions = new Set((match.teams ?? []).flatMap((team) => (team.positions ?? []).filter((p) => p.status === "free" && p.occupantId == null).flatMap((p) => [p.positionType, p.secondaryPositionType])).filter(Boolean));
    const creatorName = match.creator ? `${match.creator.name} ${match.creator.lastName}` : "Usuario";
    const locality = match.field?.locality?.nombre;
    return <article key={match.id} className="flex flex-col rounded-2xl border border-white/10 bg-[#09241B] p-5 text-white shadow-xl">
      <div className="flex items-start justify-between gap-3"><div className="flex flex-wrap gap-2"><span className={`rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide ${isOpen ? "bg-[#01AB48]/20 text-[#54e58c]" : "bg-red-500/20 text-red-200"}`}>{isOpen ? "ABIERTO" : "CERRADO"}</span><span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80">{match.privacy === "public" ? <Eye className="h-3.5 w-3.5"/> : <LockKeyhole className="h-3.5 w-3.5"/>}{match.privacy === "public" ? "Público" : "Privado"}</span></div><strong className="shrink-0 text-lg font-black text-[#54e58c]">{formatPrice(total > 0 ? Math.round((match.field?.price ?? 0) / total) : match.field?.price ?? 0)}</strong></div>
      <h3 className="mt-4 text-lg font-extrabold leading-snug">{match.name}</h3>
      <div className="mt-2 flex items-center gap-2 text-sm text-white/70"><span className="grid h-8 w-8 place-items-center rounded-full bg-white/10"><UserRound className="h-4 w-4"/></span><span>Creado por: <b className="text-white">{creatorName}</b></span></div>
      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-white/70"><CalendarDays className="h-4 w-4 text-[#54e58c]"/><span>{formatMatchDate(match.date)}</span><span>·</span><Clock3 className="h-4 w-4 text-[#54e58c]"/><span>{match.time}</span><span>·</span><span>{match.duration} min</span></div>
      <div className="mt-3 flex items-start gap-2 text-sm text-white/70"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#54e58c]"/><div><p className="font-bold text-white">{match.field?.name ?? `Cancha #${match.fieldId}`}{locality ? ` · ${locality}` : ""}</p><p>{match.field?.address ?? "Dirección no disponible"}</p></div></div>
      <hr className="my-4 border-white/15"/>
      <div className="mb-3 flex items-center justify-between gap-2 text-xs"><span className="font-bold text-white">{capacity.confirmed} / {total || "—"} jugadores</span><span className="font-bold text-[#54e58c]">{capacity.free || Math.max(0, total - capacity.confirmed)} cupos libres</span></div>
      <div className="flex flex-wrap gap-2" aria-label="Posiciones disponibles">{positionStyles.map((position) => freePositions.has(position.type) ? <span key={position.type} title={position.type} className={`grid h-9 min-w-9 place-items-center rounded-full px-2 text-[10px] font-black ${position.color}`}>{position.short}</span> : null)}{freePositions.size === 0 && <span className="text-xs text-white/50">Posiciones libres sin definir</span>}</div>
      <button type="button" onClick={() => setSelectedMatch(match)} className="mt-5 w-full rounded-xl bg-[#01AB48] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#029b42]">Ver partido <span aria-hidden="true">→</span></button>
    </article>;
  })}{selectedMatch && <MatchDetailsModal match={selectedMatch} onClose={() => setSelectedMatch(null)}/>}</div>;
}
