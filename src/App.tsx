import { useState, useEffect } from "react";
import CanchaList from "./components/CanchaList";
import CanchaForm from "./components/CanchaForm";
import { getCanchas, createCancha, updateCancha, deleteCancha } from "./api/canchas";
import type { Cancha, CanchaInput } from "./types/cancha";

function App() {
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [canchaEditando, setCanchaEditando] = useState<Cancha | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function cargarCanchas() {
    try {
      setCargando(true);
      const data = await getCanchas();
      setCanchas(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor. ¿Está corriendo el backend?");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarCanchas();
  }, []);

    async function handleSubmit(data: CanchaInput) {
    try {
      if (canchaEditando) {
        await updateCancha(canchaEditando.id, data);
      } else {
        await createCancha(data);
      }
      setCanchaEditando(null);
      await cargarCanchas();
    } catch (err: any) {
      console.error(err);
      const errores = err.response?.data?.errores;
      if (errores && Array.isArray(errores)) {
        const mensajes = errores.map((e: any) => e.message).join("\n");
        alert(mensajes);
      } else {
        alert("Ocurrió un error al guardar la cancha.");
      }
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Seguro que querés borrar esta cancha?")) return;
    try {
      await deleteCancha(id);
      await cargarCanchas();
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al borrar la cancha.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Canchas</h1>

      <CanchaForm
        canchaEditando={canchaEditando}
        onSubmit={handleSubmit}
        onCancel={() => setCanchaEditando(null)}
      />

      {cargando && <p className="text-gray-500">Cargando canchas...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!cargando && !error && (
        <CanchaList
          canchas={canchas}
          onEdit={setCanchaEditando}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;