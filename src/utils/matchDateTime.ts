const ARGENTINA_TIME_ZONE = "America/Argentina/Buenos_Aires";

function dateTimeParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: ARGENTINA_TIME_ZONE,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

export function argentinaDateKey(value: string | Date) {
  const parts = dateTimeParts(value instanceof Date ? value : new Date(value));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function argentinaDateTimeInput(value: string | Date) {
  const parts = dateTimeParts(value instanceof Date ? value : new Date(value));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export function argentinaNowDateTimeInput() {
  return argentinaDateTimeInput(new Date());
}

export function argentinaTodayDateInput() {
  return argentinaDateKey(new Date());
}

export function argentinaNowTimeInput() {
  const parts = dateTimeParts(new Date());
  return `${parts.hour}:${parts.minute}`;
}

export function startsAtInputToIso(value: string) {
  // El formulario expresa hora local de Argentina (UTC−03:00).
  return new Date(`${value}:00-03:00`).toISOString();
}

export function argentinaDateAndTimeToIso(date: string, time: string) {
  return startsAtInputToIso(`${date}T${time}`);
}

export function formatMatchDate(value: string) {
  const date = new Date(value);
  if (argentinaDateKey(date) === argentinaDateKey(new Date())) return "Hoy";
  const formatted = new Intl.DateTimeFormat("es-AR", {
    timeZone: ARGENTINA_TIME_ZONE, day: "2-digit", month: "long",
  }).format(date);
  return formatted.charAt(0).toLocaleUpperCase("es-AR") + formatted.slice(1);
}

export function formatMatchTime(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: ARGENTINA_TIME_ZONE, hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(new Date(value));
}