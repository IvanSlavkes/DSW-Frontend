import { useEffect, useState } from "react";
import { CalendarDays, Eye, LockKeyhole, MapPin, UserRound } from "lucide-react";
import type { Match, PlayerPosition } from "../types/match";
import { getMatchCapacity, isMatchFull } from "../utils/matchAvailability";
import { formatMatchDate, formatMatchTime } from "../utils/matchDateTime";

interface Props { matches: Match[]; emptyMessage?: string; layout?: "grid" | "list"; }
type PositionInfo = { type: PlayerPosition; label: string; short: string; color: string };
const positionStyles: PositionInfo[] = [
  { type: "arquero", label: "Arquero", short: "Arq", color: "bg-amber-400 text-amber-950" },
  { type: "defensor", label: "Defensor", short: "Def", color: "bg-green-500 text-white" },
  { type: "centrocampista", label: "Centrocampista", short: "Med", color: "bg-orange-400 text-orange-950" },
  { type: "delantero", label: "Delantero", short: "Del", color: "bg-sky-400 text-sky-950" },
];
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
      <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 bg-white p-5 sm:p-7"><div><h2 id="match-modal-title" className="text-xl font-black text-[#1F2B24] sm:text-3xl">{match.name}</h2><p className="mt-2 text-sm text-slate-600">{formatMatchDate(match.startsAt)} · {formatMatchTime(match.startsAt)} · {match.duration} min</p></div><button type="button" onClick={onClose} aria-label="Cerrar detalles" className="rounded-lg bg-slate-100 px-3 py-2 font-bold">Cerrar</button></header>
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-7"><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-white p-4"><b>{match.field?.name ?? `Cancha #${match.fieldId}`}</b><p>{match.field?.address}</p><p>{match.field?.locality?.name}</p></div><div className="rounded-2xl bg-white p-4"><b>{formatPrice(match.field?.price ?? 0)}</b><p>Precio de la cancha</p></div><div className="rounded-2xl bg-white p-4"><b>{capacity.confirmed} / {total} jugadores</b><p>{capacity.free} cupos libres</p></div></div>
        <div className="my-4 flex items-center justify-center gap-3 rounded-2xl bg-white p-3 font-black"><span>{teams[0]?.name ?? "Equipo A"}</span><span className="rounded-full bg-[#09241B] px-3 py-1 text-white">VS</span><span>{teams[1]?.name ?? "Equipo B"}</span></div>
        <div className="grid gap-4 sm:grid-cols-2">{[0, 1].map((teamIndex) => { const team = teams[teamIndex]; return <section key={team?.id ?? teamIndex} className="rounded-2xl bg-white p-4"><h3 className="mb-3 font-black">{team?.name ?? `Equipo ${teamIndex ? "B" : "A"}`}</h3><ul className="space-y-2">{(team?.positions ?? []).map((slot) => { const name = slot.guestName || (slot.occupant ? `${slot.occupant.name} ${slot.occupant.lastName}` : ""); const occupied = Boolean(name) || slot.status === "occupied"; return <li key={slot.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span>{name || "Lugar libre"}</span><span className="text-xs text-slate-500">{slot.positionType ?? "Posición sin definir"}</span>{occupied && <span className="text-xs font-bold text-green-700">Confirmado</span>}</li>; })}</ul></section>; })}</div>
      </div><footer className="border-t border-slate-200 bg-white p-4"><button type="button" onClick={onClose} className="w-full rounded-xl bg-[#01AB48] px-5 py-3 font-bold text-white">Cerrar</button></footer>
    </section>
  </div>;
}

function MatchCard({ match, onDetails }: { match: Match; onDetails: () => void }) {
  const capacity = getMatchCapacity(match);
  const total = capacity.total || (match.field?.category?.playersPerTeam ?? 0) * 2;
  const confirmed = capacity.confirmed;
  const remaining = total > 0 ? Math.max(0, total - confirmed) : null;
  const progress = total > 0 ? Math.min(100, Math.round((confirmed / total) * 100)) : 0;
  const full = isMatchFull(match);
  const isOpen = match.status.toLowerCase() === "open" && !full;
  const slots = match.teams?.flatMap((team) => team.positions ?? []) ?? [];
  const freePositions = new Set(slots
    .filter((slot) => slot.status === "free" && slot.occupantId == null)
    .flatMap((slot) => [slot.positionType?.toLowerCase(), slot.secondaryPositionType?.toLowerCase()])
    .filter(Boolean));
  const positionLabels = positionStyles
    .filter((position) => freePositions.has(position.type))
    .map((position) => position.label);
  const creatorName = match.creator ? `${match.creator.name} ${match.creator.lastName}` : "Usuario";
  const locality = match.field?.locality?.name;
  const pricePerPlayer = total > 0 ? Math.round((match.field?.price ?? 0) / total) : match.field?.price ?? 0;
  const players = [...new Set(slots
    .filter((slot) => slot.status === "occupied" || slot.occupantId != null)
    .map((slot) => slot.guestName || (slot.occupant ? `${slot.occupant.name} ${slot.occupant.lastName}` : ""))
    .filter(Boolean))];
  const hiddenPlayerCount = Math.max(players.length - 3, confirmed - Math.min(players.length, 3), 0);
  const initials = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");

  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-white/10 border-l-4 border-l-[#01AB48] bg-[#09241B] p-4 text-white shadow-xl sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-1.5">
            <span className={`rounded-lg px-2.5 py-1 text-[10px] font-black tracking-wide ${isOpen ? "bg-[#01AB48]/20 text-[#54e58c]" : "bg-red-500/20 text-red-200"}`}>{isOpen ? "ABIERTO" : "CERRADO"}</span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/85">{match.privacy === "public" ? <Eye className="h-3.5 w-3.5"/> : <LockKeyhole className="h-3.5 w-3.5"/>}{match.privacy === "public" ? "Público" : "Privado"}</span>
            {match.field?.category?.name && <span className="rounded-lg border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/85">{match.field.category.name}</span>}
          </div>
          <h3 className="mt-2 text-lg font-extrabold leading-snug sm:text-xl">{match.name}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-white/70"><UserRound className="h-3.5 w-3.5"/><span>Creado por: <b className="text-white">{creatorName}</b></span></div>
        </div>
        <div className="shrink-0 text-right">
          <strong className="block text-lg font-black leading-tight text-[#54e58c] sm:text-xl">{formatPrice(pricePerPlayer)}</strong>
          <span className="text-[11px] text-white/65">por jugador</span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 rounded-xl bg-white/[0.06] p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_minmax(250px,1fr)] lg:items-center">
        <div className="space-y-2 text-sm text-white/80">
          <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 shrink-0 text-[#54e58c]"/><span className="font-semibold">{formatMatchDate(match.startsAt)} · {formatMatchTime(match.startsAt)} hs ({match.duration} min)</span></div>
          <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#54e58c]"/><span><b className="text-white">{match.field?.name ?? `Cancha #${match.fieldId}`}{locality ? ` · ${locality}` : ""}</b>{match.field?.address ? ` — ${match.field.address}` : ""}</span></div>
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
            <span className="font-bold text-white">Cupos: {confirmed} de {total || "—"} confirmados</span>
            <span className="font-bold text-[#54e58c]">{remaining === null ? "Cupos sin definir" : remaining ? `Faltan ${remaining} jugadores` : "Partido completo"}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-label="Cupos confirmados" aria-valuemin={0} aria-valuemax={total} aria-valuenow={Math.min(confirmed, total)}>
            <div className="h-full rounded-full bg-[#01AB48] transition-[width]" style={{ width: `${progress}%` }}/>
          </div>
          <p className="mt-2 text-xs leading-5 text-white/65">Buscando: <span className="font-semibold text-white/85">{positionLabels.length ? positionLabels.join(" · ") : "posiciones sin definir"}</span></p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center pl-1" aria-label={`${confirmed} jugadores confirmados`}>
          {players.slice(0, 3).map((player, index) => <span key={`${player}-${index}`} title={player} className={`-ml-1 grid h-8 w-8 place-items-center rounded-full border-2 border-[#09241B] text-[10px] font-black text-white ${["bg-[#55708D]", "bg-[#01AB48]", "bg-[#6B668C]"][index]}`}>{initials(player)}</span>)}
          {hiddenPlayerCount > 0 && <span className="-ml-1 grid h-8 min-w-8 place-items-center rounded-full border-2 border-[#09241B] bg-[#DCE8FF] px-2 text-[10px] font-black text-[#17345B]">+{hiddenPlayerCount}</span>}
        </div>
        <button type="button" onClick={onDetails} className="rounded-xl bg-[#01AB48] px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#029b42]">Ver detalle</button>
      </div>
    </article>
  );
}

export default function AvailableMatchGrid({ matches, emptyMessage = "No hay partidos disponibles.", layout = "grid" }: Props) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  if (!matches.length) return <p className="rounded-2xl bg-[#09241B] p-6 text-sm text-white/75">{emptyMessage}</p>;

  return (
    <div className={layout === "list" ? "grid w-full grid-cols-1 gap-4" : "grid w-full grid-cols-1 gap-4 lg:grid-cols-2"}>
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} onDetails={() => setSelectedMatch(match)} />
      ))}
      {selectedMatch && <MatchDetailsModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />}
    </div>
  );
}
