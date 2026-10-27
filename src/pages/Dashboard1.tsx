import { useState, useEffect } from 'react';
import axios from 'axios';
import FieldList from '../components/FieldList';
import FieldForm from '../components/FieldForm';
import FieldCategoryManager from '../components/FieldCategoryManager';
import MatchList from '../components/MatchList';
import MatchForm from '../components/MatchForm';
import NotificationList from '../components/NotificationList';
import NotificationForm from '../components/NotificationForm';
import RatingList from '../components/RatingList';
import RatingForm from '../components/RatingForm';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import LocalityList from '../components/LocalityList';
import LocalityForm from '../components/LocalityForm';
import MatchTeamList from '../components/MatchTeamList';
import MatchTeamForm from '../components/MatchTeamForm';
import TeamPositionList from '../components/TeamPositionList';
import TeamPositionForm from '../components/TeamPositionForm';
import FriendRequestList from '../components/FriendRequestList';
import FriendRequestForm from '../components/FriendRequestForm';
import { getFields, createField, updateField, deleteField } from '../api/field';
import { getMatches, createMatch, updateMatch, deleteMatch } from '../api/matches';
import {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
} from '../api/notification';
import {
  getRatings,
  createRating,
  updateRating,
  deleteRating,
} from '../api/rating';
import { getUsers, createUser, updateUser, deleteUser } from '../api/user';
import {
  getLocalities,
  createLocality,
  updateLocality,
  deleteLocality,
} from '../api/locality';
import {
  getMatchTeams,
  createMatchTeam,
  updateMatchTeam,
  deleteMatchTeam,
} from '../api/match-team';
import {
  getTeamPositions,
  createTeamPosition,
  updateTeamPosition,
  deleteTeamPosition,
} from '../api/team-position';
import {
  getFriendRequests,
  createFriendRequest,
  updateFriendRequestStatus,
  deleteFriendRequest,
} from '../api/friend-request';
import type { Field, FieldInput } from '../types/field';
import type { Match, MatchInput } from '../types/match';
import type { Notification, NotificationInput } from '../types/notification';
import type { Rating, RatingInput } from '../types/rating';
import type { User, UserInput } from '../types/user';
import type { Locality, LocalityInput } from '../types/locality';
import type { MatchTeam, MatchTeamInput } from '../types/match-team';
import type { TeamPosition, TeamPositionInput, TeamPositionUpdateInput } from '../types/team-position';
import type { FriendRequest, FriendRequestInput } from '../types/friend-request';

type Tab =
  | 'fields'
  | 'fieldCategories'
  | 'matches'
  | 'notifications'
  | 'ratings'
  | 'users'
  | 'localities'
  | 'matchTeams'
  | 'teamPositions'
  | 'friendRequests';

function App() {
  const [tab, setTab] = useState<Tab>('fields');
  const tabButtonClass = (active: boolean) => `rounded-xl border px-4 py-2 text-sm font-semibold transition ${active ? 'border-[#01AB48] bg-[#01AB48] text-white shadow-md' : 'border-white/10 bg-[#10372A] text-white/80 hover:bg-white/10 hover:text-white'}`;

  const [fields, setFields] = useState<Field[]>([]);
  const [fieldEditing, setFieldEditing] = useState<Field | null>(null);

  const [matches, setMatches] = useState<Match[]>([]);
  const [matchEditing, setMatchEditing] = useState<Match | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [ratings, setRatings] = useState<Rating[]>([]);
  const [ratingEditing, setRatingEditing] = useState<Rating | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [createUserFormOpen, setCreateUserFormOpen] = useState(false);

  const [localities, setLocalities] = useState<Locality[]>([]);
  const [localityEditing, setLocalityEditing] = useState<Locality | null>(null);

  const [matchTeams, setMatchTeams] = useState<MatchTeam[]>([]);
  const [matchTeamEditing, setMatchTeamEditing] = useState<MatchTeam | null>(
    null,
  );

  const [teamPositions, setTeamPositions] = useState<TeamPosition[]>([]);
  const [teamPositionEditing, setTeamPositionEditing] =
    useState<TeamPosition | null>(null);

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

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
      const data = await getNotifications({ all: true });
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

  async function loadMatchTeams() {
    try {
      setLoading(true);
      const data = await getMatchTeams();
      setMatchTeams(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  async function loadTeamPositions() {
    try {
      setLoading(true);
      const data = await getTeamPositions();
      setTeamPositions(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  async function loadFriendRequests() {
    try {
      setLoading(true);
      const data = await getFriendRequests();
      setFriendRequests(data);
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
    } else if (tab === 'localities') {
      loadLocalities();
    } else if (tab === 'matchTeams') {
      loadMatchTeams();
    } else if (tab === 'teamPositions') {
      loadTeamPositions();
    } else {
      loadFriendRequests();
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

  async function handleUserSubmit(data: UserInput): Promise<boolean> {
    try {
      await createUser(data);
      await loadUsers();
      return true;
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        const errores = err.response?.data?.errores;
        if (errores && Array.isArray(errores)) {
          const messages = errores
            .map((e: { message: string }) => e.message)
            .join('\n');
          alert(messages);
          return false;
        }
        const mensaje = err.response?.data?.mensaje;
        if (mensaje) {
          alert(mensaje);
          return false;
        }
      }
      alert('An error occurred while saving the user.');
      return false;
    }
  }

  async function handleUserSave(user: User, data: UserInput) {
    try {
      const { password, ...rest } = data;
      await updateUser(user.id, password ? { ...rest, password } : rest);
      await loadUsers();
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
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

  async function handleMatchTeamSubmit(data: MatchTeamInput) {
    try {
      if (matchTeamEditing) {
        await updateMatchTeam(matchTeamEditing.id, {
          name: data.name,
          color: data.color,
        });
      } else {
        await createMatchTeam(data);
      }
      setMatchTeamEditing(null);
      await loadMatchTeams();
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        const mensaje = err.response?.data?.mensaje;
        if (mensaje) {
          alert(mensaje);
          return;
        }
      }
      alert('An error occurred while saving the match team.');
    }
  }

  async function handleMatchTeamDelete(id: number) {
    if (!confirm('Are you sure you want to delete this team?')) return;
    try {
      await deleteMatchTeam(id);
      await loadMatchTeams();
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the match team.');
    }
  }

  async function handleTeamPositionCreate(data: TeamPositionInput) {
    try {
      await createTeamPosition(data);
      await loadTeamPositions();
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        const mensaje = err.response?.data?.mensaje;
        if (mensaje) {
          alert(mensaje);
          return;
        }
      }
      alert('An error occurred while creating the position.');
    }
  }

  async function handleTeamPositionUpdate(
    data: TeamPositionUpdateInput,
  ) {
    if (!teamPositionEditing) return;
    try {
      await updateTeamPosition(teamPositionEditing.id, data);
      setTeamPositionEditing(null);
      await loadTeamPositions();
    } catch (err) {
      console.error(err);
      alert('An error occurred while updating the position.');
    }
  }

  async function handleTeamPositionDelete(id: number) {
    if (!confirm('Are you sure you want to delete this position?')) return;
    try {
      await deleteTeamPosition(id);
      await loadTeamPositions();
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the position.');
    }
  }

  async function handleFriendRequestSubmit(data: FriendRequestInput) {
    try {
      await createFriendRequest(data);
      await loadFriendRequests();
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        const mensaje = err.response?.data?.mensaje;
        if (mensaje) {
          alert(mensaje);
          return;
        }
      }
      alert('An error occurred while creating the friend request.');
    }
  }

  async function handleFriendRequestAccept(id: number) {
    try {
      await updateFriendRequestStatus(id, 'accepted');
      await loadFriendRequests();
    } catch (err) {
      console.error(err);
      alert('An error occurred while accepting the request.');
    }
  }

  async function handleFriendRequestReject(id: number) {
    try {
      await updateFriendRequestStatus(id, 'rejected');
      await loadFriendRequests();
    } catch (err) {
      console.error(err);
      alert('An error occurred while rejecting the request.');
    }
  }

  async function handleFriendRequestDelete(id: number) {
    if (!confirm('Are you sure you want to delete this request?')) return;
    try {
      await deleteFriendRequest(id);
      await loadFriendRequests();
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the request.');
    }
  }

  return (
    <div className="admin-panel mx-auto max-w-7xl space-y-5 p-4 text-white sm:p-6">
      <section className="rounded-2xl border border-white/10 bg-[#09241B] p-5 shadow-xl sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#01AB48]">FutGO</p>
        <h1 className="mt-1 text-2xl font-black sm:text-3xl">Panel de administración</h1>
        <p className="mt-2 text-sm text-white/70">Gestioná usuarios, partidos y recursos de la plataforma.</p>
      </section>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTab('fields')}
          className={tabButtonClass(tab === 'fields')}
        >
          Canchas
        </button>
        <button onClick={() => setTab('fieldCategories')} className={tabButtonClass(tab === 'fieldCategories')}>Categorías</button>
        <button
          onClick={() => setTab('matches')}
          className={tabButtonClass(tab === 'matches')}
        >
          Partidos
        </button>
        <button
          onClick={() => setTab('notifications')}
          className={tabButtonClass(tab === 'notifications')}
        >
          Notificaciones
        </button>
        <button
          onClick={() => setTab('ratings')}
          className={tabButtonClass(tab === 'ratings')}
        >
          Calificaciones
        </button>
        <button
          onClick={() => setTab('users')}
          className={tabButtonClass(tab === 'users')}
        >
          Usuarios
        </button>
        <button
          onClick={() => setTab('localities')}
          className={tabButtonClass(tab === 'localities')}
        >
          Localidades
        </button>
        <button
          onClick={() => setTab('matchTeams')}
          className={tabButtonClass(tab === 'matchTeams')}
        >
          Equipos
        </button>
        <button
          onClick={() => setTab('teamPositions')}
          className={tabButtonClass(tab === 'teamPositions')}
        >
          Posiciones
        </button>
        <button
          onClick={() => setTab('friendRequests')}
          className={tabButtonClass(tab === 'friendRequests')}
        >
          Amigos
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

      {tab === 'fieldCategories' && <FieldCategoryManager />}

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
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold">Usuarios</h1>
            <button
              type="button"
              aria-expanded={createUserFormOpen}
              onClick={() => setCreateUserFormOpen((open) => !open)}
              className="rounded-xl border border-[#01AB48]/40 bg-[#10372A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#01AB48]"
            >
              {createUserFormOpen ? 'Cancelar creación' : '+ Crear usuario'}
            </button>
          </div>
          {createUserFormOpen && (
            <UserForm
              key="new-user"
              userEditing={null}
              onSubmit={async (data) => { if (await handleUserSubmit(data)) setCreateUserFormOpen(false); }}
              onCancel={() => setCreateUserFormOpen(false)}
            />
          )}
          {loading && <p className="text-gray-500">Cargando usuarios...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && (
            <UserList
              users={users}
              onSave={handleUserSave}
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

      {tab === 'matchTeams' && (
        <>
          <h1 className="mb-4 text-2xl font-bold">Equipos</h1>
          <MatchTeamForm
            key={matchTeamEditing?.id ?? 'new'}
            matchTeamEditing={matchTeamEditing}
            onSubmit={handleMatchTeamSubmit}
            onCancel={() => setMatchTeamEditing(null)}
          />
          {loading && <p className="text-gray-500">Cargando equipos...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && (
            <MatchTeamList
              matchTeams={matchTeams}
              onEdit={setMatchTeamEditing}
              onDelete={handleMatchTeamDelete}
            />
          )}
        </>
      )}

      {tab === 'teamPositions' && (
        <>
          <h1 className="mb-4 text-2xl font-bold">Posiciones</h1>
          <TeamPositionForm
            key={teamPositionEditing?.id ?? 'new'}
            teamPositionEditing={teamPositionEditing}
            onCreate={handleTeamPositionCreate}
            onUpdate={handleTeamPositionUpdate}
            onCancel={() => setTeamPositionEditing(null)}
          />
          {loading && <p className="text-gray-500">Cargando posiciones...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && (
            <TeamPositionList
              teamPositions={teamPositions}
              onEdit={setTeamPositionEditing}
              onDelete={handleTeamPositionDelete}
            />
          )}
        </>
      )}

      {tab === 'friendRequests' && (
        <>
          <h1 className="mb-4 text-2xl font-bold">Amigos</h1>
          <FriendRequestForm onSubmit={handleFriendRequestSubmit} />
          {loading && <p className="text-gray-500">Cargando solicitudes...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && (
            <FriendRequestList
              friendRequests={friendRequests}
              onAccept={handleFriendRequestAccept}
              onReject={handleFriendRequestReject}
              onDelete={handleFriendRequestDelete}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;





