import type { ReactNode } from "react";

interface Props {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  children?: ReactNode;
}

export default function AppHeader({ sidebarCollapsed, onToggleSidebar, children }: Props) {
  return (
    <header
      className="flex h-[60px] min-h-[60px] w-full shrink-0 items-center justify-between gap-4 bg-cover bg-center px-4 py-1 shadow-md md:px-6"
      style={{ backgroundImage: "linear-gradient(rgba(18, 35, 32, 0.3), rgba(18, 35, 32, 0.3)), url('/images/DashboardTexture.png')" }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? "Expandir menú" : "Contraer menú"}
          aria-expanded={!sidebarCollapsed}
          aria-controls="app-sidebar"
          title={sidebarCollapsed ? "Expandir menú" : "Contraer menú"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
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
