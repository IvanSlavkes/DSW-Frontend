import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { API_URL } from '../api/client';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 👇 asegurate que tu backend tenga esta ruta
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      
      // 👇 usar "mensaje" porque tu backend devuelve esa propiedad
      alert(res.data.mensaje);

      // guardar el token
      localStorage.setItem("token", res.data.token);

      // redirigir al dashboard
      navigate("/dashboard");
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      alert(err.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <div
      className="h-dvh w-full overflow-hidden bg-cover bg-center flex items-center justify-center p-4 md:justify-start md:p-6 md:pl-36 lg:pl-56"
      style={{
        backgroundImage: "url('/images/Login.png')",
      }}
    >
      <main className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden border border-white/20">

        <div 
          className="absolute inset-0 opacity-10 bg-center bg-no-repeat bg-contain pointer-events-none"
          style={{
            backgroundImage: "url('/images/Field.jpg')",
          }}
        ></div>

        <div className="w-full flex flex-col items-center text-center relative z-10">

          <img
            src="/images/Ball.png"
            alt="Pelota de fútbol con fuego"
            className="w-24 sm:w-28 h-auto object-contain mb-1"
          />

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1B4D3E]">
            INICIAR SESIÓN
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-gray-500 font-medium mb-5">
            Ingresá a tu cuenta para continuar
          </p>

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
              transition-colors shadow-sm mt-1"
            >
              Entrar
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-500">
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
