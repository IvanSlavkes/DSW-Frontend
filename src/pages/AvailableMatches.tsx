import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import AvailableMatchGrid from "../components/AvailableMatchGrid";
import { useSidebar } from "../hooks/useSidebar";
import { getMatches } from "../api/matches";
import type { Match } from "../types/match";
import { isMatchFull } from "../utils/matchAvailability";

type SortMode = "date" | "price";

function loadErrorMessage(error: unknown) {
  if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
    return "Tu sesión venció. Iniciá sesión nuevamente para ver los partidos.";
  }
  return "No se pudieron cargar los partidos. Intentá de nuevo.";
}

export default function AvailableMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("date");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { collapsed: sidebarCollapsed, toggleSidebar } = useSidebar();

  useEffect(() => {
    let cancelled = false;
    getMatches()
      .then((data) => {
        if (!cancelled) setMatches(data);
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadErrorMessage(loadError));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const upcomingMatches = useMemo(() => {
    return matches
      .filter((match) => Date.parse(match.startsAt) >= Date.now())
      .sort((a, b) => {
        if (sortMode === "price") {
          const priceDifference = (a.field?.price ?? 0) - (b.field?.price ?? 0);
          if (priceDifference !== 0) return priceDifference;
        }
        return Date.parse(a.startsAt) - Date.parse(b.startsAt);
      });
  }, [matches, sortMode]);

  const availableCount = upcomingMatches.filter(
    (match) => match.status.toLowerCase() === "open" && !isMatchFull(match),
  ).length;

  return (
    <div
      className="flex h-dvh w-full overflow-hidden bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/Fondo.jpg')" }}
    >
      <div className="flex h-full w-full flex-col bg-[#1C2928]/25">
        <AppHeader sidebarCollapsed={sidebarCollapsed} onToggleSidebar={toggleSidebar}>
          <button
            type="button"
            onClick={() => navigate("/matches/create")}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white shadow transition hover:bg-green-700"
          >
            Crear partido
          </button>
        </AppHeader>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <Sidebar collapsed={sidebarCollapsed} />
          <main className="min-w-0 flex-1 overflow-y-auto bg-[#F3F6F4] p-3 sm:p-5 lg:p-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-5 flex flex-col items-stretch gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-black text-[#1F2B24] sm:text-3xl">Partidos disponibles</h1>
                    <span className="rounded-full bg-[#DDF3E4] px-3 py-1 text-xs font-bold text-[#08743A]">
                      {availableCount} disponibles
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">Encontrá tu próximo partido y revisá los datos de la cancha.</p>
                </div>
                <label className="flex items-center justify-between gap-2 text-sm font-medium text-slate-600 sm:justify-start">
                  Ordenar por
                  <select
                    value={sortMode}
                    onChange={(event) => setSortMode(event.target.value as SortMode)}
                    className="min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#1F2B24] shadow-sm outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="date">Horario</option>
                    <option value="price">Precio</option>
                  </select>
                </label>
              </div>

              {loading && <p className="rounded-xl bg-white p-6 text-slate-600 shadow-sm">Cargando partidos...</p>}
              {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</p>}
              {!loading && !error && upcomingMatches.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <h2 className="text-lg font-bold text-[#1F2B24]">Todavía no hay partidos próximos</h2>
                  <p className="mt-2 text-sm text-slate-600">Podés crear uno e invitar a otros jugadores.</p>
                  <button
                    type="button"
                    onClick={() => navigate("/matches/create")}
                    className="mt-5 rounded-lg bg-green-700 px-5 py-3 font-bold text-white transition hover:bg-green-800"
                  >
                    Crear partido
                  </button>
                </div>
              )}

              {!loading && !error && upcomingMatches.length > 0 && <AvailableMatchGrid matches={upcomingMatches} />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
