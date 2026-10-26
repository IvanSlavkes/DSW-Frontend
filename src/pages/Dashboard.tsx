import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import { useSidebar } from '../hooks/useSidebar';
import AvailableMatchGrid from '../components/AvailableMatchGrid';
import NotificationPanel from '../components/NotificationPanel';
import type { Match } from '../types/match';
import type { Notification } from '../types/notification';
import type { User } from '../types/user';
import axios from 'axios';
import { markAsRead, deleteNotification } from '../api/notification';
import { API_URL } from '../api/client';

function getAvailableUpcomingMatches(matches: Match[]) {
  return matches
    .filter((match) => {
      if (
        Date.parse(match.startsAt) < Date.now() ||
        match.status.toLowerCase() !== 'open'
      )
        return false;
      const positions =
        match.teams?.flatMap((team) => team.positions ?? []) ?? [];
      if (positions.length === 0) return true;
      return positions.some(
        (position) => position.status === 'free' && position.occupantId == null,
      );
    })
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
}

export default function Dashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userEditing, setUserEditing] = useState<User | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { collapsed: sidebarCollapsed, toggleSidebar } = useSidebar();

  const token = localStorage.getItem('token');
  const availableUpcomingMatches = getAvailableUpcomingMatches(matches);

  useEffect(() => {
    // 1. Si no hay token, redirigir y cortar ejecución
    if (!token) {
      navigate('/login');
      return;
    }

    const authHeaders = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // 2. Partidos (con token incluido)
    axios
      .get(`${API_URL}/matches`, authHeaders)
      .then((res) => setMatches(res.data))
      .catch((err) => {
        console.error('Error cargando partidos:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      })
      .finally(() => setMatchesLoading(false));

    // 3. Notificaciones
    axios
      .get(`${API_URL}/notifications`, authHeaders)
      .then((res) => setNotifications(res.data))
      .catch((err) => {
        console.error('Error cargando notificaciones:', err);
      });

    // 4. Usuario actual
    axios
      .get(`${API_URL}/users/me`, authHeaders)
      .then((res) => setUserEditing(res.data))
      .catch((err) => {
        console.error('Error cargando usuario:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      });
  }, [navigate, token]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (err) {
      console.error('Error marcando notificación como leída:', err);
      alert('No se pudo marcar la notificación como leída');
    }
  };

  const handleDeleteNotification = async (id: number) => {
    if (!confirm('¿Seguro que querés borrar esta notificación?')) return;
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Error borrando notificación:', err);
      alert('No se pudo borrar la notificación');
    }
  };

  return (
    <div
      className="flex h-dvh w-full overflow-hidden bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('/images/Fondo.jpg')",
      }}
    >
      {/* Capa clara para mejorar la lectura */}
      <div className="flex h-full w-full flex-col bg-[#1C2928]/25">
        <AppHeader
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        >
          <div className="relative">
            <button
              type="button"
              aria-label="Abrir menú de usuario"
              aria-expanded={accountMenuOpen}
              onClick={() => setAccountMenuOpen((open) => !open)}
              className="flex items-center gap-3 rounded-xl px-2 py-1 text-left transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 shrink-0">
                <circle cx="12" cy="12" r="11" fill="white" />
                <circle cx="12" cy="8.5" r="3" fill="#1F2B24" />
                <path d="M5.5 19a6.5 6.5 0 0 1 13 0" fill="#1F2B24" />
              </svg>
              <span className="max-w-44 truncate font-semibold text-white">
                {userEditing ? `${userEditing.name} ${userEditing.lastName}` : 'Cargando usuario...'}
              </span>
            </button>
            {accountMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#09241B] p-1 text-white shadow-xl">
                <button
                  type="button"
                  onClick={() => { setAccountMenuOpen(false); navigate('/profile'); }}
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-white/10"
                >
                  Mi perfil
                </button>
                <button
                  type="button"
                  onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  Cerrar sesión
                </button>
              </div>
            )}

          </div>
        </AppHeader>
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <Sidebar collapsed={sidebarCollapsed} isAdmin={userEditing?.role === 'admin'} />
          <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
            {/* Paneles */}
            <main className="grid flex-1 grid-cols-1 content-start gap-4 p-3 sm:gap-5 sm:p-5 lg:p-7 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,0.85fr)] xl:gap-6">
              {/* Columna central */}
              <div className="flex min-w-0 flex-col gap-5">
                {/* Banner de bienvenida */}
                <section
                  className="relative flex min-h-[210px] items-center overflow-hidden rounded-2xl bg-cover bg-center p-5 shadow-lg sm:min-h-[260px] sm:p-8 lg:min-h-[290px] lg:p-9"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, rgba(4,40,27,0.88), rgba(4,40,27,0.35)), url('/images/Fondo.jpg')",
                  }}
                >
                  <div className="relative z-10 max-w-xl">
                    <div className="mb-4 h-[3px] w-12 rounded-full bg-green-400" />

                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-200">
                      Tu próximo partido empieza acá
                    </p>

                    <h2 className="text-3xl font-black text-white sm:text-5xl">
                      ¡Bienvenida a FUTGO!
                    </h2>

                    <p className="mt-3 max-w-md text-sm leading-6 text-white/90 sm:text-base">
                      {userEditing
                        ? `Hola, ${userEditing.name}. Encontrá partidos y conectá con otros jugadores.`
                        : 'Encontrá partidos y conectá con otros jugadores.'}
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate('/matches')}
                      className="mt-6 rounded-lg bg-green-600 px-5 py-3 font-bold text-white shadow-md transition hover:bg-green-700"
                    >
                      Explorar partidos
                    </button>
                  </div>
                </section>

                {/* Próximos partidos */}
                <section className="min-w-0 rounded-2xl border border-white/15 bg-[#1C2928] p-3 text-white shadow-lg sm:p-5 lg:p-6">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Mis próximos partidos
                      </h2>
                      <p className="mt-1 text-sm text-white/70">
                        Partidos futuros que todavía tienen lugares disponibles.
                      </p>
                    </div>

                    <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-white">
                      {availableUpcomingMatches.length} disponibles
                    </span>
                  </div>

                  <AvailableMatchGrid
                    matches={availableUpcomingMatches}
                    layout="list"
                    emptyMessage={
                      matchesLoading
                        ? 'Cargando partidos...'
                        : 'No hay partidos disponibles próximamente.'
                    }
                  />
                </section>
              </div>

              {/* Columna derecha */}
              <aside className="flex min-w-0 flex-col gap-5">
                {/* Perfil */}
                <section className="min-w-0 rounded-2xl border border-white/15 bg-[#1C2928] p-4 text-white shadow-lg sm:p-5 lg:p-6">
                  <h2 className="mb-5 text-lg font-bold text-white">
                    Mi perfil
                  </h2>

                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100 ring-4 ring-green-50">
                      <img
                        src="/images/Ball.png"
                        alt="Perfil FUTGO"
                        className="h-12 w-12 object-contain"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-white">
                        {userEditing
                          ? `${userEditing.name} ${userEditing.lastName}`
                          : 'Cargando perfil...'}
                      </h3>

                      <p className="mt-1 text-sm text-white/75">
                        {userEditing?.position || 'Jugador/a'}
                      </p>

                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/15 pt-5">
                    <div className="rounded-xl bg-white/5 p-3">
                      <p className="text-xl font-black text-white">
                        {userEditing?.matchesPlayed ?? '—'}
                      </p>
                      <p className="mt-1 text-xs text-white/65">Partidos jugados</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-3">
                      <p className="text-xl font-black text-white">
                        {userEditing?.averageRating ? userEditing.averageRating.toFixed(1) : '—'}
                      </p>
                      <p className="mt-1 text-xs text-white/65">Promedio</p>
                    </div>
                  </div>
                </section>

                {/* Notificaciones */}
                <NotificationPanel
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                />
              </aside>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
