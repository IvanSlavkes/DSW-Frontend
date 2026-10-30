import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CalendarDays, Clock3, Goal, MapPin, LockKeyhole, UserRound, Eye } from "lucide-react";
import AppHeader from "../components/AppHeader";
import Sidebar from "../components/Sidebar";
import UserAvatar from "../components/UserAvatar";
import { getMatch, getMyMatchParticipation, getPositionRequests, joinMatch, respondToPositionRequest } from "../api/matches";
import { useSidebar } from "../hooks/useSidebar";
import type { Match, MatchParticipation, PlayerPosition, PositionRequest } from "../types/match";
import { getMatchCapacity } from "../utils/matchAvailability";
import { formatMatchDate, formatMatchTime } from "../utils/matchDateTime";

const positions: { value: PlayerPosition; label: string }[] = [
  { value: "arquero", label: "Arquero" },
  { value: "defensor", label: "Defensor" },
  { value: "centrocampista", label: "Mediocampista" },
  { value: "delantero", label: "Delantero" },
];

function formatPrice(value: number) {
  if (!value) return "Gratis";
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);
}

function dayLabel(startsAt: string) {
  const start = new Date(startsAt);
  const now = new Date();
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const diff = Math.round((startDay - today) / 86_400_000);
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Mañana";
  return formatMatchDate(startsAt);
}

function endTime(startsAt: string, minutes: number) {
  return formatMatchTime(new Date(new Date(startsAt).getTime() + minutes * 60_000).toISOString());
}

function mapsUrl(parts: (string | undefined)[]) {
  const query = parts.filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function positionLabel(primary?: string | null, secondary?: string | null) {
  const labels = [primary, secondary].filter(Boolean).map((value) => positions.find((item) => item.value === value)?.label ?? value);
  return labels.length ? labels.join(" · ") : "Comodín";
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.mensaje;
    if (typeof message === "string") return message;
  }
  return "No se pudo completar la acción. Intentá de nuevo.";
}

export default function MatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { open: mobileSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const matchId = Number(id);
  const invalidMatchId = !id || !Number.isInteger(matchId) || matchId <= 0;
  const [match, setMatch] = useState<Match | null>(null);
  const [participation, setParticipation] = useState<MatchParticipation | null>(null);
  const [requests, setRequests] = useState<PositionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [teamId, setTeamId] = useState("");
  const [positionType, setPositionType] = useState<PlayerPosition | "">("");
  const [secondaryPositionType, setSecondaryPositionType] = useState<PlayerPosition | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [respondingRequestId, setRespondingRequestId] = useState<number | null>(null);

  const reload = useCallback(async () => {
    const [freshMatch, myParticipation, pendingRequests] = await Promise.all([
      getMatch(matchId),
      getMyMatchParticipation(matchId),
      getPositionRequests(matchId).catch(() => [] as PositionRequest[]),
    ]);
    setMatch(freshMatch);
    setParticipation(myParticipation);
    setRequests(pendingRequests);
  }, [matchId]);

  useEffect(() => {
    let cancelled = false;
    if (invalidMatchId) return;
    Promise.all([getMatch(matchId), getMyMatchParticipation(matchId), getPositionRequests(matchId).catch(() => [] as PositionRequest[])])
      .then(([loadedMatch, myParticipation, pendingRequests]) => {
        if (cancelled) return;
        setMatch(loadedMatch);
        setParticipation(myParticipation);
        setRequests(pendingRequests);
      })
      .catch((loadError: unknown) => {
        if (cancelled) return;
        if (axios.isAxiosError(loadError) && loadError.response?.status === 404) setError("No encontramos ese partido.");
        else if (axios.isAxiosError(loadError) && [401, 403].includes(loadError.response?.status ?? 0)) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        } else setError("No se pudo cargar el partido. Intentá de nuevo.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, matchId, invalidMatchId, navigate]);

  async function handleJoin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!teamId) return;
    setSubmitting(true);
    setActionError(null);
    setActionMessage(null);
    try {
      const result = await joinMatch(matchId, Number(teamId), positionType || null, secondaryPositionType || null);
      setActionMessage(result.kind === "pending" ? "Solicitud enviada. Quedará pendiente hasta que el creador responda." : "¡Ya estás dentro del partido!");
      await reload();
    } catch (actionLoadError) {
      setActionError(getErrorMessage(actionLoadError));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRequestResponse(requestId: number, decision: "accepted" | "rejected") {
    setRespondingRequestId(requestId);
    setActionError(null);
    setActionMessage(null);
    try {
      await respondToPositionRequest(matchId, requestId, decision);
      setActionMessage(decision === "accepted" ? "Solicitud aceptada." : "Solicitud rechazada.");
      await reload();
    } catch (actionLoadError) {
      setActionError(getErrorMessage(actionLoadError));
    } finally {
      setRespondingRequestId(null);
    }
  }

  const capacity = match ? getMatchCapacity(match) : null;
  const total = capacity?.total ?? 0;
  const playerPrice = match && total > 0 ? Math.round((match.field?.price ?? 0) / total) : match?.field?.price ?? 0;
  const isFull = Boolean(match && (match.status.toLowerCase() === "full" || (capacity && capacity.total > 0 && capacity.free === 0)));
  const alreadyJoined = Boolean(participation?.position);
  const ownRequest = participation?.request;
  const canJoin = Boolean(match && participation && !participation.isCreator && !alreadyJoined && ownRequest?.status !== "pending" && !isFull && match.status.toLowerCase() !== "closed");

  const isOpen = match?.status.toLowerCase() === "open";
  const freeSlots = capacity?.free ?? 0;
  const sideSize = total > 0 ? Math.floor(total / 2) : null;
  const statusText = isFull
    ? "COMPLETO"
    : isOpen
      ? freeSlots > 0
        ? `ABIERTO · ${freeSlots === 1 ? "Queda 1 plaza" : `Quedan ${freeSlots} plazas`}`
        : "ABIERTO"
      : (match?.status ?? "").toUpperCase();
  const modeText = match?.field?.category?.name ?? (sideSize ? `Modo ${sideSize} vs ${sideSize}` : null);

  return (
    <div className="flex h-dvh min-h-screen w-full overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/Fondo.jpg')" }}>
      <div className="flex h-full w-full flex-col bg-[#061910]/55">
        <AppHeader mobileSidebarOpen={mobileSidebarOpen} onToggleSidebar={toggleSidebar} />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <Sidebar open={mobileSidebarOpen} onNavigate={closeSidebar} />
          <main className="min-w-0 flex-1 overflow-y-auto px-3 py-5 text-white sm:px-5 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-5 px-4 sm:px-6">
              <button type="button" onClick={() => navigate("/matches")} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m15 18-6-6 6-6" /><path d="M20 12H9" /></svg> Volver a partidos
              </button>
              {loading && !invalidMatchId && <p className="rounded-2xl bg-[#09241B] p-6">Cargando partido...</p>}
              {(invalidMatchId || error) && <section role="alert" className="rounded-2xl border border-white/10 bg-[#09241B] p-6"><p>{invalidMatchId ? "El partido solicitado no es válido." : error}</p><button type="button" onClick={() => navigate("/matches")} className="mt-4 rounded-xl bg-[#01AB48] px-4 py-2 font-bold">Explorar partidos</button></section>}
              {match && <>
                <section className="rounded-2xl border border-white/10 bg-[#09241B] p-5 shadow-xl sm:p-8">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <span className={`rounded-lg px-3 py-1 text-xs font-bold ${isFull ? "bg-amber-400/20 text-amber-200" : isOpen ? "bg-[#01AB48]/20 text-[#54e58c]" : "bg-white/10 text-white/75"}`}>
                          {statusText}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1 text-xs font-bold">
                          {match.privacy === "public" ? <Eye className="h-3.5 w-3.5" /> : <LockKeyhole className="h-3.5 w-3.5" />}
                          {match.privacy === "public" ? "Público" : "Privado"}
                        </span>
                        {modeText && <span className="rounded-lg bg-white/10 px-3 py-1 text-xs font-bold">{modeText}</span>}
                      </div>

                      <h1 className="mt-4 text-3xl font-black sm:text-4xl">{match.name}</h1>

                      {match.description?.trim() ? (
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/75">{match.description}</p>
                      ) : (
                        <p className="mt-2 text-sm italic text-white/45">Sin descripción</p>
                      )}
                    </div>

                    <div className="shrink-0 rounded-2xl bg-white/[0.06] p-4 lg:min-w-44 lg:text-right">
                      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-white/55 lg:justify-end">
                        <Goal className="h-3.5 w-3.5" /> Precio por jugador
                      </p>
                      <p className="mt-1 text-3xl font-black text-[#54e58c]">{formatPrice(playerPrice)}</p>
                      <p className="mt-0.5 text-xs text-white/55">Estimado</p>
                    </div>
                  </div>
                </section>

                <div className="grid gap-3 md:grid-cols-3">
                  <Info
                    icon={<CalendarDays />}
                    label="Fecha y horario"
                    value={`${dayLabel(match.startsAt)}, ${formatMatchTime(match.startsAt)} - ${endTime(match.startsAt, match.duration)} hs`}
                  >
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-white/60">
                      <Clock3 className="h-3 w-3" /> {match.duration} minutos de juego
                    </p>
                  </Info>

                  <Info
                    icon={<MapPin />}
                    label="Ubicación y cancha"
                    value={match.field?.name ?? `Cancha #${match.fieldId}`}
                    detail={[match.field?.locality?.name, match.field?.address].filter(Boolean).join(" · ")}
                  >
                    {match.field?.address && (
                      <a
                        href={mapsUrl([match.field.address, match.field.locality?.name, "Santa Fe, Argentina"])}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-block text-xs font-bold text-[#54e58c] hover:underline"
                      >
                        Ver en Maps
                      </a>
                    )}
                  </Info>

                  <Info
                    icon={
                      match.creator ? (
                        <UserAvatar
                          name={match.creator.name}
                          lastName={match.creator.lastName}
                          size="sm"
                          colorIndex={match.creatorId}
                        />
                      ) : (
                        <UserRound />
                      )
                    }
                    label="Organizador"
                    value={match.creator ? `${match.creator.name} ${match.creator.lastName}` : "Un usuario"}
                  />
                </div>

                {actionMessage && <p role="status" className="rounded-xl border border-[#01AB48]/30 bg-[#09241B] p-4 text-sm text-[#8af2ae]">{actionMessage}</p>}
                {actionError && <p role="alert" className="rounded-xl border border-red-300/20 bg-[#09241B] p-4 text-sm text-red-200">{actionError}</p>}

                {participation?.isCreator && match.privacy === "private" && <section className="rounded-2xl border border-white/10 bg-[#09241B] p-5 shadow-xl sm:p-7">
                  <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-black">Solicitudes para unirse</h2><p className="mt-1 text-sm text-white/65">Al aceptar, la persona ocupará un cupo en el equipo elegido.</p></div><span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold">{requests.length} pendientes</span></div>
                  {requests.length === 0 ? <p className="mt-4 rounded-xl bg-white/[0.05] p-4 text-sm text-white/60">No hay solicitudes pendientes.</p> : <ul className="mt-4 space-y-3">{requests.map((request) => <li key={request.id} className="flex flex-col gap-3 rounded-xl bg-white/[0.05] p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold">{request.user.name} {request.user.lastName}</p><p className="mt-1 text-sm text-white/65">{request.matchTeam.name} · {positionLabel(request.positionType, request.secondaryPositionType)}</p></div><div className="flex gap-2"><button type="button" disabled={respondingRequestId === request.id} onClick={() => void handleRequestResponse(request.id, "rejected")} className="rounded-lg border border-white/15 px-4 py-2 text-sm font-bold text-white/75 hover:bg-white/10 disabled:opacity-50">Rechazar</button><button type="button" disabled={respondingRequestId === request.id} onClick={() => void handleRequestResponse(request.id, "accepted")} className="rounded-lg bg-[#01AB48] px-4 py-2 text-sm font-bold disabled:opacity-50">{respondingRequestId === request.id ? "Procesando..." : "Aceptar"}</button></div></li>)}</ul>}
                </section>}

                
                <section className="rounded-2xl border border-white/10 bg-[#09241B] p-5 shadow-xl sm:p-7">
                  <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-black">Jugadores</h2><p className="mt-1 text-sm text-white/65">Los lugares ocupados y libres de cada equipo.</p></div><p className="font-bold text-[#54e58c]">{capacity?.confirmed ?? 0} confirmados · {capacity?.free ?? 0} libres</p></div>
                  <div className="my-5 flex items-center justify-center gap-3 rounded-xl bg-white/[0.06] p-4 text-center font-black"><span>{match.teams?.[0]?.name ?? "Equipo A"}</span><span className="rounded-full bg-white/10 px-3 py-1 text-xs">VS</span><span>{match.teams?.[1]?.name ?? "Equipo B"}</span></div>
                  <div className="grid gap-4 md:grid-cols-2">{[0, 1].map((teamIndex) => {
                    const team = match.teams?.[teamIndex];
                    return <section key={team?.id ?? teamIndex} className="rounded-xl bg-white/[0.06] p-4"><h3 className="mb-3 font-extrabold">{team?.name ?? `Equipo ${teamIndex === 0 ? "A" : "B"}`}</h3>
                      {team?.positions?.length ? <ul className="space-y-2">{team.positions.map((slot) => {
                        const occupied = slot.status === "occupied" || slot.occupantId != null;
                        const playerName = slot.guestName || (slot.occupant ? `${slot.occupant.name} ${slot.occupant.lastName}` : "");
                        const [playerFirstName, ...playerLastNames] = playerName.split(/\s+/);
                        const isCurrentUser = participation?.position?.id === slot.id;
                        const isCaptain = slot.role?.toLowerCase() === "captain";
                        const isCreator = slot.occupantId === match.creatorId;
                        return <li key={slot.id} className="flex items-center justify-between gap-3 rounded-lg bg-black/15 px-3 py-2.5 text-sm"><span className={`flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 ${occupied ? "font-semibold" : "text-white/60"}`}>{occupied && <UserAvatar name={playerFirstName} lastName={playerLastNames.join(" ")} size="sm" colorIndex={slot.occupantId ?? slot.id} />}<span>{occupied ? playerName || "Ocupado" : "Lugar libre"}</span>{isCurrentUser && <span className="rounded-full bg-[#01AB48]/20 px-2 py-0.5 text-[10px] font-bold text-[#8af2ae]">(tú)</span>}{isCaptain && <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold text-amber-200">(capitán)</span>}{isCreator && <span className="rounded-full bg-sky-400/15 px-2 py-0.5 text-[10px] font-bold text-sky-200">(creador)</span>}</span><span className="shrink-0 text-right text-xs text-white/60">{occupied ? positionLabel(slot.positionType, slot.secondaryPositionType) : "Sin posición"}</span></li>;
                      })}</ul> : <p className="text-sm text-white/60">Todavía no hay lugares configurados.</p>}
                    </section>;
                  })}</div>
                </section>

                {canJoin && <section className="rounded-2xl border border-[#01AB48]/25 bg-[#09241B] p-5 shadow-xl sm:p-7">
                  <h2 className="text-2xl font-black">{match.privacy === "private" ? "Solicitar un lugar" : "Unirme al partido"}</h2>
                  <p className="mt-1 text-sm text-white/65">Elegí un equipo. Las posiciones son opcionales; si no elegís ninguna, aparecerás como comodín.</p>
                  <form onSubmit={(event) => void handleJoin(event)} className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-bold">Equipo<select required value={teamId} onChange={(event) => setTeamId(event.target.value)} className={inputClass}><option value="">Elegí un equipo</option>{(match.teams ?? []).map((team) => { const openSlots = team.positions?.filter((slot) => slot.status === "free" && slot.occupantId == null).length ?? 0; return <option key={team.id} value={team.id} disabled={openSlots === 0}>{team.name} · {openSlots} cupos</option>; })}</select></label>
                    <label className="text-sm font-bold">Posición principal (opcional)<select value={positionType} onChange={(event) => setPositionType(event.target.value as PlayerPosition | "")} className={inputClass}><option value="">Comodín</option>{positions.map((position) => <option key={position.value} value={position.value}>{position.label}</option>)}</select></label>
                    <label className="text-sm font-bold">Posición alternativa (opcional)<select value={secondaryPositionType} onChange={(event) => setSecondaryPositionType(event.target.value as PlayerPosition | "")} className={inputClass}><option value="">Sin alternativa</option>{positions.filter((position) => position.value !== positionType).map((position) => <option key={position.value} value={position.value}>{position.label}</option>)}</select></label>
                    <div className="flex items-end"><button type="submit" disabled={submitting || !teamId} className="w-full rounded-xl bg-[#01AB48] px-5 py-3 font-extrabold disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Enviando..." : match.privacy === "private" ? "Enviar solicitud" : "Confirmar lugar"}</button></div>
                  </form>
                </section>}
                {alreadyJoined && <p className="rounded-xl border border-[#01AB48]/25 bg-[#09241B] p-4 text-sm font-bold text-[#8af2ae]">Ya estás en {participation?.position?.matchTeam.name}. Posición: {positionLabel(participation?.position?.positionType, participation?.position?.secondaryPositionType)}.</p>}
                {!alreadyJoined && ownRequest?.status === "pending" && <p className="rounded-xl border border-amber-300/20 bg-[#09241B] p-4 text-sm font-bold text-amber-100">Tu solicitud para {ownRequest.matchTeam.name} está pendiente de aprobación.</p>}
                {!alreadyJoined && ownRequest?.status === "rejected" && <p className="rounded-xl border border-white/10 bg-[#09241B] p-4 text-sm text-white/75">Tu solicitud anterior fue rechazada. Podés volver a solicitar un lugar si quedan cupos.</p>}
                {!alreadyJoined && !ownRequest && !participation?.isCreator && isFull && <p className="rounded-xl border border-white/10 bg-[#09241B] p-4 text-sm font-bold text-white/75">El partido está lleno.</p>}

              </>}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

const inputClass = "mt-2 block w-full rounded-xl border border-white/15 bg-[#10372A] px-3 py-3 text-white outline-none focus:ring-2 focus:ring-[#01AB48]";

function Info({ icon, label, value, detail, children }: { icon: ReactNode; label: string; value: string; detail?: string; children?: ReactNode }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-white/10 bg-[#09241B] p-4 shadow-xl">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#01AB48]/20 text-[#54e58c] [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wide text-white/55">{label}</p>
        <p className="mt-1 font-extrabold">{value}</p>
        {detail && <p className="mt-0.5 break-words text-xs leading-5 text-white/60">{detail}</p>}
        {children}
      </div>
    </div>
  );
}
