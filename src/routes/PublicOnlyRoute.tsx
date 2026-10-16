import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { FullPageLoader } from '../components/layout/FullPageLoader';
import { useAuth } from '../hooks/useAuth';
import { getRedirectPath } from './redirect';

interface PublicOnlyRouteProps {
  children: ReactNode;
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullPageLoader />;

  if (user) return <Navigate to={getRedirectPath(location.state)} replace />;

  return children;
}
