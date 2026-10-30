import { useEffect, useState } from "react";
import { getLocalities } from "../api/locality";
import type { Locality } from "../types/locality";

const PROVINCE_NAME = "Santa Fe";
const DEPARTMENT_NAME = "Rosario";

const inputClass =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 disabled:bg-gray-100 disabled:text-gray-600";

interface Props {
  localityId: string;
  onChange: (localityId: string) => void;
}

export default function LocalitySelect({ localityId, onChange }: Props) {
  const [localities, setLocalities] = useState<Locality[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getLocalities();
        if (!cancelled) setLocalities(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label htmlFor="province" className="mb-1 block text-sm text-white/85">
          Provincia
        </label>
        <input
          id="province"
          value={PROVINCE_NAME}
          disabled
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="department"
          className="mb-1 block text-sm text-white/85"
        >
          Departamento
        </label>
        <input
          id="department"
          value={DEPARTMENT_NAME}
          disabled
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="locality" className="mb-1 block text-sm text-white/85">
          Localidad
        </label>
        <select
          id="locality"
          value={localityId ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
          required
        >
          <option value="">Elegí una localidad</option>
          {localities.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
