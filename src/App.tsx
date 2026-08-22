import { useState, useEffect } from "react";
import axios from "axios";
import FieldList from "./components/FieldList";
import FieldForm from "./components/FieldForm";
import { getFields, createField, updateField, deleteField } from "./api/field";
import type { Field, FieldInput } from "./types/field";

function App() {
  const [fields, setFields] = useState<Field[]>([]);
  const [fieldEditing, setFieldEditing] = useState<Field | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadFields() {
    try {
      setLoading(true);
      const data = await getFields();
      setFields(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Could not connect to the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- valid initial fetch, rule false positive
    loadFields();
  }, []);

  async function handleSubmit(data: FieldInput) {
    try {
      if (fieldEditing) {
        await updateField(fieldEditing.id, data);
      } else {
        await createField(data);
      }
      setFieldEditing(null);
      await loadFields();
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        const errors = err.response?.data?.errors;
        if (errors && Array.isArray(errors)) {
          const messages = errors
            .map((e: { message: string }) => e.message)
            .join("\n");
          alert(messages);
          return;
        }
      }
      alert("An error occurred while saving the field.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this field?")) return;
    try {
      await deleteField(id);
      await loadFields();
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the field.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Canchas</h1>
      <FieldForm
        key={fieldEditing?.id ?? "new"}
        fieldEditing={fieldEditing}
        onSubmit={handleSubmit}
        onCancel={() => setFieldEditing(null)}
      />
      {loading && <p className="text-gray-500">Cargando canchas...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <FieldList
          fields={fields}
          onEdit={setFieldEditing}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;