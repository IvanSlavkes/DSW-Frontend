import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-3xl font-bold">FUTGO</h1>
      <div className="flex gap-4">
        <Link to="/login">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Iniciar sesión
          </button>
        </Link>
        <Link to="/register">
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Registrarse
          </button>
        </Link>
      </div>
    </div>
  );
}
