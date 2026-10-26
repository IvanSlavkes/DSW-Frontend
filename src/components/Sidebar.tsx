import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getMyProfile } from "../api/user";

const menuItems = [
  {
    label: "Inicio",
    path: "/dashboard",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7" /></svg>,
  },
  {
    label: "Partidos",
    path: "/matches",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="16" rx="2" /><path strokeLinecap="round" d="M7 3v4m10-4v4M3 10h18" /></svg>,
  },
  {
    label: "Mi cuenta",
    path: "/profile",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 21a8 8 0 0 1 16 0" /></svg>,
  },
  {
    label: "Organizar partido",
    path: "/matches/create",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>,
  },
];

interface SidebarProps {
  collapsed: boolean;
  isAdmin?: boolean;
}

export default function Sidebar({ collapsed, isAdmin = false }: SidebarProps) {
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
    <aside
      id="app-sidebar"
      className={`flex h-[calc(100dvh-60px)] shrink-0 flex-col overflow-hidden bg-cover bg-center text-white shadow-xl transition-[width] duration-300 ease-in-out ${collapsed ? "w-[88px]" : "w-64"}`}
      style={{
        backgroundImage: "linear-gradient(to right, rgba(16, 30, 29, 0) 90%, rgba(16, 30, 29, 0.9) 100%), linear-gradient(to bottom, rgba(16, 30, 29, 0) 80%, rgba(16, 30, 29, 0.8) 100%), url('/images/DashboardTexture.png')",
        backgroundSize: "100% 100%, 100% 100%, cover",
        backgroundColor: "#1F2B24",
      }}
    >
      <nav className={`mt-4 flex flex-col ${collapsed ? "gap-1 px-1" : "gap-2 px-4"}`}>
        {visibleMenuItems.map((item) => {
          const isCreateMatchRoute = location.pathname.startsWith("/matches/create");
          const active =
            location.pathname === item.path ||
            (item.path !== "/dashboard" &&
              location.pathname.startsWith(item.path + "/") &&
              !(item.path === "/matches" && isCreateMatchRoute));

          return (
            <div key={item.path}>
              <Link
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`flex w-full rounded-xl transition-colors duration-200 ${collapsed ? "flex-col items-center justify-center gap-1 px-1 py-2" : "items-center gap-3 px-4 py-3"} ${
                  active
                    ? "bg-white/10 font-bold text-white"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center">{item.icon}</span>
                <span className={`transition-opacity duration-200 ${collapsed ? "max-w-full whitespace-normal text-center text-[10px] leading-3 opacity-100" : "overflow-hidden whitespace-nowrap opacity-100"}`}>{item.label}</span>
              </Link>
              {item.path === "/dashboard" && (
                <div className={`${collapsed ? "mx-2" : "mx-4"} mt-2 border-t border-white/30`} />
              )}
            </div>
          );
        })}
      </nav>

    </aside>
  );
}
