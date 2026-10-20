import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import PositionSelect from "../components/PositionSelect";
// import LocalitySelect from "../components/LocalitySelect";

const fieldBase = //Para no repetir el className en cada campo
  "w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] bg-gray-50/50 font-medium";

export default function Register() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [birthDate, setBirthDate] = useState("");
  // const [localityId, setLocalityId] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/auth/register", {
        name,
        lastName,
        email,
        password,
        position,
        birthDate
        // localityId
      });
      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      alert(err.response?.data?.error || "Error al registrarse");
    }
  };

  return (
    <div
      className="h-dvh w-full bg-cover bg-center flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundImage: "url('/images/Register.png')",
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
            REGISTRO
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-gray-500 font-medium mb-5">
            Creá tu cuenta para unirte a FutGO
          </p>

          <form onSubmit={handleRegister} className="w-full flex flex-col gap-3">
            {/* Nombre y Apellido en una sola fila para optimizar espacio */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={ fieldBase }
              />

              <input
                type="text"
                placeholder="Apellido"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className={ fieldBase }
              />
            </div>

            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={ fieldBase }
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={ fieldBase }
            />

            {/* Selector de posición */}
            {/* <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
              className={`w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] bg-gray-50/50 font-medium ${
                position === "" ? "text-gray-500" : "text-gray-900"
              }`}
            >
              <option value="" disabled className="text-gray-400">Seleccionar posición</option>
              <option value="delantero" className="text-gray-900">Delantero</option>
              <option value="centrocampista" className="text-gray-900">Centrocampista</option>
              <option value="defensor" className="text-gray-900">Defensor</option>
              <option value="arquero" className="text-gray-900">Arquero</option>
            </select> */}

            <PositionSelect 
              value={position} 
              onChange={setPosition} 
              className={`${fieldBase} ${position === "" ? "text-gray-500" : "text-gray-900"}`} />

            {/* Input de fecha */}
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className={`w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] bg-gray-50/50 font-medium ${
                birthDate === "" ? "text-gray-500" : "text-gray-900"
              }`}
            />

            <button
              type="submit"
              className="w-full bg-[#1B4D3E] text-white font-semibold
              px-6 py-3.5 rounded-xl hover:bg-[#14382d]
              transition-colors shadow-sm mt-1"
            >
              Registrarse
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-500">
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" className="text-[#1B4D3E] font-semibold hover:underline">
              Iniciar sesión
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}