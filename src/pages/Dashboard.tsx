import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import MatchList from "../components/MatchList";
import NotificationList from "../components/NotificationList";
import UserForm from "../components/UserForm";
import type { Match } from "../types/match";
import type { Notification } from "../types/notification";
import type { User, UserInput } from "../types/user";
import axios from "axios";

export default function Dashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userEditing, setUserEditing] = useState<User | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    axios.get("http://localhost:3000/matches")
      .then(res => setMatches(res.data))
      .catch(err => console.error("Error cargando partidos:", err));

    axios.get("http://localhost:3000/notifications")
      .then(res => setNotifications(res.data))
      .catch(err => console.error("Error cargando notificaciones:", err));

    axios.get("http://localhost:3000/users/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => {
        // Guardamos el usuario logueado
        setUserEditing(res.data);
      })
      .catch(err => console.error("Error cargando usuario:", err));
  }, []);

  // Funciones para MatchList
  const handleEditMatch = (match: Match) => {
    console.log("Editar partido:", match);
  };

  const handleDeleteMatch = (id: number) => {
    console.log("Eliminar partido con id:", id);
  };

  // Funciones para NotificationList
  const handleMarkAsRead = (id: number) => {
    console.log("Marcar notificación como leída:", id);
  };

  const handleDeleteNotification = (id: number) => {
    console.log("Eliminar notificación:", id);
  };

  // Funciones para UserForm
  const handleSubmitUser = (data: UserInput) => {
    axios.put("http://localhost:3000/users/me", data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      alert("Usuario actualizado correctamente");
      setUserEditing(res.data);
    })
    .catch(err => console.error("Error actualizando usuario:", err));
  };

  const handleCancelUser = () => setUserEditing(userEditing);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Encabezado */}
        <header className="flex justify-between items-center p-6 bg-white shadow">
          <h1 className="text-2xl font-bold text-[#1B4D3E]">
            {userEditing 
              ? `¡Bienvenida, ${userEditing.name} ${userEditing.lastName}!` 
              : "¡Bienvenida!"}
          </h1>
          <div className="flex items-center gap-3">
            <img src="/images/profile.jpg" alt="Perfil" className="w-10 h-10 rounded-full object-cover" />
            <span className="font-medium text-gray-700">
              {userEditing ? `${userEditing.name} ${userEditing.lastName}` : "Usuario"}
            </span>
          </div>
        </header>

        {/* Secciones */}
        <main className="p-6 space-y-6">
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-[#1B4D3E] mb-4">Mis próximos partidos</h2>
            <MatchList matches={matches} onEdit={handleEditMatch} onDelete={handleDeleteMatch} />
          </section>

          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-[#1B4D3E] mb-4">Notificaciones</h2>
            <NotificationList notifications={notifications} onMarkAsRead={handleMarkAsRead} onDelete={handleDeleteNotification} />
          </section>

          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-[#1B4D3E] mb-4">Mi perfil</h2>
            {userEditing && (
              <UserForm 
                key={userEditing.id} 
                userEditing={userEditing} 
                onSubmit={handleSubmitUser} 
                onCancel={handleCancelUser} 
              />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
