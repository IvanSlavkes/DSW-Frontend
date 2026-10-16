// src/pages/Login.tsx
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom"; // 👈 importamos el hook

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async () => {
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
    <div className="flex flex-col gap-4 p-6">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">
        Iniciar sesión
      </button>
    </div>
  );
}


