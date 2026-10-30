import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getMyProfile } from "../api/user";

const menuItems = [
  { label: "Inicio", path: "/dashboard", icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7" /></svg> },
  { label: "Partidos", path: "/matches", icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="16" rx="2" /><path strokeLinecap="round" d="M7 3v4m10-4v4M3 10h18" /></svg> },
  { label: "Mi cuenta", path: "/profile", icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 21a8 8 0 0 1 16 0" /></svg> },
  { label: "Organizar partido", path: "/matches/create", icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg> },
];

interface SidebarProps {
  open: boolean;
  onNavigate: () => void;
  isAdmin?: boolean;
}

export default function Sidebar({ open, onNavigate, isAdmin = false }: SidebarProps) {
  const location = useLocation();
  const [profileIsAdmin, setProfileIsAdmin] = useState(false);

  useEffect(() => {
    if (isAdmin || !localStorage.getItem("token")) return;
    let cancelled = false;
    getMyProfile()
      .then((profile) => { if (!cancelled) setProfileIsAdmin(profile.role === "admin"); })
      .catch(() => { if (!cancelled) setProfileIsAdmin(false); });
    return () => { cancelled = true; };
  }, [isAdmin]);

  const visibleMenuItems = isAdmin || profileIsAdmin
    ? [...menuItems, {
        label: "Administración",
        path: "/admin",
        icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4Z" /><path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" /></svg>,
      }]
    : menuItems;

  return (
    <>
      {open && <button type="button" aria-label="Cerrar menú" onClick={onNavigate} className="fixed inset-x-0 bottom-0 top-[60px] z-40 bg-black/55 md:hidden" />}
      <aside
        id="app-sidebar"
        className={`fixed bottom-0 left-0 top-[60px] z-50 flex w-64 flex-col overflow-y-auto bg-cover bg-center text-white shadow-xl transition-transform duration-300 ease-in-out md:static md:z-auto md:h-[calc(100dvh-60px)] md:w-[88px] md:shrink-0 md:translate-x-0 md:overflow-hidden ${open ? "translate-x-0" : "invisible -translate-x-full md:visible md:translate-x-0"}`}
        style={{
          backgroundImage: "linear-gradient(to right, rgba(16, 30, 29, 0) 90%, rgba(16, 30, 29, 0.9) 100%), linear-gradient(to bottom, rgba(16, 30, 29, 0) 80%, rgba(16, 30, 29, 0.8) 100%), url('/images/DashboardTexture.png')",
          backgroundSize: "100% 100%, 100% 100%, cover",
          backgroundColor: "#1F2B24",
        }}
      >
        <nav className="mt-4 flex flex-col gap-2 px-4 md:gap-1 md:px-1">
          {visibleMenuItems.map((item) => {
            const isCreateMatchRoute = location.pathname.startsWith("/matches/create");
            const active = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path + "/") && !(item.path === "/matches" && isCreateMatchRoute));
            return (
              <div key={item.path}>
                <Link
                  to={item.path}
                  onClick={onNavigate}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-200 md:flex-col md:justify-center md:gap-1 md:px-1 md:py-2 ${active ? "bg-white/10 font-bold text-white" : "text-white/90 hover:bg-white/10 hover:text-white"}`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center">{item.icon}</span>
                  <span className="whitespace-nowrap text-sm md:max-w-full md:whitespace-normal md:text-center md:text-[10px] md:leading-3">{item.label}</span>
                </Link>
                {item.path === "/dashboard" && <div className="mx-4 mt-2 border-t border-white/30 md:mx-2" />}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
