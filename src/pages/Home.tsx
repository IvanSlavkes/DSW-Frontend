import { Link } from "react-router-dom";

export default function Home() {
  return (
    /* Todo el fondo de la pantalla es únicamente el césped */
    <div
      className="h-dvh w-full bg-cover bg-center flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundImage: "url('/images/Grass.jpg')",
      }}
    >
      {/* Tarjeta blanca flotando directamente sobre el césped */}
      <main className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center relative overflow-hidden border border-gray-100">

        {/* Imagen de la cancha (Field.png) de fondo dentro de la tarjeta blanca */}
        <div 
          className="absolute inset-0 opacity-10 bg-center bg-no-repeat bg-contain pointer-events-none"
          style={{
            backgroundImage: "url('/images/Field.png')",
          }}
        ></div>

        <div className="w-full flex flex-col items-center text-center relative z-10">

          {/* Logo: pelota con fuego */}
          <img
            src="/images/Ball.png"
            alt="Pelota de fútbol con fuego"
            className="w-44 sm:w-52 h-auto object-contain"
          />

          {/* Nombre de la aplicación */}
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tight text-[#1B4D3E] mt-2">
            FUTGO
          </h1>

          {/* Eslogan */}
          <p className="mt-3 text-sm sm:text-base text-gray-500 font-medium">
            Encontrá, jugá y disfrutá el fútbol en tu ciudad
          </p>

          {/* Botones Redondeados */}
          <div className="mt-8 flex flex-col gap-3.5 w-full">

            <Link to="/login" className="w-full">
              <button
                className="w-full bg-[#1B4D3E] text-white font-semibold
                px-6 py-3.5 rounded-xl hover:bg-[#14382d]
                transition-colors shadow-sm"
              >
                Iniciar Sesión
              </button>
            </Link>

            <Link to="/register" className="w-full">
              <button
                className="w-full bg-transparent border-2 border-[#1B4D3E] text-[#1B4D3E] font-semibold
                px-6 py-3.5 rounded-xl hover:bg-[#1B4D3E]/5
                transition-colors shadow-sm"
              >
                Registrarse
              </button>
            </Link>

          </div>

        </div>
      </main>
    </div>
  );
}