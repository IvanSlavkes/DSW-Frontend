import type { ReactNode } from "react";

interface Props {
  mobileSidebarOpen: boolean;
  onToggleSidebar: () => void;
  children?: ReactNode;
}

export default function AppHeader({ mobileSidebarOpen, onToggleSidebar, children }: Props) {
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
          <img src="/images/Ball.png" alt="" className="h-18 w-18 object-contain" />
          <span className="text-xl font-black tracking-wide text-white">FutGO</span>
        </div>
      </div>
      {children}
    </header>
  );
}
