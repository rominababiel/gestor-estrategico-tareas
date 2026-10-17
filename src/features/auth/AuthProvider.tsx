import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  loginWithEmail,
  loginWithGoogle,
  logout,
  registerWithEmail,
  reloadCurrentUser,
  sendPasswordReset,
  sendVerificationEmail,
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

  const refreshUser = useCallback(async () => {
    setUser(await reloadCurrentUser());
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: loginWithEmail,
      register: registerWithEmail,
      loginWithGoogle,
      sendPasswordReset,
      sendVerificationEmail,
      refreshUser,
      logout,
    }),
    [user, isLoading, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
