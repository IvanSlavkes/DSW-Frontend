import { useState } from "react";

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("sidebar-collapsed") === "true",
  );

  function toggleSidebar() {
    const next = !collapsed;
    localStorage.setItem("sidebar-collapsed", String(next));
    setCollapsed(next);
  }

  return { collapsed, toggleSidebar };
}
