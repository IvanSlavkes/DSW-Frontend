import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import { useSidebar } from '../hooks/useSidebar';
import AvailableMatchGrid from '../components/AvailableMatchGrid';
import NotificationPanel from '../components/NotificationPanel';
import UserForm from '../components/UserForm';
import type { Match } from '../types/match';
import type { Notification } from '../types/notification';
import type { User, UserInput } from '../types/user';
import axios from 'axios';
import { markAsRead, deleteNotification } from '../api/notification';

function getAvailableUpcomingMatches(matches: Match[]) {
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return matches
    .filter((match) => {
      if (
        match.date.slice(0, 10) < todayString ||
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
    .sort((a, b) =>
      `${a.date.slice(0, 10)} ${a.time}`.localeCompare(
        `${b.date.slice(0, 10)} ${b.time}`,
      ),
    );
}

export default function Dashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userEditing, setUserEditing] = useState<User | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);

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
      .get('http://localhost:3000/matches', authHeaders)
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
      .get('http://localhost:3000/notifications', authHeaders)
      .then((res) => setNotifications(res.data))
      .catch((err) => {
        console.error('Error cargando notificaciones:', err);
      });

    // 4. Usuario actual
    axios
      .get('http://localhost:3000/users/me', authHeaders)
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

  const handleSubmitUser = (data: UserInput) => {
    axios
      .put('http://localhost:3000/users/me', data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserEditing(res.data);
        setShowUserForm(false);
        alert('Perfil actualizado correctamente');
      })
      .catch((err) => {
        console.error('Error actualizando usuario:', err);
        alert(err.response?.data?.error || 'No se pudo actualizar el perfil');
      });
  };

  const handleCancelUser = () => {
    setShowUserForm(false);
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
          <div className="flex items-center gap-3">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4 shrink-0"
            >
              <circle cx="12" cy="12" r="11" fill="white" />
              <circle cx="12" cy="8.5" r="3" fill="#1F2B24" />
              <path d="M5.5 19a6.5 6.5 0 0 1 13 0" fill="#1F2B24" />
            </svg>
            <div className="max-w-44 text-right">
              <p className="truncate font-semibold text-white">
                {userEditing
                  ? `${userEditing.name} ${userEditing.lastName}`
                  : 'Cargando usuario...'}
              </p>
              <p className="text-xs text-white/75">Mi cuenta</p>
            </div>
          </div>
        </AppHeader>
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <Sidebar collapsed={sidebarCollapsed} />
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

                      <p className="mt-1 truncate text-sm text-white/65">
                        {userEditing?.email || ''}
                      </p>
                    </div>
                  </div>

                  {userEditing?.description && (
                    <p className="mt-4 text-sm leading-6 text-white/75">
                      {userEditing.description}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowUserForm((previous) => !previous)}
                    className="mt-5 w-full rounded-lg bg-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/20"
                  >
                    {showUserForm ? 'Cerrar edición' : 'Editar perfil'}
                  </button>

                  {showUserForm && userEditing && (
                    <div className="mt-5 border-t border-white/20 pt-5">
                      <UserForm
                        key={userEditing.id}
                        userEditing={userEditing}
                        onSubmit={handleSubmitUser}
                        onCancel={handleCancelUser}
                      />
                    </div>
                  )}
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
