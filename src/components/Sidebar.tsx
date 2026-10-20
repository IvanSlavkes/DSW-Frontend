import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: "Inicio", path: "/dashboard", icon: "🏠" },
    { label: "Partidos", path: "/matches", icon: "🏟️" },
    { label: "Notificaciones", path: "/notifications", icon: "🔔" },
    { label: "Crear partido", path: "/matches/create", icon: "➕" },
  ];

  return (
    <aside
      className="flex h-[50vh] w-64 shrink-0 flex-col
      bg-[linear-gradient(to_bottom,#073B2E_0%,#073B2E_90%,rgba(7,59,46,0.85)_95%,rgba(7,59,46,0.35)_100%)]
      text-white shadow-xl"
    >
      {/* Opciones del menú */}
      <nav className="mt-6 flex flex-col gap-2 px-4">
        {menuItems.map((item) => {
          const active =
            location.pathname === item.path ||
            (item.path !== "/dashboard" &&
              location.pathname.startsWith(item.path + "/"));

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-200 ${
                active
                  ? "bg-green-600 font-bold text-white shadow-md"
                  : "text-white/90 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Cerrar sesión al final del sidebar */}
      <div className="mt-auto px-4 pb-4 pt-4">
        <div className="mb-3 border-t border-white/15" />

        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-white/90 transition-colors duration-200 hover:bg-red-500/20 hover:text-white"
        >
          <span className="text-xl">⏻</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}