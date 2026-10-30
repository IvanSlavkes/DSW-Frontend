import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getMyProfile } from "../api/user";
import type { User } from "../types/user";
import UserAvatar from "./UserAvatar";

interface Props {
  mobileSidebarOpen: boolean;
  onToggleSidebar: () => void;
  children?: ReactNode;
}

export default function AppHeader({ mobileSidebarOpen, onToggleSidebar, children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    getMyProfile()
      .then((profile) => {
        if (!cancelled) setUser(profile);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (axios.isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0)) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  return (
    <header
      className="flex h-[60px] min-h-[60px] w-full shrink-0 items-center justify-between gap-4 bg-cover bg-center px-4 py-1 shadow-md md:px-6"
      style={{ backgroundImage: "linear-gradient(rgba(18, 35, 32, 0.3), rgba(18, 35, 32, 0.3)), url('/images/DashboardTexture.png')" }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={mobileSidebarOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileSidebarOpen}
          aria-controls="app-sidebar"
          title={mobileSidebarOpen ? "Cerrar menú" : "Abrir menú"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 md:hidden"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileSidebarOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <img src="/images/Ball.png" alt="" className="h-10 w-10 object-contain sm:h-14 sm:w-14 md:h-18 md:w-18" />
          <span className="text-xl font-black tracking-wide text-white">FutGO</span>
        </div>
      </div>
      <div className="flex min-w-0 items-center gap-2">
        {children}
        <div className="relative">
          <button
            type="button"
            aria-label="Abrir menú de usuario"
            aria-expanded={accountMenuOpen}
            onClick={() => setAccountMenuOpen((open) => !open)}
            className="flex max-w-[38vw] items-center gap-2 rounded-xl px-2 py-1 text-left transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 sm:max-w-[min(48vw,15rem)] sm:gap-3"
          >
            <UserAvatar name={user?.name} lastName={user?.lastName} size="sm" colorIndex={user?.id ?? 0} />
            <span className="truncate text-sm font-semibold text-white sm:text-base">
              {user ? `${user.name} ${user.lastName}` : "Cargando usuario..."}
            </span>
          </button>
          {accountMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#09241B] p-1 text-white shadow-xl">
              <button
                type="button"
                onClick={() => { setAccountMenuOpen(false); navigate("/profile"); }}
                className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-white/10"
              >
                Mi perfil
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
