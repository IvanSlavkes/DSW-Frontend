import { useState } from "react";

export function useSidebar() {
  const [open, setOpen] = useState(false);

  function toggleSidebar() {
    setOpen((current) => !current);
  }

  function closeSidebar() {
    setOpen(false);
  }

  return { open, toggleSidebar, closeSidebar };
}
