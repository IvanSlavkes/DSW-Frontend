import { useNavigate } from "react-router-dom";
import { CalendarDays, Eye, LockKeyhole, MapPin, UserRound } from "lucide-react";
import type { Match, PlayerPosition } from "../types/match";
import UserAvatar from "./UserAvatar";
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

  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-white/10 border-l-4 border-l-[#01AB48] bg-[#09241B] p-4 text-white shadow-xl sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-1.5">
            <span className={`rounded-lg px-2.5 py-1 text-[10px] font-black tracking-wide ${isOpen ? "bg-[#01AB48]/20 text-[#54e58c]" : full ? "bg-amber-500/20 text-amber-200" : "bg-red-500/20 text-red-200"}`}>{full ? "LLENO" : isOpen ? "ABIERTO" : "CERRADO"}</span>
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
          {players.slice(0, 3).map((player, index) => { const [firstName, ...lastNames] = player.split(/\s+/); return <UserAvatar key={`${player}-${index}`} name={firstName} lastName={lastNames.join(" ")} size="sm" colorIndex={index} className="-ml-1" />; })}
          {hiddenPlayerCount > 0 && <span className="-ml-1 grid h-8 min-w-8 place-items-center rounded-full border-2 border-[#09241B] bg-[#DCE8FF] px-2 text-[10px] font-black text-[#17345B]">+{hiddenPlayerCount}</span>}
        </div>
        <button type="button" onClick={onDetails} className="rounded-xl bg-[#01AB48] px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#029b42]">Ver detalle</button>
      </div>
    </article>
  );
}

export default function AvailableMatchGrid({ matches, emptyMessage = "No hay partidos disponibles.", layout = "grid" }: Props) {
  const navigate = useNavigate();
  if (!matches.length) return <p className="rounded-2xl bg-[#09241B] p-6 text-sm text-white/75">{emptyMessage}</p>;

  return (
    <div className={layout === "list" ? "grid w-full grid-cols-1 gap-4" : "grid w-full grid-cols-1 gap-4 lg:grid-cols-2"}>
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} onDetails={() => navigate(`/matches/${match.id}`)} />
      ))}
    </div>
  );
}
