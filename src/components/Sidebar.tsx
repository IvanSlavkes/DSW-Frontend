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

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className="flex h-[calc(100vh-60px)] w-64 shrink-0 flex-col bg-cover bg-center text-white shadow-xl"
      style={{
        backgroundImage: "linear-gradient(to right, rgba(16, 30, 29, 0) 90%, rgba(16, 30, 29, 0.9) 100%), linear-gradient(to bottom, rgba(16, 30, 29, 0) 80%, rgba(16, 30, 29, 0.8) 100%), url('/images/DashboardTexture.png')",
        backgroundSize: "100% 100%, 100% 100%, cover",
        backgroundColor: "#1F2B24",
      }}
    >
      <nav className="mt-6 flex flex-col gap-2 px-4">
        {menuItems.map((item) => {
          const active =
            location.pathname === item.path ||
            (item.path !== "/dashboard" &&
              location.pathname.startsWith(item.path + "/"));

          return (
            <div key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-200 ${
                  active
                    ? "font-bold text-white"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
              {item.path === "/dashboard" && (
                <div className="mx-4 mt-2 border-t border-white/50" />
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto px-4 pb-4 pt-4">
        <div className="mb-3 border-t border-white/15" />
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-white/90 transition-colors duration-200 hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" d="M12 3v9m6.36-6.36a9 9 0 1 1-12.72 0" /></svg>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}