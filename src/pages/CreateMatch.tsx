import api from "../api/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { getFields } from "../api/field";
import { createMatch } from "../api/matches";
import type { Field } from "../types/field";

const labelClass = "mb-1 block text-sm font-medium text-gray-700";
const inputClass =
  "w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]";

// fecha local (toISOString devuelve UTC y a la noche podría marcar "mañana")
function todayLocal(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (Array.isArray(data?.errors)) {
      return data.errors.map((e: { message: string }) => e.message).join(". ");
    }
    if (typeof data?.error === "string") return data.error;
    if (typeof data?.message === "string") return data.message;
  }
  return "No se pudo crear el partido. Intentá de nuevo.";
}

export default function CreateMatch() {
  const navigate = useNavigate();
  const [fields, setFields] = useState<Field[]>([]);
  const [loadingFields, setLoadingFields] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [fieldId, setFieldId] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [creatorId, setCreatorId] = useState<number | null>(null);


  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  let cancelled = false;
  async function load() {
    try {
      const [fieldsData, me] = await Promise.all([
        getFields(),
        api.get<{ id: number }>("/users/me"),
      ]);
      if (cancelled) return;
      setFields(fieldsData);
      setCreatorId(me.data.id);
    } catch (err) {
      console.error(err);
      if (!cancelled) setError("No se pudieron cargar los datos.");
    } finally {
      if (!cancelled) setLoadingFields(false);
    }
  }
  load();
  return () => {
    cancelled = true;
  };
}, []);

  const selectedField = fields.find((f) => String(f.id) === fieldId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedField) {
      setError("Elegí una cancha.");
      return;
    }
    setSubmitting(true);
    setError(null);

    if (creatorId === null) {
      setError("No se pudo identificar al usuario. Volvé a iniciar sesión.");
      return;
    }
    try {
      await createMatch({
        name,
        description: description || undefined,
        date,
        time,
        duration,
        privacy,
        fieldId: selectedField.id,
        creatorId,
      });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <header className="bg-white p-6 shadow">
          <h1 className="text-2xl font-bold text-[#1B4D3E]">Crear partido</h1>
        </header>

        <main className="p-6">
          <section className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold text-[#1B4D3E]">Datos del partido</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Nombre del partido
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Fútbol de los jueves"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>Descripción (opcional)</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={inputClass}
                  rows={3}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="date" className={labelClass}>
                    Fecha
                  </label>
                  <input
                    id="date"
                    type="date"
                    min={todayLocal()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="time" className={labelClass}>
                    Hora
                  </label>
                  <input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="field" className={labelClass}>
                  Cancha
                </label>
                <select
                  id="field"
                  value={fieldId}
                  onChange={(e) => setFieldId(e.target.value)}
                  disabled={loadingFields || fields.length === 0}
                  className={`${inputClass} disabled:bg-gray-100 disabled:text-gray-500`}
                  required
                >
                  <option value="">
                    {loadingFields ? "Cargando canchas..." : "Elegí una cancha"}
                  </option>
                  {fields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                      {f.locality ? ` — ${f.locality.nombre}` : ""} (Fútbol {f.type})
                    </option>
                  ))}
                </select>
                {!loadingFields && fields.length === 0 && (
                  <p className="mt-1 text-sm text-gray-500">Todavía no hay canchas cargadas.</p>
                )}
                {selectedField && (
                  <p className="mt-1 text-sm text-gray-500">
                    Formato: Fútbol {selectedField.type} · {selectedField.address}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="duration" className={labelClass}>Duración (minutos)</label>
                <input
                  id="duration"
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="privacy" className={labelClass}>
                  Privacidad
                </label>
                <select
                  id="privacy"
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className={inputClass}
                >
                  <option value="public">Público: cualquiera puede unirse</option>
                  <option value="private">Privado: se une con tu aprobación</option>
                </select>
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting || fields.length === 0}
                  className="rounded-xl bg-[#1B4D3E] px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-[#14382d] disabled:opacity-50"
                >
                  {submitting ? "Creando..." : "Crear partido"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="rounded-xl bg-gray-200 px-6 py-3 hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
