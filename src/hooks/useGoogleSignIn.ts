import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthErrorMessage } from '../features/auth/authErrorMessages';
import { ROUTES } from '../routes/paths';
import { useAsyncAction } from './useAsyncAction';
import { useAuth } from './useAuth';

export function useGoogleSignIn() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const signIn = useCallback(async () => {
    await loginWithGoogle();
    navigate(ROUTES.tasks, { replace: true });
  }, [loginWithGoogle, navigate]);

  return useAsyncAction(signIn, getAuthErrorMessage);
}
