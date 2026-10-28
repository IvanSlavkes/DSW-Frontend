import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

// Si no hay sesión (token), manda al login en vez de mostrar la página
export default function PrivateRoute({ children }: { children: ReactNode }) {
  if (!localStorage.getItem('token')) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
