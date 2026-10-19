
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(true);
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const opciones = [
    { nombre: "Inicio", ruta: "/dashboard", icono: "⌂" },
    { nombre: "Partidos", ruta: "/matches", icono: "⚽" },
    { nombre: "Crear partido", ruta: "/matches/create", icono: "+" },
    { nombre: "Notificaciones", ruta: "/notifications", icono: "♧" },
    { nombre: "Mi perfil", ruta: "/profile", icono: "♙" },
  ];

  return (
    <aside className="w-64 min-h-screen shrink-0 bg-[#123D30] text-white flex flex-col p-5">
      {/* Logo y nombre */}
      <Link
        to="/dashboard"
        className="flex items-center gap-3 mb-8"
      >
        <img
          src="/images/Ball.png"
          alt="Logo FUTGO"
          className="w-14 h-14 object-contain"
        />

        <span className="text-2xl font-black italic tracking-wide">
          FUTGO
        </span>
      </Link>

      {/* Botón desplegable */}
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-expanded={menuOpen}
        className="w-full flex items-center justify-between gap-3 rounded-xl bg-[#205744] hover:bg-[#286b53] px-4 py-3 transition-colors"
      >
        <span className="flex items-center gap-3 font-semibold">
          <span className="text-xl">☰</span>
          Menú
        </span>

        <span
          className={`transition-transform ${
            menuOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* Opciones desplegables */}
      {menuOpen && (
        <nav className="mt-3 flex flex-col gap-2">
          {opciones.map((opcion) => (
            <Link
              key={opcion.ruta}
              to={opcion.ruta}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium hover:bg-[#205744] transition-colors"
            >
              <span className="w-6 text-center text-lg">
                {opcion.icono}
              </span>
              {opcion.nombre}
            </Link>
          ))}
        </nav>
      )}

      {/* Cerrar sesión abajo */}
      <button
        type="button"
        onClick={cerrarSesion}
        className="mt-auto flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm hover:bg-red-900/40 transition-colors"
      >
        <span className="text-lg">↪</span>
        Cerrar sesión
      </button>
    </aside>
  );
}
