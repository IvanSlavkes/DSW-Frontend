import { Link, useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  {
    label: "Inicio",
    path: "/dashboard",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7" /></svg>,
  },
  {
    label: "Partidos",
    path: "/matches",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="16" rx="2" /><path strokeLinecap="round" d="M7 3v4m10-4v4M3 10h18" /></svg>,
  },
  {
    label: "Notificaciones",
    path: "/notifications",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4" /></svg>,
  },
  {
    label: "Crear partido",
    path: "/matches/create",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>,
  },
];

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      id="app-sidebar"
      className={`flex h-[calc(100dvh-60px)] shrink-0 flex-col overflow-hidden bg-cover bg-center text-white shadow-xl transition-[width] duration-300 ease-in-out ${collapsed ? "w-[88px]" : "w-64"}`}
      style={{
        backgroundImage: "linear-gradient(to right, rgba(16, 30, 29, 0) 90%, rgba(16, 30, 29, 0.9) 100%), linear-gradient(to bottom, rgba(16, 30, 29, 0) 80%, rgba(16, 30, 29, 0.8) 100%), url('/images/DashboardTexture.png')",
        backgroundSize: "100% 100%, 100% 100%, cover",
        backgroundColor: "#1F2B24",
      }}
    >
      <nav className={`mt-4 flex flex-col ${collapsed ? "gap-1 px-1" : "gap-2 px-4"}`}>
        {menuItems.map((item) => {
          const active =
            location.pathname === item.path ||
            (item.path !== "/dashboard" &&
              location.pathname.startsWith(item.path + "/"));

          return (
            <div key={item.path}>
              <Link
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`flex w-full rounded-xl transition-colors duration-200 ${collapsed ? "flex-col items-center justify-center gap-1 px-1 py-2" : "items-center gap-3 px-4 py-3"} ${
                  active
                    ? "bg-white/10 font-bold text-white"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center">{item.icon}</span>
                <span className={`transition-opacity duration-200 ${collapsed ? "max-w-full whitespace-normal text-center text-[10px] leading-3 opacity-100" : "overflow-hidden whitespace-nowrap opacity-100"}`}>{item.label}</span>
              </Link>
              {item.path === "/dashboard" && (
                <div className={`${collapsed ? "mx-2" : "mx-4"} mt-2 border-t border-white/30`} />
              )}
            </div>
          );
        })}
      </nav>

      <div className={`mt-auto pb-4 pt-4 ${collapsed ? "px-2" : "px-4"}`}>
        <div className="mb-3 border-t border-white/15" />
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          title={collapsed ? "Cerrar sesión" : undefined}
          className={`flex w-full rounded-xl py-3 text-white/90 transition-colors duration-200 hover:bg-white/10 hover:text-white ${collapsed ? "flex-col items-center justify-center gap-1 px-1 text-[10px] leading-3" : "items-center gap-3 px-4"}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" d="M12 3v9m6.36-6.36a9 9 0 1 1-12.72 0" /></svg>
          <span className={`max-w-full ${collapsed ? "whitespace-normal text-center text-[10px] leading-3" : "overflow-hidden whitespace-nowrap"}`}>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
