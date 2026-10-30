import AppHeader from '../components/AppHeader';
import Sidebar from '../components/Sidebar';
import { useSidebar } from '../hooks/useSidebar';
import Dashboard1 from './Dashboard1';

export default function AdminDashboard() {
  const { open: mobileSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

  return (
    <div className="flex h-dvh min-h-screen w-full overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/Fondo.jpg')" }}>
      <div className="flex h-full w-full flex-col bg-[#061910]/55">
        <AppHeader mobileSidebarOpen={mobileSidebarOpen} onToggleSidebar={toggleSidebar}>
        </AppHeader>
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <Sidebar open={mobileSidebarOpen} onNavigate={closeSidebar} isAdmin />
          <main className="min-w-0 flex-1 overflow-y-auto px-3 py-5 sm:px-5 lg:px-8">
            <Dashboard1 />
          </main>
        </div>
      </div>
    </div>
  );
}
