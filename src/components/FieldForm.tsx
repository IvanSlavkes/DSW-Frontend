import { useEffect, useState } from "react";
import LocalitySelect from "./LocalitySelect";
import { getFieldCategories } from "../api/field-category";
import type { Field, FieldInput, FieldCategory } from "../types/field";

interface Props {
  fieldEditing: Field | null;
  onSubmit: (data: FieldInput) => void;
  onCancel: () => void;
}

const empty = { name: "", address: "", categoryId: 0, price: 0, localityId: "" };

export default function FieldForm({ fieldEditing, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState(() => fieldEditing
    ? { name: fieldEditing.name, address: fieldEditing.address, categoryId: fieldEditing.categoryId, price: fieldEditing.price, localityId: fieldEditing.localityId }
    : empty);
  const [categories, setCategories] = useState<FieldCategory[]>([]);
  const [playersPerTeam, setPlayersPerTeam] = useState(fieldEditing?.category.playersPerTeam ?? 0);
  const [surfaceType, setSurfaceType] = useState(fieldEditing?.category.surfaceType ?? "");
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    void getFieldCategories().then((items) => {
      setCategories(items);
      if (fieldEditing) return;
      const firstCategory = items[0];
      if (firstCategory) {
        setPlayersPerTeam(firstCategory.playersPerTeam);
        setSurfaceType(firstCategory.surfaceType);
      }
    }).catch(() => setCategoryError("No se pudieron cargar los tipos y superficies."));
  }, [fieldEditing]);

  const surfacesForFormat = [...new Set(categories
    .filter((category) => category.playersPerTeam === playersPerTeam)
    .map((category) => category.surfaceType))];
  const selectedCategory = categories.find((category) =>
    category.playersPerTeam === playersPerTeam && category.surfaceType === surfaceType,
  );
  const formats = [...new Set(categories.map((category) => category.playersPerTeam))].sort((a, b) => a - b);

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: name === "price" ? Number(value) : value });
  }

  function handleFormatChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextFormat = Number(event.target.value);
    setPlayersPerTeam(nextFormat);
    const firstSurface = categories.find((category) => category.playersPerTeam === nextFormat)?.surfaceType ?? "";
    setSurfaceType(firstSurface);
    setCategoryError("");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedCategory) {
      setCategoryError("No existe una categoría cargada para esa combinación. Agregala en la pestaña Categorías.");
      return;
    }
    setCategoryError("");
    onSubmit({ ...form, categoryId: selectedCategory.id });
  }

  return <form onSubmit={handleSubmit} className="bg-[#09241B] mb-6 flex flex-col gap-3 rounded-lg border border-gray-200 p-4">
    <h2 className="text-lg font-semibold">{fieldEditing ? "Editar cancha" : "Nueva cancha"}</h2>
    <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" className="rounded border px-3 py-2" required />
    <input name="address" value={form.address} onChange={handleChange} placeholder="Dirección" className="rounded border px-3 py-2" required />

    <label className="flex flex-col gap-1 text-sm font-medium">
      Tipo
      <select value={playersPerTeam || ""} onChange={handleFormatChange} className="rounded border px-3 py-2" required>
        <option value="">Seleccionar tipo</option>
        {formats.map((format) => <option key={format} value={format}>Fútbol {format}</option>)}
      </select>
    </label>

    <label className="flex flex-col gap-1 text-sm font-medium">
      Superficie
      <select value={surfaceType} onChange={(event) => { setSurfaceType(event.target.value); setCategoryError(""); }} className="rounded border px-3 py-2" required>
        <option value="">Seleccionar superficie</option>
        {surfacesForFormat.map((surface) => <option key={surface} value={surface}>{surface}</option>)}
      </select>
    </label>

    {categories.length === 0 && !categoryError && <p className="text-sm text-amber-700">Primero cargá categorías en la pestaña Categorías.</p>}
    {categoryError && <p role="alert" className="text-sm text-amber-700">{categoryError}</p>}

    <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="Precio total de la cancha" className="rounded border px-3 py-2" required />
    <LocalitySelect localityId={form.localityId} onChange={(localityId) => setForm({ ...form, localityId })} />
    <div className="flex gap-2"><button type="submit" disabled={!categories.length} className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50">{fieldEditing ? "Guardar cambios" : "Crear cancha"}</button>{fieldEditing && <button type="button" onClick={onCancel} className="rounded bg-gray-300 px-4 py-2">Cancelar</button>}</div>
  </form>;
}
