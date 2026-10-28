import { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, Goal, MapPin, UserRound } from "lucide-react";
import AppHeader from "../components/AppHeader";
import Sidebar from "../components/Sidebar";
import UserForm from "../components/UserForm";
import { useSidebar } from "../hooks/useSidebar";
import { getMyProfile, updateMyProfile } from "../api/user";
import type { User, UserInput } from "../types/user";

export default function Profile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
  const { collapsed: sidebarCollapsed, toggleSidebar } = useSidebar();

  useEffect(() => {
    let cancelled = false;
    getMyProfile()
      .then((user) => { if (!cancelled) setProfile(user); })
      .catch((loadError: unknown) => {
        if (cancelled) return;
        if (axios.isAxiosError(loadError) && (loadError.response?.status === 401 || loadError.response?.status === 403)) {
          localStorage.removeItem("token");
          window.location.assign("/login");
          return;
        }
        setError("No se pudo cargar tu perfil. Intentá de nuevo más tarde.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function handleSave(data: UserInput) {
    if (!profile) return;
    const { password, ...details } = data;
    try {
      const updated = await updateMyProfile(password ? data : details);
      setProfile(updated);
      setError(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch {
      setSaved(false);
      setError(
        'No se pudieron guardar los cambios. Revisá los datos e intentá nuevamente.',
      );
    }
  }

  const stats = [
    { label: "Partidos jugados", value: profile?.matchesPlayed ?? 0, icon: <CalendarDays className="h-5 w-5" /> },
    { label: "Promedio", value: profile?.averageRating ? profile.averageRating.toFixed(1) : "—", icon: <Goal className="h-5 w-5" /> },
    { label: "Localidad", value: profile?.locality?.name ?? "Sin localidad", icon: <MapPin className="h-5 w-5" /> },
  ];

  return (
    <div
      className="flex h-dvh min-h-screen w-full overflow-hidden bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/Fondo.jpg')" }}
    >
      <div className="flex h-full w-full flex-col bg-[#061910]/55">
        <AppHeader
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <Sidebar
            collapsed={sidebarCollapsed}
            isAdmin={profile?.role === 'admin'}
          />
          <main className="min-w-0 flex-1 overflow-y-auto px-3 py-5 sm:px-5 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
              <section className="rounded-2xl border border-white/10 bg-[#09241B] p-5 text-white shadow-xl sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5">
                    <UserRound className="h-10 w-10 text-[#01AB48]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#01AB48]">
                      Mi cuenta
                    </p>
                    <h1 className="mt-1 text-2xl font-black sm:text-3xl">
                      {loading
                        ? 'Cargando perfil...'
                        : profile
                          ? `${profile.name} ${profile.lastName}`
                          : 'Mi perfil'}
                    </h1>
                    <p className="mt-1 text-sm text-white/70">
                      Administrá tu información y consultá tu actividad en
                      FUTGO.
                    </p>
                  </div>
                </div>
              </section>

              {saved && (
                <p
                  role="status"
                  className="fixed bottom-6 right-6 z-50 rounded-2xl border border-green-300/30 bg-[#09241B] px-5 py-4 text-sm font-semibold text-green-200 shadow-2xl"
                >
                  Cambios guardados correctamente.
                </p>
              )}
              {error && (
                <p
                  role="alert"
                  className="rounded-2xl border border-red-300/20 bg-[#09241B] p-4 text-sm text-red-200"
                >
                  {error}
                </p>
              )}
              {loading && (
                <p className="rounded-2xl bg-[#09241B] p-6 text-white/80">
                  Cargando tus datos...
                </p>
              )}
              {!loading && profile && (
                <>
                  <section className="grid gap-3 sm:grid-cols-3">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#09241B] p-5 text-white shadow-lg"
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#01AB48]/15 text-[#01AB48]">
                          {stat.icon}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xl font-black">
                            {stat.value}
                          </p>
                          <p className="text-sm text-white/65">{stat.label}</p>
                        </div>
                      </div>
                    ))}
                  </section>

                  <section className="rounded-2xl border border-white/10 bg-[#09241B] p-5 text-white shadow-xl sm:p-7">
                    <div className="mb-5 border-b border-white/10 pb-4">
                      <h2 className="text-xl font-black">Datos personales</h2>
                      <p className="mt-1 text-sm text-white/65">
                        Actualizá tu perfil para que otros jugadores te
                        conozcan.
                      </p>
                    </div>
                    <UserForm
                      key={profile.id}
                      userEditing={profile}
                      onSubmit={handleSave}
                      onCancel={() => undefined}
                    />
                  </section>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
