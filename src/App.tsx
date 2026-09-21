import { useState, useEffect } from 'react';
import axios from 'axios';
import FieldList from './components/FieldList';
import FieldForm from './components/FieldForm';
import MatchList from './components/MatchList';
import MatchForm from './components/MatchForm';
import NotificationList from './components/NotificationList';
import NotificationForm from './components/NotificationForm';
import RatingList from './components/RatingList';
import RatingForm from './components/RatingForm';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import LocalityList from './components/LocalityList';
import LocalityForm from './components/LocalityForm';
import { getFields, createField, updateField, deleteField } from './api/field';
import { getMatches, createMatch, updateMatch, deleteMatch } from './api/match';
import {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
} from './api/notification';
import {
  getRatings,
  createRating,
  updateRating,
  deleteRating,
} from './api/rating';
import { getUsers, createUser, updateUser, deleteUser } from './api/user';
import {
  getLocalities,
  createLocality,
  updateLocality,
  deleteLocality,
} from './api/locality';
import type { Field, FieldInput } from './types/field';
import type { Match, MatchInput } from './types/match';
import type { Notification, NotificationInput } from './types/notification';
import type { Rating, RatingInput } from './types/rating';
import type { User, UserInput } from './types/user';
import type { Locality, LocalityInput } from './types/locality';

type Tab =
  | 'fields'
  | 'matches'
  | 'notifications'
  | 'ratings'
  | 'users'
  | 'localities';

function App() {
  const [tab, setTab] = useState<Tab>('fields');

  const [fields, setFields] = useState<Field[]>([]);
  const [fieldEditing, setFieldEditing] = useState<Field | null>(null);

  const [matches, setMatches] = useState<Match[]>([]);
  const [matchEditing, setMatchEditing] = useState<Match | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [ratings, setRatings] = useState<Rating[]>([]);
  const [ratingEditing, setRatingEditing] = useState<Rating | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [userEditing, setUserEditing] = useState<User | null>(null);

  const [localities, setLocalities] = useState<Locality[]>([]);
  const [localityEditing, setLocalityEditing] = useState<Locality | null>(null);

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

  async function loadNotifications() {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  async function loadRatings() {
    try {
      setLoading(true);
      const data = await getRatings();
      setRatings(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  async function loadLocalities() {
    try {
      setLoading(true);
      const data = await getLocalities();
      setLocalities(data);
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
    } else if (tab === 'matches') {
      loadMatches();
    } else if (tab === 'notifications') {
      loadNotifications();
    } else if (tab === 'ratings') {
      loadRatings();
    } else if (tab === 'users') {
      loadUsers();
    } else {
      loadLocalities();
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

  async function handleNotificationSubmit(data: NotificationInput) {
    try {
      await createNotification(data);
      await loadNotifications();
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        const mensaje = err.response?.data?.mensaje;
        if (mensaje) {
          alert(mensaje);
          return;
        }
      }
      alert('An error occurred while creating the notification.');
    }
  }

  async function handleMarkAsRead(id: number) {
    try {
      await markAsRead(id);
      await loadNotifications();
    } catch (err) {
      console.error(err);
      alert('An error occurred while marking as read.');
    }
  }

  async function handleNotificationDelete(id: number) {
    if (!confirm('Are you sure you want to delete this notification?')) return;
    try {
      await deleteNotification(id);
      await loadNotifications();
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the notification.');
    }
  }

  async function handleRatingSubmit(data: RatingInput) {
    try {
      if (ratingEditing) {
        await updateRating(ratingEditing.id, {
          stars: data.stars,
          comment: data.comment,
        });
      } else {
        await createRating(data);
      }
      setRatingEditing(null);
      await loadRatings();
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        const mensaje = err.response?.data?.mensaje;
        if (mensaje) {
          alert(mensaje);
          return;
        }
      }
      alert('An error occurred while saving the rating.');
    }
  }

  async function handleRatingDelete(id: number) {
    if (!confirm('Are you sure you want to delete this rating?')) return;
    try {
      await deleteRating(id);
      await loadRatings();
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the rating.');
    }
  }

  async function handleUserSubmit(data: UserInput) {
    try {
      if (userEditing) {
        const { password, ...rest } = data;
        const payload = password ? { ...rest, password } : rest;
        await updateUser(userEditing.id, payload);
      } else {
        await createUser(data);
      }
      setUserEditing(null);
      await loadUsers();
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        const errores = err.response?.data?.errores;
        if (errores && Array.isArray(errores)) {
          const messages = errores
            .map((e: { message: string }) => e.message)
            .join('\n');
          alert(messages);
          return;
        }
        const mensaje = err.response?.data?.mensaje;
        if (mensaje) {
          alert(mensaje);
          return;
        }
      }
      alert('An error occurred while saving the user.');
    }
  }

  async function handleUserDelete(id: number) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the user.');
    }
  }

  async function handleLocalitySubmit(data: LocalityInput) {
    try {
      if (localityEditing) {
        await updateLocality(localityEditing.id, data);
      } else {
        await createLocality(data);
      }
      setLocalityEditing(null);
      await loadLocalities();
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        const mensaje = err.response?.data?.mensaje;
        if (mensaje) {
          alert(mensaje);
          return;
        }
      }
      alert('An error occurred while saving the locality.');
    }
  }

  async function handleLocalityDelete(id: string) {
    if (!confirm('Are you sure you want to delete this locality?')) return;
    try {
      await deleteLocality(id);
      await loadLocalities();
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the locality.');
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-4 flex flex-wrap gap-2">
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
        <button
          onClick={() => setTab('notifications')}
          className={`rounded px-3 py-1 ${tab === 'notifications' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Notificaciones
        </button>
        <button
          onClick={() => setTab('ratings')}
          className={`rounded px-3 py-1 ${tab === 'ratings' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Calificaciones
        </button>
        <button
          onClick={() => setTab('users')}
          className={`rounded px-3 py-1 ${tab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Usuarios
        </button>
        <button
          onClick={() => setTab('localities')}
          className={`rounded px-3 py-1 ${tab === 'localities' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Localidades
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

      {tab === 'notifications' && (
        <>
          <h1 className="mb-4 text-2xl font-bold">Notificaciones</h1>
          <NotificationForm onSubmit={handleNotificationSubmit} />
          {loading && (
            <p className="text-gray-500">Cargando notificaciones...</p>
          )}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && (
            <NotificationList
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleNotificationDelete}
            />
          )}
        </>
      )}

      {tab === 'ratings' && (
        <>
          <h1 className="mb-4 text-2xl font-bold">Calificaciones</h1>
          <RatingForm
            key={ratingEditing?.id ?? 'new'}
            ratingEditing={ratingEditing}
            onSubmit={handleRatingSubmit}
            onCancel={() => setRatingEditing(null)}
          />
          {loading && (
            <p className="text-gray-500">Cargando calificaciones...</p>
          )}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && (
            <RatingList
              ratings={ratings}
              onEdit={setRatingEditing}
              onDelete={handleRatingDelete}
            />
          )}
        </>
      )}

      {tab === 'users' && (
        <>
          <h1 className="mb-4 text-2xl font-bold">Usuarios</h1>
          <UserForm
            key={userEditing?.id ?? 'new'}
            userEditing={userEditing}
            onSubmit={handleUserSubmit}
            onCancel={() => setUserEditing(null)}
          />
          {loading && <p className="text-gray-500">Cargando usuarios...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && (
            <UserList
              users={users}
              onEdit={setUserEditing}
              onDelete={handleUserDelete}
            />
          )}
        </>
      )}

      {tab === 'localities' && (
        <>
          <h1 className="mb-4 text-2xl font-bold">Localidades</h1>
          <LocalityForm
            key={localityEditing?.id ?? 'new'}
            localityEditing={localityEditing}
            onSubmit={handleLocalitySubmit}
            onCancel={() => setLocalityEditing(null)}
          />
          {loading && <p className="text-gray-500">Cargando localidades...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && (
            <LocalityList
              localities={localities}
              onEdit={setLocalityEditing}
              onDelete={handleLocalityDelete}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
