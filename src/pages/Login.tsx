import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita que la página recargue por defecto al enviar el formulario
    try {
      const res = await axios.post("http://localhost:3000/auth/login", { email, password });
      alert(res.data.message);
      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      alert(err.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    /* Fondo de césped ocupando toda la pantalla idéntico al Home */
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundImage: "url('/images/Grass.jpg')",
      }}
    >
      {/* Tarjeta blanca flotante y compacta en el centro */}
      <main className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center relative overflow-hidden border border-gray-100">

        {/* Textura de la cancha de fútbol sutil en el fondo de la tarjeta */}
        <div 
          className="absolute inset-0 opacity-10 bg-center bg-no-repeat bg-contain pointer-events-none"
          style={{
            backgroundImage: "url('/images/Field.jpg')",
          }}
        ></div>

        <div className="w-full flex flex-col items-center text-center relative z-10">

          {/* Logo de la pelota con fuego */}
          <img
            src="/images/Ball.png"
            alt="Pelota de fútbol con fuego"
            className="w-32 sm:w-36 h-auto object-contain mb-2"
          />

          {/* Título de la sección */}
          <h1 className="text-3xl font-black italic tracking-tight text-[#1B4D3E]">
            INICIAR SESIÓN
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-gray-500 font-medium mb-6">
            Ingresá a tu cuenta para continuar
          </p>

          {/* Formulario de Login */}
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-3.5">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] bg-gray-50/50 text-gray-900 font-medium placeholder-gray-500"
            />
            
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] bg-gray-50/50 text-gray-900 font-medium placeholder-gray-500"
            />

            <button
              type="submit"
              className="w-full bg-[#1B4D3E] text-white font-semibold
              px-6 py-3.5 rounded-xl hover:bg-[#14382d]
              transition-colors shadow-sm mt-2"
            >
              Entrar
            </button>
          </form>

          {/* Enlace opcional para volver o ir al registro */}
          <div className="mt-6 text-sm text-gray-500">
            ¿No tenés cuenta?{" "}
            <Link to="/register" className="text-[#1B4D3E] font-semibold hover:underline">
              Registrarse
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}