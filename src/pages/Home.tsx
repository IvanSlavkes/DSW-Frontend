import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex h-screen bg-green-700 relative">

      {/* Franja de césped izquierda */}
      <div
        className="w-24 md:w-48 bg-cover bg-center shrink-0"
        style={{
          backgroundImage: "url('/images/Grass.jpg')",
        }}
      ></div>

      {/* Contenido central */}
      <div className="flex-1 flex items-center justify-center">
        {/* Cuadro blanco central */}
        <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center gap-6 w-11/12 md:w-1/2 lg:w-1/3">

          {/* Logo FUTGO */}
          <h1 className="text-4xl font-bold flex items-center gap-2">
            FUTG
            <span className="relative inline-block">
              {/* Pelota de fútbol */}
              <span className="w-10 h-10 bg-black rounded-full inline-block"></span>

              {/* Cola de fuego estilo cometa */}
              <span className="absolute -right-6 top-2 w-12 h-2 bg-linear-to-r from-red-500 via-orange-400 to-yellow-300 rounded-full"></span>
            </span>
          </h1>

          {/* Botones */}
          <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
            <Link to="/login" className="flex-1">
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Iniciar sesión
              </button>
            </Link>

            <Link to="/register" className="flex-1">
              <button className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Registrarse
              </button>
            </Link>
          </div>

        </div>
      </div>

      {/* Franja de césped derecha */}
      <div
        className="w-24 md:w-48 bg-cover bg-center shrink-0"
        style={{
          backgroundImage: "url('/images/Grass.jpg')",
        }}
      ></div>

    </div>
  );
}
