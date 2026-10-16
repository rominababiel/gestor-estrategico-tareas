import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  loginWithEmail,
  loginWithGoogle,
  logout,
  registerWithEmail,
  subscribeToAuthChanges,
} from '../../services/authService';
import type { AuthContextValue, AuthUser } from '../../types/auth';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: loginWithEmail,
      register: registerWithEmail,
      loginWithGoogle,
      logout,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
