import api from "../api/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import { useSidebar } from "../hooks/useSidebar";
import { getFields } from "../api/field";
import { createMatch } from "../api/matches";
import PositionSelect from "../components/PositionSelect";
import { POSITIONS } from "../constants/positions";
import type { Field } from "../types/field";
import type { MatchInput } from "../types/match";

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
    const data = err.response?.data as {
      error?: unknown;
      message?: unknown;
      mensaje?: unknown;
      errors?: { message?: string }[];
      errores?: { message?: string }[];
    } | undefined;
    const validationErrors = data?.errores ?? data?.errors;
    if (Array.isArray(validationErrors) && validationErrors.length > 0) {
      return validationErrors.map((issue) => issue.message).filter(Boolean).join(". ");
    }
    if (typeof data?.error === "string") return data.error;
    if (typeof data?.message === "string") return data.message;
    if (typeof data?.mensaje === "string") return data.mensaje;
    if (err.response?.status === 401 || err.response?.status === 403) {
      return "Tu sesión venció. Iniciá sesión nuevamente.";
    }
  }
  return "No se pudo crear el partido. Intentá de nuevo.";
}

export default function CreateMatch() {
  const navigate = useNavigate();
  const { collapsed: sidebarCollapsed, toggleSidebar } = useSidebar();
  const [fields, setFields] = useState<Field[]>([]);
  const [loadingFields, setLoadingFields] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [fieldId, setFieldId] = useState("");
  const [privacy, setPrivacy] = useState<MatchInput["privacy"]>("public");
  const [teamAName, setTeamAName] = useState("");
  const [positionType, setPositionType] = useState<MatchInput["positionType"] | "">("");
  const [secondaryPositionType, setSecondaryPositionType] = useState<MatchInput["secondaryPositionType"] | "">("");


  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  let cancelled = false;
  async function load() {
    try {
      const [fieldsData, me] = await Promise.all([
        getFields(),
        api.get<{ position: string }>("/users/me"),
      ]);
      if (cancelled) return;
      setFields(fieldsData);
      setPositionType(POSITIONS.find((position) => position.value === me.data.position)?.value ?? "");
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
    setError(null);
    if (!selectedField) {
      setError("Elegí una cancha.");
      return;
    }
    if (!Number.isInteger(duration) || duration < 1) {
      setError("La duración debe ser un número entero mayor a cero.");
      return;
    }

    setSubmitting(true);
    try {
      await createMatch({
        name,
        description: description || undefined,
        date,
        time,
        duration,
        privacy,
        fieldId: selectedField.id,
        teamAName,
        positionType: positionType || undefined,
        secondaryPositionType: secondaryPositionType || undefined,
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
    <div className="flex h-dvh w-full flex-col bg-gray-50">
      <AppHeader sidebarCollapsed={sidebarCollapsed} onToggleSidebar={toggleSidebar}>
        <span className="truncate text-sm font-semibold text-white sm:text-base">Crear partido</span>
      </AppHeader>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="min-w-0 flex-1 overflow-y-auto p-3 sm:p-5 lg:p-8">
          <section className="mx-auto max-w-2xl rounded-xl bg-white p-4 shadow sm:p-6">
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
                <label htmlFor="teamAName" className={labelClass}>
                  Nombre de tu equipo
                </label>
                <input
                  id="teamAName"
                  value={teamAName}
                  onChange={(event) => setTeamAName(event.target.value)}
                  maxLength={50}
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Tu posición principal (opcional)</label>
                  <PositionSelect
                    value={positionType ?? ""}
                    onChange={(value) => setPositionType(value as MatchInput["positionType"] | "")}
                    className={inputClass}
                    required={false}
                    wildcardLabel="Comodín: donde haga falta"
                  />
                </div>
                <div>
                  <label className={labelClass}>Tu posición secundaria (opcional)</label>
                  <PositionSelect
                    value={secondaryPositionType ?? ""}
                    onChange={(value) => setSecondaryPositionType(value as MatchInput["secondaryPositionType"] | "")}
                    className={inputClass}
                    required={false}
                    wildcardLabel="Comodín: donde haga falta"
                  />
                </div>
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
                      {f.locality ? ` — ${f.locality.nombre}` : ""} ({f.category.name})
                    </option>
                  ))}
                </select>
                {!loadingFields && fields.length === 0 && (
                  <p className="mt-1 text-sm text-gray-500">Todavía no hay canchas cargadas.</p>
                )}
                {selectedField && (
                  <p className="mt-1 text-sm text-gray-500">
                    Formato: {selectedField.category.name} · {selectedField.category.playersPerTeam} por equipo · {selectedField.category.surfaceType} · {selectedField.address} · Precio: ${selectedField.price}
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
                  onChange={(e) => setPrivacy(e.target.value as MatchInput["privacy"])}
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

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="submit"
                  disabled={submitting || fields.length === 0}
                  className="w-full rounded-xl bg-[#1B4D3E] px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-[#14382d] disabled:opacity-50 sm:w-auto"
                >
                  {submitting ? "Creando..." : "Crear partido"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="w-full rounded-xl bg-gray-200 px-6 py-3 hover:bg-gray-300 sm:w-auto"
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

