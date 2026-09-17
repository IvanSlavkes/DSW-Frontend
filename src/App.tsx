import { useState, useEffect } from 'react';
import axios from 'axios';
import FieldList from './components/FieldList';
import FieldForm from './components/FieldForm';
import MatchList from './components/MatchList';
import MatchForm from './components/MatchForm';
import { getFields, createField, updateField, deleteField } from './api/field';
import { getMatches, createMatch, updateMatch, deleteMatch } from './api/match';
import type { Field, FieldInput } from './types/field';
import type { Match, MatchInput } from './types/match';

function App() {
  const [tab, setTab] = useState<'fields' | 'matches'>('fields');

  const [fields, setFields] = useState<Field[]>([]);
  const [fieldEditing, setFieldEditing] = useState<Field | null>(null);

  const [matches, setMatches] = useState<Match[]>([]);
  const [matchEditing, setMatchEditing] = useState<Match | null>(null);

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
      setError('Could not connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  async function loadMatches() {
    try {
      setLoading(true);
      const data = await getMatches();
      setMatches(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tab === 'fields') {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- valid initial fetch, rule false positive
      loadFields();
    } else {
      loadMatches();
    }
  }, [tab]);

  async function handleFieldSubmit(data: FieldInput) {
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
            .join('\n');
          alert(messages);
          return;
        }
      }
      alert('An error occurred while saving the field.');
    }
  }

  async function handleFieldDelete(id: number) {
    if (!confirm('Are you sure you want to delete this field?')) return;
    try {
      await deleteField(id);
      await loadFields();
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the field.');
    }
  }

  async function handleMatchSubmit(data: MatchInput) {
    try {
      if (matchEditing) {
        await updateMatch(matchEditing.id, data);
      } else {
        await createMatch(data);
      }
      setMatchEditing(null);
      await loadMatches();
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        const mensaje = err.response?.data?.mensaje;
        if (mensaje) {
          alert(mensaje);
          return;
        }
      }
      alert('An error occurred while saving the match.');
    }
  }

  async function handleMatchDelete(id: number) {
    if (!confirm('Are you sure you want to delete this match?')) return;
    try {
      await deleteMatch(id);
      await loadMatches();
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the match.');
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab('fields')}
          className={`rounded px-3 py-1 ${tab === 'fields' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Canchas
        </button>
        <button
          onClick={() => setTab('matches')}
          className={`rounded px-3 py-1 ${tab === 'matches' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Partidos
        </button>
      </div>

      {tab === 'fields' && (
        <>
          <h1 className="mb-4 text-2xl font-bold">Canchas</h1>
          <FieldForm
            key={fieldEditing?.id ?? 'new'}
            fieldEditing={fieldEditing}
            onSubmit={handleFieldSubmit}
            onCancel={() => setFieldEditing(null)}
          />
          {loading && <p className="text-gray-500">Cargando canchas...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && (
            <FieldList
              fields={fields}
              onEdit={setFieldEditing}
              onDelete={handleFieldDelete}
            />
          )}
        </>
      )}

      {tab === 'matches' && (
        <>
          <h1 className="mb-4 text-2xl font-bold">Partidos</h1>
          <MatchForm
            key={matchEditing?.id ?? 'new'}
            matchEditing={matchEditing}
            onSubmit={handleMatchSubmit}
            onCancel={() => setMatchEditing(null)}
          />
          {loading && <p className="text-gray-500">Cargando partidos...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && (
            <MatchList
              matches={matches}
              onEdit={setMatchEditing}
              onDelete={handleMatchDelete}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
