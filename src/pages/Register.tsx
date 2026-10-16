// src/pages/Register.tsx
import { useState } from "react";
import axios, { AxiosError } from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:3000/auth/register", {
        name,
        lastName,
        email,
        password,
        position,
        birthDate, // formato YYYY-MM-DD
      });
      alert(res.data.message);
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      alert(err.response?.data?.error || "Error al registrarse");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center">Registro</h1>

      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Apellido"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
      />

      {/* Menú desplegable para posición */}
      <select
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Seleccionar posición</option>
        <option value="delantero">Delantero</option>
        <option value="centrocampista">Centrocampista</option>
        <option value="defensor">Defensor</option>
        <option value="arquero">Arquero</option>
      </select>

      <input
        type="date"
        placeholder="Fecha de nacimiento"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        className="border p-2 rounded"
      />

      <button
        onClick={handleRegister}
        className="bg-green-500 text-white p-2 rounded"
      >
        Registrarse
      </button>
    </div>
  );
}
