import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import Sidebar from '../components/Sidebar';
import { useSidebar } from '../hooks/useSidebar';
import Dashboard1 from './Dashboard1';

export default function AdminDashboard() {
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { collapsed, toggleSidebar } = useSidebar();

  return (
    <div className="flex h-dvh min-h-screen w-full overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/Fondo.jpg')" }}>
      <div className="flex h-full w-full flex-col bg-[#061910]/55">
        <AppHeader sidebarCollapsed={collapsed} onToggleSidebar={toggleSidebar}>
          <div className="relative">
            <button type="button" aria-expanded={adminMenuOpen} aria-label="Abrir menú de administrador" onClick={() => setAdminMenuOpen((open) => !open)} className="rounded-xl px-3 py-2 font-semibold text-white transition hover:bg-white/10">
              Administración
            </button>
            {adminMenuOpen && <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-white/10 bg-[#09241B] p-1 text-white shadow-xl">
              <button type="button" onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-white/10">Cerrar sesión</button>
            </div>}
          </div>
        </AppHeader>
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <Sidebar collapsed={collapsed} isAdmin />
          <main className="min-w-0 flex-1 overflow-y-auto px-3 py-5 sm:px-5 lg:px-8">
            <Dashboard1 />
          </main>
        </div>
      </div>
    </div>
  );
}
