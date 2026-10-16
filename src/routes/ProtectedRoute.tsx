import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { FullPageLoader } from '../components/layout/FullPageLoader';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from './paths';
import type { RedirectState } from './redirect';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullPageLoader />;

  if (!user) {
    const state: RedirectState = { from: `${location.pathname}${location.search}` };
    return <Navigate to={ROUTES.login} replace state={state} />;
  }

  return children;
}
