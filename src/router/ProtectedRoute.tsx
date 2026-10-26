import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { getMyProfile } from '../api/user';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const [access, setAccess] = useState<'checking' | 'allowed' | 'denied'>('checking');
  const hasToken = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    if (!hasToken) return;

    let cancelled = false;
    getMyProfile()
      .then((profile) => { if (!cancelled) setAccess(profile.role === 'admin' ? 'allowed' : 'denied'); })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
          localStorage.removeItem('token');
        }
        setAccess('denied');
      });

    return () => { cancelled = true; };
  }, [hasToken]);

  if (access === 'checking') {
    if (!hasToken) return <Navigate to="/login" replace />;
    return <main className="grid h-dvh place-items-center bg-[#061910] text-white">Verificando permisos...</main>;
  }
  if (access === 'denied') {
    return <Navigate to={hasToken && localStorage.getItem('token') ? '/dashboard' : '/login'} replace />;
  }
  return children;
}
