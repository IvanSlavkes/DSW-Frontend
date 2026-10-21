import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MatchList from "../components/MatchList";
import NotificationList from "../components/NotificationList";
import UserForm from "../components/UserForm";
import type { Match } from "../types/match";
import type { Notification } from "../types/notification";
import type { User, UserInput } from "../types/user";
import axios from "axios";

export default function Dashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userEditing, setUserEditing] = useState<User | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    // 1. Si no hay token, redirigir y cortar ejecución
    if (!token) {
      navigate("/login");
      return;
    }

    const authHeaders = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // 2. Partidos (con token incluido)
    axios
      .get("http://localhost:3000/matches", authHeaders)
      .then((res) => setMatches(res.data))
      .catch((err) => {
        console.error("Error cargando partidos:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      });

    // 3. Notificaciones
    axios
      .get("http://localhost:3000/notifications", authHeaders)
      .then((res) => setNotifications(res.data))
      .catch((err) => {
        console.error("Error cargando notificaciones:", err);
      });

    // 4. Usuario actual
    axios
      .get("http://localhost:3000/users/me", authHeaders)
      .then((res) => setUserEditing(res.data))
      .catch((err) => {
        console.error("Error cargando usuario:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      });
  }, [navigate, token]);

  const handleEditMatch = (match: Match) => {
    console.log("Editar partido:", match);
  };

  const handleDeleteMatch = (id: number) => {
    console.log("Eliminar partido con id:", id);
  };

  const handleMarkAsRead = (id: number) => {
    console.log("Marcar notificación como leída:", id);
  };

  const handleDeleteNotification = (id: number) => {
    console.log("Eliminar notificación:", id);
  };

  const handleSubmitUser = (data: UserInput) => {
    axios
      .put("http://localhost:3000/users/me", data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserEditing(res.data);
        setShowUserForm(false);
        alert("Perfil actualizado correctamente");
      })
      .catch((err) => {
        console.error("Error actualizando usuario:", err);
        alert(
          err.response?.data?.error ||
            "No se pudo actualizar el perfil"
        );
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
        <header
          className="flex min-h-[60px] h-[60px] w-full shrink-0 items-center justify-between gap-4 bg-cover bg-center px-5 py-1 shadow-md md:px-8"
          style={{ backgroundImage: "linear-gradient(rgba(18, 35, 32, 0.3), rgba(18, 35, 32, 0.3)), url('/images/DashboardTexture.png')" }}
        >
          <div className="flex items-center gap-1">
            <img src="/images/Ball.png" alt="" className="h-[52px] w-[52px] object-contain" />
            <span className="text-xl font-black tracking-wide text-white">FutGO</span>
          </div>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0">
              <circle cx="12" cy="12" r="11" fill="white" />
              <circle cx="12" cy="8.5" r="3" fill="#1F2B24" />
              <path d="M5.5 19a6.5 6.5 0 0 1 13 0" fill="#1F2B24" />
            </svg>
            <div className="max-w-44 text-right">
              <p className="truncate font-semibold text-white">
                {userEditing ? `${userEditing.name} ${userEditing.lastName}` : "Cargando usuario..."}
              </p>
              <p className="text-xs text-white/75">Mi cuenta</p>
            </div>
          </div>
        </header>
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          {/* Paneles */}
          <main className="grid flex-1 grid-cols-1 content-start gap-5 p-4 sm:p-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,0.85fr)] xl:gap-6 xl:p-7">
            {/* Columna central */}
            <div className="flex min-w-0 flex-col gap-5">
              {/* Banner de bienvenida */}
              <section
                className="relative flex min-h-[230px] items-center overflow-hidden rounded-2xl bg-cover bg-center p-6 shadow-lg sm:min-h-[290px] sm:p-9"
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
                      : "Encontrá partidos y conectá con otros jugadores."}
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/matches")}
                    className="mt-6 rounded-lg bg-green-600 px-5 py-3 font-bold text-white shadow-md transition hover:bg-green-700"
                  >
                    Explorar partidos
                  </button>
                </div>
              </section>

              {/* Próximos partidos */}
              <section className="rounded-2xl border border-white/15 bg-[#1C2928] p-5 text-white shadow-lg sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Mis próximos partidos
                    </h2>
                    <p className="mt-1 text-sm text-white/70">
                      Organizá tus encuentros y revisá los detalles.
                    </p>
                  </div>

                  <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-white">
                    {matches.length} partidos
                  </span>
                </div>

                <MatchList
                  matches={matches}
                  onEdit={handleEditMatch}
                  onDelete={handleDeleteMatch}
                />
              </section>
            </div>

            {/* Columna derecha */}
            <aside className="flex min-w-0 flex-col gap-5">
              {/* Perfil */}
              <section className="rounded-2xl border border-white/15 bg-[#1C2928] p-5 text-white shadow-lg sm:p-6">
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
                        : "Cargando perfil..."}
                    </h3>

                    <p className="mt-1 text-sm text-white/75">
                      {userEditing?.position || "Jugador/a"}
                    </p>

                    <p className="mt-1 truncate text-sm text-white/65">
                      {userEditing?.email || ""}
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
                  {showUserForm ? "Cerrar edición" : "Editar perfil"}
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
              <section className="rounded-2xl border border-white/15 bg-[#1C2928] p-5 text-white shadow-lg sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-white">
                    Notificaciones
                  </h2>

                  <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
                    {notifications.length}
                  </span>
                </div>

                <NotificationList
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                />
              </section>
            </aside>
          </main>
          </div>
        </div>
      </div>
    </div>
  );
}








