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
import { argentinaDateAndTimeToIso, argentinaNowTimeInput, argentinaTodayDateInput } from "../utils/matchDateTime";

const labelClass = "mb-1 block text-sm font-semibold text-white/80";
const inputClass =
  "w-full min-w-0 rounded-xl border border-white/15 bg-[#10372A] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/45 focus:ring-2 focus:ring-[#01AB48] [color-scheme:dark]";

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
  const { open: mobileSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
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
  const [positionType, setPositionType] = useState("");
  const [secondaryPositionType, setSecondaryPositionType] = useState("");


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
        startsAt: argentinaDateAndTimeToIso(date, time),
        duration,
        privacy,
        fieldId: selectedField.id,
        teamAName,
        positionType: positionType ? positionType.toLowerCase() as MatchInput["positionType"] : undefined,
        secondaryPositionType: secondaryPositionType ? secondaryPositionType.toLowerCase() as MatchInput["secondaryPositionType"] : undefined,
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
    <div className="flex h-dvh min-h-screen w-full flex-col bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/Fondo.jpg')" }}>
      <div className="flex h-full w-full flex-col bg-[#061910]/55">
      <AppHeader mobileSidebarOpen={mobileSidebarOpen} onToggleSidebar={toggleSidebar} />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar open={mobileSidebarOpen} onNavigate={closeSidebar} />
        <main className="min-w-0 flex-1 overflow-y-auto px-3 py-5 sm:px-5 lg:px-8">
          <section className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#09241B] p-5 text-white shadow-xl sm:p-7">
            <h2 className="mb-2 text-2xl font-black">Organizar partido</h2>
            <p className="mb-6 text-sm text-white/65">Completá los datos para crear un nuevo encuentro.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Nombre del partido
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                    onChange={setPositionType}
                    className={inputClass}
                    required={false}
                    wildcardLabel="Comodín: donde haga falta"
                  />
                </div>
                <div>
                  <label className={labelClass}>Tu posición secundaria (opcional)</label>
                  <PositionSelect
                    value={secondaryPositionType ?? ""}
                    onChange={setSecondaryPositionType}
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
                  <label htmlFor="date" className={labelClass}>Fecha</label>
                  <input id="date" type="date" min={argentinaTodayDateInput()} value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label htmlFor="time" className={labelClass}>Hora (Argentina)</label>
                  <input id="time" type="time" min={date === argentinaTodayDateInput() ? argentinaNowTimeInput() : undefined} value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} required />
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
                  className={`${inputClass} disabled:bg-[#0A3123] disabled:text-white/50`}
                  required
                >
                  <option value="">
                    {loadingFields ? "Cargando canchas..." : "Elegí una cancha"}
                  </option>
                  {fields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                      {f.locality ? ` — ${f.locality.name}` : ""} ({f.category.name})
                    </option>
                  ))}
                </select>
                {!loadingFields && fields.length === 0 && (
                  <p className="mt-1 text-sm text-white/60">Todavía no hay canchas cargadas.</p>
                )}
                {selectedField && (
                  <p className="mt-1 text-sm text-white/65">
                    Formato: {selectedField.category.name} · {selectedField.address} · Precio: ${(selectedField.price)}
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
                <p role="alert" className="text-sm text-red-200">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="submit"
                  disabled={submitting || fields.length === 0}
                  className="w-full rounded-xl bg-[#01AB48] px-6 py-3 font-bold text-white shadow-sm transition-colors hover:bg-[#029b42] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {submitting ? "Creando..." : "Crear partido"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="w-full rounded-xl border border-white/15 bg-[#10372A] px-6 py-3 font-semibold text-white/85 transition hover:bg-white/10 hover:text-white sm:w-auto"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
      </div>
    </div>
  );
}
