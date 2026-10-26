import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowUpDown, CalendarDays, Goal, MapPin, RotateCcw, Shield, SlidersHorizontal } from "lucide-react";
import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import AvailableMatchGrid from "../components/AvailableMatchGrid";
import { useSidebar } from "../hooks/useSidebar";
import { getMatches } from "../api/matches";
import { getLocalities } from "../api/locality";
import type { Match, PlayerPosition } from "../types/match";
import type { Locality } from "../types/locality";
import { getMatchCapacity } from "../utils/matchAvailability";
import { argentinaDateKey } from "../utils/matchDateTime";

type SortMode = "date" | "price";
type Filters = { locality: string; date: string; position: PlayerPosition | ""; privacy: "public" | "private" | "" };
const initialFilters: Filters = { locality: "", date: "", position: "", privacy: "" };
const positionOptions: { value: PlayerPosition; label: string }[] = [
  { value: "arquero", label: "Arquero" },
  { value: "defensor", label: "Defensa" },
  { value: "centrocampista", label: "Mediocampista" },
  { value: "delantero", label: "Delantero" },
];

function loadErrorMessage(error: unknown) {
  if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) return "Tu sesión venció. Iniciá sesión nuevamente para ver los partidos.";
  return "No se pudieron cargar los partidos. Intentá de nuevo.";
}
const selectClass = "min-w-0 rounded-xl border border-white/15 bg-[#10372A] px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-[#01AB48]";
function playerPrice(match: Match) {
  const slots = getMatchCapacity(match).total || (match.field?.category?.playersPerTeam ?? 0) * 2;
  return slots > 0 ? Math.round((match.field?.price ?? 0) / slots) : match.field?.price ?? 0;
}

export default function AvailableMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [now, setNow] = useState<number | null>(null);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("date");
  const [ascending, setAscending] = useState(true);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { collapsed: sidebarCollapsed, toggleSidebar } = useSidebar();

  useEffect(() => {
    let cancelled = false;
    getMatches().then((data) => { if (!cancelled) setMatches(data); })
      .catch((loadError) => { if (!cancelled) setError(loadErrorMessage(loadError)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { getLocalities().then(setLocalities).catch(() => setLocalities([])); }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => setNow(Date.now()));
    const intervalId = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearInterval(intervalId);
    };
  }, []);

  const filteredMatches = useMemo(() => {
    const filtered = matches.map((match) => ({ ...match, field: match.field ? { ...match.field, locality: match.field.locality ?? localities.find((locality) => locality.id === match.field?.localityId) } : undefined })).filter((match) => {
      if (now === null || Date.parse(match.startsAt) < now) return false;
      if (filters.locality && match.field?.localityId !== filters.locality) return false;
      if (filters.date && argentinaDateKey(match.startsAt) !== filters.date) return false;
      if (filters.privacy && match.privacy !== filters.privacy) return false;
      if (filters.position && !match.teams?.some((team) => team.positions?.some((slot) =>
        slot.status === "free" && slot.occupantId == null &&
        (slot.positionType === filters.position || slot.secondaryPositionType === filters.position),
      ))) return false;
      return true;
    });
    return filtered.sort((a, b) => {
      let comparison = 0;
      if (sortMode === "price") comparison = playerPrice(a) - playerPrice(b);
      if (comparison === 0) comparison = Date.parse(a.startsAt) - Date.parse(b.startsAt);
      return ascending ? comparison : -comparison;
    });
  }, [matches, localities, filters, sortMode, ascending, now]);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((current) => ({ ...current, [key]: value }));
  const clearFilters = () => setFilters(initialFilters);
  const hasFilters = Boolean(filters.locality || filters.date || filters.position || filters.privacy);

  return (
    <div className="flex h-dvh min-h-screen w-full overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/Fondo.jpg')" }}>
      <div className="flex h-full w-full flex-col bg-[#061910]/55">
        <AppHeader sidebarCollapsed={sidebarCollapsed} onToggleSidebar={toggleSidebar} />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <Sidebar collapsed={sidebarCollapsed} />
          <main className="min-w-0 flex-1 overflow-y-auto px-3 py-5 sm:px-5 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6">
              <section className="rounded-2xl border border-white/10 bg-[#09241B] p-5 text-white shadow-xl sm:p-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div><h1 className="text-2xl font-black sm:text-3xl">Explorar partidos</h1><p className="mt-2 text-sm text-white/70">Encontrá un partido que se ajuste a tus tiempos y zona.</p></div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <label className="flex items-center gap-3 text-sm font-semibold text-white/80">Ordenar por
                      <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} className={selectClass}><option value="date">Horario</option><option value="price">Precio</option></select>
                    </label>
                    <button type="button" onClick={() => setAscending((current) => !current)} aria-label={ascending ? "Cambiar a orden descendente" : "Cambiar a orden ascendente"} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#10372A] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
                      <ArrowUpDown className="h-4 w-4 text-[#01AB48]"/><span>{sortMode === "price" ? ascending ? "Menor a mayor" : "Mayor a menor" : ascending ? "Más próximos primero" : "Más lejanos primero"}</span>
                    </button>
                  </div>
                </div>
                <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="flex min-w-0 items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-[#01AB48]"/><select aria-label="Localidad" value={filters.locality} onChange={(event) => updateFilter("locality", event.target.value)} className={selectClass+" w-full"}><option value="">Todas las localidades</option>{localities.map((locality) => <option key={locality.id} value={locality.id}>{locality.name}</option>)}</select></label>
                  <label className="flex min-w-0 items-center gap-2"><CalendarDays className="h-4 w-4 shrink-0 text-[#01AB48]"/><input aria-label="Día" type="date" value={filters.date} onChange={(event) => updateFilter("date", event.target.value)} className={selectClass+" w-full [color-scheme:dark]"}/></label>
                  <label className="flex min-w-0 items-center gap-2"><Goal className="h-4 w-4 shrink-0 text-[#01AB48]"/><select aria-label="Posición disponible" value={filters.position} onChange={(event) => updateFilter("position", event.target.value as Filters["position"])} className={selectClass+" w-full"}><option value="">Cualquier posición</option>{positionOptions.map((position) => <option key={position.value} value={position.value}>{position.label} libre</option>)}</select></label>
                  <label className="flex min-w-0 items-center gap-2"><Shield className="h-4 w-4 shrink-0 text-[#01AB48]"/><select aria-label="Privacidad" value={filters.privacy} onChange={(event) => updateFilter("privacy", event.target.value as Filters["privacy"])} className={selectClass+" w-full"}><option value="">Cualquier privacidad</option><option value="public">Público</option><option value="private">Privado</option></select></label>
                  <button type="button" onClick={clearFilters} disabled={!hasFilters} className="inline-flex items-center justify-center gap-2 justify-self-start rounded-xl px-3 py-2.5 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-2 lg:col-span-4"><RotateCcw className="h-4 w-4"/>Borrar filtros</button>
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center gap-3 text-white"><SlidersHorizontal className="h-5 w-5 text-[#01AB48]"/><h2 className="text-xl font-black sm:text-2xl">Partidos disponibles</h2><span className="rounded-full bg-[#01AB48] px-3 py-1 text-sm font-black text-white">{filteredMatches.length}</span></div>
                {loading && <p className="rounded-2xl bg-[#09241B] p-6 text-white">Cargando partidos...</p>}
                {error && <p role="alert" className="rounded-2xl bg-[#09241B] p-5 text-red-200">{error}</p>}
                {!loading && !error && <AvailableMatchGrid matches={filteredMatches} emptyMessage="No hay partidos que coincidan con esos filtros." />}
              </section>

              <section className="flex flex-col items-center gap-5 rounded-2xl border border-white/10 bg-[#09241B] p-5 text-center text-white shadow-xl sm:flex-row sm:text-left sm:p-6">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5"><Goal className="h-7 w-7 text-[#01AB48]"/></div>
                <p className="flex-1 text-sm leading-6 text-white/80 sm:text-base">¿No encontrás el partido que buscás? Podés crear tu propio partido y elegir la cancha, fecha, horario y privacidad.</p>
                <button type="button" onClick={() => navigate("/matches/create")} className="w-full shrink-0 rounded-xl bg-[#01AB48] px-5 py-3 font-bold text-white transition hover:bg-[#029b42] sm:w-auto">+ Crear partido</button>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
