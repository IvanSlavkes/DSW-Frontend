import { useEffect, useState } from "react";
import { createFieldCategory, deleteFieldCategory, getFieldCategories, updateFieldCategory } from "../api/field-category";
import type { FieldCategoryInput } from "../api/field-category";
import type { FieldCategory } from "../types/field";

const surfaces = ["Sintético", "Natural", "Sin especificar"];
const empty: FieldCategoryInput = { name: "", surfaceType: surfaces[0], playersPerTeam: 5 };
const formatName = (playersPerTeam: number, surfaceType: string) => "Fútbol " + playersPerTeam + " · " + surfaceType;

export default function FieldCategoryManager() {
  const [categories, setCategories] = useState<FieldCategory[]>([]);
  const [editing, setEditing] = useState<FieldCategory | null>(null);
  const [form, setForm] = useState<FieldCategoryInput>(empty);
  const [error, setError] = useState("");

  async function load() { setCategories(await getFieldCategories()); }
  useEffect(() => {
    let cancelled = false;
    getFieldCategories()
      .then((loadedCategories) => {
        if (!cancelled) setCategories(loadedCategories);
      })
      .catch(() => {
        if (!cancelled) setError("No se pudieron cargar las categorías.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const duplicate = categories.some((category) =>
      category.id !== editing?.id && category.playersPerTeam === form.playersPerTeam && category.surfaceType === form.surfaceType,
    );
    if (duplicate) {
      setError("Esa combinación de tipo y superficie ya existe.");
      return;
    }

    const data = { ...form, name: formatName(form.playersPerTeam, form.surfaceType) };
    try {
      if (editing) await updateFieldCategory(editing.id, data);
      else await createFieldCategory(data);
      setEditing(null);
      setForm(empty);
      await load();
    } catch {
      setError("No se pudo guardar. Verificá si la categoría ya existe o si hay canchas asociadas.");
    }
  }

  function edit(category: FieldCategory) {
    setEditing(category);
    setForm({ name: category.name, surfaceType: category.surfaceType, playersPerTeam: category.playersPerTeam });
    setError("");
  }

  function cancelEdit() {
    setEditing(null);
    setForm(empty);
    setError("");
  }

  async function remove(category: FieldCategory) {
    if (!confirm("¿Eliminar la categoría " + category.name + "?")) return;
    try { await deleteFieldCategory(category.id); await load(); }
    catch { setError("No se puede eliminar: la categoría puede tener canchas asociadas."); }
  }

  return <section className="space-y-4">
    <h1 className="text-2xl font-bold">Categorías de cancha</h1>
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-lg border p-4">
      <h2 className="text-lg font-semibold">{editing ? "Editar categoría" : "Nueva categoría"}</h2>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Tipo
        <select value={form.playersPerTeam} onChange={(event) => setForm({ ...form, playersPerTeam: Number(event.target.value) })} className="rounded border px-3 py-2">
          {[5, 7, 11].map((number) => <option key={number} value={number}>Fútbol {number}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Superficie
        <select value={form.surfaceType} onChange={(event) => setForm({ ...form, surfaceType: event.target.value })} className="rounded border px-3 py-2" required>
          {surfaces.map((surface) => <option key={surface} value={surface}>{surface}</option>)}
        </select>
      </label>
      <p className="text-sm text-gray-600">Nombre que se guardará: {formatName(form.playersPerTeam, form.surfaceType)}</p>
      <div className="flex gap-2">
        <button className="rounded bg-green-700 px-4 py-2 text-white">{editing ? "Guardar cambios" : "Crear categoría"}</button>
        {editing && <button type="button" onClick={cancelEdit} className="rounded bg-gray-200 px-4 py-2">Cancelar</button>}
      </div>
    </form>
    {error && <p role="alert" className="text-red-600">{error}</p>}
    <ul className="grid gap-3 sm:grid-cols-2">{categories.map((category) => <li key={category.id} className="rounded border p-4">
      <h2 className="font-semibold">{category.name}</h2>
      <p className="text-sm text-gray-600">{category.surfaceType} · {category.playersPerTeam} por equipo</p>
      <div className="mt-3 flex gap-2">
        <button onClick={() => edit(category)} className="rounded bg-blue-600 px-3 py-1 text-white">Editar</button>
        <button onClick={() => void remove(category)} className="rounded bg-red-600 px-3 py-1 text-white">Eliminar</button>
      </div>
    </li>)}</ul>
  </section>;
}
