import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LocalitySelect from "../components/LocalitySelect";
import PositionSelect from "../components/PositionSelect";
import { API_URL } from "../api/client";

const fieldBase = "w-full rounded-xl border border-gray-300 bg-gray-50/50 px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]";
const labelClass = "flex flex-col gap-1 text-left text-sm font-semibold text-gray-700";
const errorClass = "rounded-xl border border-[#F0B7C0] bg-[#FFF1F2] px-4 py-3 text-left text-sm font-semibold text-[#9F1D35]";

function getAdultBirthDateLimit() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());
  const part = (type: string) => Number(parts.find((item) => item.type === type)?.value);
  let year = part("year") - 18;
  const month = part("month");
  let day = part("day");
  day = Math.min(day, new Date(Date.UTC(year, month, 0)).getUTCDate());
  const pad = (value: number) => String(value).padStart(2, "0");
  return String(year).padStart(4, "0") + "-" + pad(month) + "-" + pad(day);
}

export default function Register() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [position, setPosition] = useState("");
  const [secondaryPosition, setSecondaryPosition] = useState("");
  const [description, setDescription] = useState("");
  const [localityId, setLocalityId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const maxBirthDate = getAdultBirthDateLimit();

  function continueToDetails(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    if (name.trim().length < 2 || lastName.trim().length < 2) {
      setErrorMessage("El nombre y el apellido deben tener al menos 2 caracteres.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("Ingresá un correo electrónico válido.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }
    setStep(2);
  }

  function continueToPositions(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    if (!localityId) {
      setErrorMessage("Elegí tu localidad para continuar.");
      return;
    }
    if (!birthDate) {
      setErrorMessage("Ingresá tu fecha de nacimiento.");
      return;
    }
    if (birthDate > maxBirthDate) {
      setErrorMessage("Tenés que tener al menos 18 años para registrarte.");
      return;
    }
    setStep(3);
  }

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    if (!position) {
      setErrorMessage("Elegí una posición principal para continuar.");
      return;
    }
    if (secondaryPosition && secondaryPosition === position) {
      setErrorMessage("La posición secundaria debe ser distinta a la principal.");
      return;
    }
    if (!localityId) {
      setErrorMessage("Elegí tu localidad para continuar.");
      return;
    }
    if (!birthDate) {
      setErrorMessage("Ingresá tu fecha de nacimiento.");
      return;
    }
    if (birthDate > maxBirthDate) {
      setErrorMessage("Tenés que tener al menos 18 años para registrarte.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(API_URL + "/auth/register", {
        name: name.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        position,
        secondaryPosition: secondaryPosition || null,
        description: description.trim() || undefined,
        localityId,
        birthDate,
      });
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError<{ error?: string }>(error)) {
        setErrorMessage(error.response?.data?.error ?? (error.response
          ? "No se pudo crear la cuenta. Revisá los datos e intentá de nuevo."
          : "No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo."));
      } else {
        setErrorMessage("Ocurrió un error inesperado al registrarte.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="register-page flex h-dvh w-full items-start justify-center overflow-x-hidden overflow-y-auto bg-cover bg-center px-3 py-3 sm:items-center sm:p-6" style={{ backgroundImage: "url('/images/Register.png')" }}>
      <main className="relative my-auto flex w-full max-w-md shrink-0 flex-col items-center overflow-hidden rounded-3xl border border-white/20 bg-white/95 p-4 text-center shadow-xl backdrop-blur-md sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[url('/images/Field.jpg')] bg-contain bg-center bg-no-repeat opacity-10" />
        <div className="relative z-10 flex w-full flex-col items-center">
          <img src="/images/Ball.png" alt="Pelota de fútbol con fuego" className="h-auto w-16 object-contain sm:w-20" />
          <h1 className="text-xl font-extrabold tracking-tight text-[#1B4D3E] sm:text-2xl">REGISTRO</h1>
          <p className="mb-3 mt-1 text-xs font-medium text-gray-500">Creá tu cuenta para unirte a FutGO</p>

          <div className="mb-3 w-full" aria-label={"Paso " + step + " de 3"}>
            <div className="mb-1.5 grid grid-cols-3 text-[10px] font-semibold leading-tight sm:text-xs">
              <span className={step === 1 ? "text-[#1B4D3E]" : "text-gray-500"}>1. Acceso</span>
              <span className={step === 2 ? "text-[#1B4D3E]" : "text-gray-500"}>2. Datos personales</span>
              <span className={step === 3 ? "text-[#1B4D3E]" : "text-gray-500"}>3. Perfil</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-[#01AB48] transition-all" style={{ width: step === 1 ? "33.333%" : step === 2 ? "66.666%" : "100%" }} />
            </div>
          </div>

          <form onSubmit={step === 1 ? continueToDetails : step === 2 ? continueToPositions : handleRegister} noValidate className="flex w-full flex-col gap-2.5">
            {errorMessage && <p role="alert" aria-live="polite" className={errorClass + " !px-3 !py-2 text-xs sm:text-sm"}>{errorMessage}</p>}

            {step === 1 ? (
              <>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <label className={labelClass}>Nombre<input autoComplete="given-name" value={name} onChange={(event) => setName(event.target.value)} className={fieldBase} /></label>
                  <label className={labelClass}>Apellido<input autoComplete="family-name" value={lastName} onChange={(event) => setLastName(event.target.value)} className={fieldBase} /></label>
                </div>
                <label className={labelClass}>Correo electrónico<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={fieldBase} /></label>
                <label className={labelClass}>Contraseña<input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className={fieldBase} /></label>
                <label className={labelClass}>Repetir contraseña<input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={fieldBase} /></label>
                <button type="submit" className="mt-1 w-full rounded-xl bg-[#1B4D3E] px-6 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-[#14382d]">Continuar</button>
              </>
            ) : step === 2 ? (
              <>
                <LocalitySelect localityId={localityId} onChange={setLocalityId} labelClassName="text-gray-700" showRegionFields={false} />
                <label className={labelClass}>Fecha de nacimiento
                  <input type="date" max={maxBirthDate} value={birthDate} onChange={(event) => setBirthDate(event.target.value)} className={fieldBase} />
                  <span className="text-xs font-normal text-gray-500">Debés tener 18 años o más.</span>
                </label>
                <div className="mt-1 flex gap-3">
                  <button type="button" onClick={() => { setErrorMessage(""); setStep(1); }} className="w-1/3 rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100">Atrás</button>
                  <button type="submit" className="w-2/3 rounded-xl bg-[#1B4D3E] px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-[#14382d]">Continuar</button>
                </div>
              </>
            ) : (
              <>
                <label className={labelClass}>Posición principal
                  <PositionSelect value={position} onChange={setPosition} className={fieldBase} />
                </label>
                <label className={labelClass}>Posición secundaria (opcional)
                  <PositionSelect value={secondaryPosition} onChange={setSecondaryPosition} required={false} wildcardLabel="Sin segunda posición" className={fieldBase} />
                </label>
                <label className={labelClass}>Descripción (opcional)
                  <textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={1000} rows={2} className={fieldBase} />
                </label>
                <div className="mt-1 flex gap-3">
                  <button type="button" onClick={() => { setErrorMessage(""); setStep(2); }} className="w-1/3 rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100">Atrás</button>
                  <button type="submit" disabled={submitting} className="w-2/3 rounded-xl bg-[#1B4D3E] px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-[#14382d] disabled:cursor-wait disabled:opacity-70">{submitting ? "Creando cuenta..." : "Crear cuenta"}</button>
                </div>
              </>
            )}
          </form>

          <div className="mt-4 text-sm text-gray-500">
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" className="font-semibold text-[#1B4D3E] hover:underline">Iniciar sesión</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
